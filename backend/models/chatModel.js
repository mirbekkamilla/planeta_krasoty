import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['user', 'admin'], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const chatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userName: { type: String, default: 'Гость' },
    userEmail: { type: String, default: '' },
    messages: [messageSchema],
    isOpen: { type: Boolean, default: true },
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true })

const chatModel = mongoose.models.chat || mongoose.model('chat', chatSchema)
export default chatModel
