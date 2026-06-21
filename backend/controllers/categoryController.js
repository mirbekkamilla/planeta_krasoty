import { v2 as cloudinary } from 'cloudinary'
import categoryModel from '../models/categoryModel.js'
import masterModel from '../models/masterModel.js'

const DEFAULT_CATEGORIES = [
    'Парикмахер',
    'Мастер маникюра',
    'Мастер педикюра',
    'Визажист',
    'Бровист',
    'Косметолог',
    'Массажист',
    'Лешмейкер'
]

const ensureCategories = async () => {
    if (await categoryModel.exists({})) return

    const masterCategories = await masterModel.distinct('speciality', { speciality: { $ne: '' } })
    const names = [...new Set([...DEFAULT_CATEGORIES, ...masterCategories])]

    try {
        await categoryModel.insertMany(names.map((name, order) => ({ name, order })), { ordered: false })
    } catch (error) {
        if (error?.code !== 11000) throw error
    }
}

const getActiveCategories = async (req, res) => {
    try {
        await ensureCategories()
        const categories = await categoryModel.find({ active: true }).sort({ order: 1, name: 1 })
        res.json({ success: true, categories })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        await ensureCategories()
        const categories = await categoryModel.find({}).sort({ order: 1, name: 1 })
        const usage = await masterModel.aggregate([
            { $group: { _id: '$speciality', count: { $sum: 1 } } }
        ])
        const usageByName = Object.fromEntries(usage.map(item => [item._id, item.count]))

        res.json({
            success: true,
            categories: categories.map(category => ({
                ...category.toObject(),
                mastersCount: usageByName[category.name] || 0
            }))
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const createCategory = async (req, res) => {
    try {
        const name = String(req.body.name || '').trim()
        if (!name) return res.json({ success: false, message: 'Введите название категории' })
        if (name.length > 60) return res.json({ success: false, message: 'Название слишком длинное' })
        if (await categoryModel.exists({ name })) {
            return res.json({ success: false, message: 'Такая категория уже существует' })
        }

        let image = ''
        let publicId = ''
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })
            image = upload.secure_url
            publicId = upload.public_id
        }

        const category = await categoryModel.create({
            name,
            image,
            publicId,
            order: Number(req.body.order) || 0,
            active: req.body.active !== 'false'
        })
        res.json({ success: true, message: 'Категория добавлена', category })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.categoryId)
        if (!category) return res.json({ success: false, message: 'Категория не найдена' })

        const name = String(req.body.name || '').trim()
        if (!name) return res.json({ success: false, message: 'Введите название категории' })
        const duplicate = await categoryModel.exists({ name, _id: { $ne: category._id } })
        if (duplicate) return res.json({ success: false, message: 'Такая категория уже существует' })

        const previousName = category.name
        category.name = name
        category.order = Number(req.body.order) || 0
        category.active = req.body.active !== 'false'

        if (req.file) {
            if (category.publicId) await cloudinary.uploader.destroy(category.publicId)
            const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })
            category.image = upload.secure_url
            category.publicId = upload.public_id
        }

        await category.save()
        if (previousName !== name) {
            await masterModel.updateMany({ speciality: previousName }, { $set: { speciality: name } })
        }

        res.json({ success: true, message: 'Категория обновлена', category })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.categoryId)
        if (!category) return res.json({ success: false, message: 'Категория не найдена' })

        const mastersCount = await masterModel.countDocuments({ speciality: category.name })
        if (mastersCount > 0) {
            return res.json({ success: false, message: `Категория используется у ${mastersCount} мастеров` })
        }

        if (category.publicId) await cloudinary.uploader.destroy(category.publicId)
        await category.deleteOne()
        res.json({ success: true, message: 'Категория удалена' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { getActiveCategories, getAllCategories, createCategory, updateCategory, deleteCategory }
