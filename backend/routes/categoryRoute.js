import express from 'express'
import authAdmin from '../middleware/authAdmin.js'
import upload from '../middleware/multer.js'
import { createCategory, deleteCategory, getActiveCategories, getAllCategories, updateCategory } from '../controllers/categoryController.js'

const categoryRouter = express.Router()

categoryRouter.get('/active', getActiveCategories)
categoryRouter.get('/all', authAdmin, getAllCategories)
categoryRouter.post('/', authAdmin, upload.single('image'), createCategory)
categoryRouter.put('/:categoryId', authAdmin, upload.single('image'), updateCategory)
categoryRouter.delete('/:categoryId', authAdmin, deleteCategory)

export default categoryRouter
