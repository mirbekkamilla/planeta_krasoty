import chatModel from '../models/chatModel.js'

// Get all chat sessions (admin)
const getAllChats = async (req, res) => {
    try {
        const chats = await chatModel.find().sort({ lastMessageAt: -1 })
        res.json({ success: true, chats })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get single chat by sessionId
const getChatBySession = async (req, res) => {
    try {
        const { sessionId } = req.params
        let chat = await chatModel.findOne({ sessionId })
        if (!chat) {
            chat = await chatModel.create({ sessionId, messages: [] })
        }
        res.json({ success: true, chat })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Close/archive a chat session (admin)
const closeChat = async (req, res) => {
    try {
        const { sessionId } = req.params
        await chatModel.findOneAndUpdate({ sessionId }, { isOpen: false })
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { getAllChats, getChatBySession, closeChat }
