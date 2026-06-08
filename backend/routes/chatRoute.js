import express from 'express'
import { getAllChats, getChatBySession, closeChat } from '../controllers/chatController.js'
import authAdmin from '../middleware/authAdmin.js'

const chatRouter = express.Router()

chatRouter.get('/all', authAdmin, getAllChats)
chatRouter.get('/:sessionId', getChatBySession)
chatRouter.post('/close/:sessionId', authAdmin, closeChat)

export default chatRouter
