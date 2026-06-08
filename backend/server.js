import express from "express"
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import masterRouter from "./routes/masterRoute.js"
import chatRouter from "./routes/chatRoute.js"
import aiRouter from "./routes/aiRoute.js"
import chatModel from "./models/chatModel.js"

// app config
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: { origin: '*' }
})
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/master", masterRouter)
app.use("/api/chat", chatRouter)
app.use("/api/ai", aiRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

// Socket.io chat logic
io.on('connection', (socket) => {

    // User joins their chat session
    socket.on('user:join', async ({ sessionId, userName, userEmail }) => {
        socket.join(sessionId)
        socket.join('admin-room')

        let chat = await chatModel.findOne({ sessionId })
        if (!chat) {
            chat = await chatModel.create({ sessionId, userName: userName || 'Гость', userEmail: userEmail || '', messages: [] })
        } else {
            let changed = false
            if (userName && chat.userName === 'Гость') { chat.userName = userName; changed = true }
            if (userEmail && !chat.userEmail) { chat.userEmail = userEmail; changed = true }
            if (changed) await chat.save()
        }

        // Notify admin room about new/active chat
        io.to('admin-room').emit('chat:updated', { sessionId, userName: chat.userName, userEmail: chat.userEmail })
        socket.emit('chat:history', chat.messages)
    })

    // Admin joins admin room
    socket.on('admin:join', () => {
        socket.join('admin-room')
    })

    // Admin opens a specific chat
    socket.on('admin:open-chat', async ({ sessionId }) => {
        socket.join(sessionId)
        const chat = await chatModel.findOne({ sessionId })
        if (chat) {
            socket.emit('chat:history', chat.messages)
        }
    })

    // User sends a message
    socket.on('user:message', async ({ sessionId, text }) => {
        const message = { sender: 'user', text, createdAt: new Date() }
        await chatModel.findOneAndUpdate(
            { sessionId },
            { $push: { messages: message }, lastMessageAt: new Date() }
        )
        io.to(sessionId).emit('message:new', message)
        io.to('admin-room').emit('chat:updated', { sessionId })
    })

    // Admin sends a message
    socket.on('admin:message', async ({ sessionId, text }) => {
        const message = { sender: 'admin', text, createdAt: new Date() }
        await chatModel.findOneAndUpdate(
            { sessionId },
            { $push: { messages: message }, lastMessageAt: new Date() }
        )
        io.to(sessionId).emit('message:new', message)
        io.to('admin-room').emit('chat:updated', { sessionId })
    })
})

httpServer.listen(port, () => console.log(`Server started on PORT:${port}`))
