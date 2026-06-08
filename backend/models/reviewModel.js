import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    masterId: { type: String, required: true },
    userId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema)
export default reviewModel
