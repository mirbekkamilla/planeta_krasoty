import express from 'express'
import { recommendMaster } from '../controllers/aiController.js'

const aiRouter = express.Router()

aiRouter.post('/recommend', recommendMaster)

export default aiRouter
