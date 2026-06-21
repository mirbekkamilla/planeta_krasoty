import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
}, { timestamps: true })

const categoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema)

export default categoryModel
