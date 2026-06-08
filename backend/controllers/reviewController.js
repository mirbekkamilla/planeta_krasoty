import reviewModel from '../models/reviewModel.js'
import appointmentModel from '../models/appointmentModel.js'
import masterModel from '../models/masterModel.js'

// Recalculate master rating from approved reviews
const recalcMasterRating = async (masterId) => {
    const result = await reviewModel.aggregate([
        { $match: { masterId, isApproved: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    const avgRating = result.length ? Math.round(result[0].avgRating * 10) / 10 : 0
    const reviewCount = result.length ? result[0].count : 0
    await masterModel.findByIdAndUpdate(masterId, { rating: avgRating, reviewCount })
}

// POST /api/user/reviews — publish review (only after completed appointment)
const createReview = async (req, res) => {
    try {
        const { userId, appointmentId, rating, comment } = req.body

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) {
            return res.json({ success: false, message: 'Запись не найдена' })
        }
        if (appointment.userId !== userId) {
            return res.json({ success: false, message: 'Нет доступа к этой записи' })
        }
        if (!appointment.isCompleted) {
            return res.json({ success: false, message: 'Отзыв можно оставить только после завершённого визита' })
        }

        const existing = await reviewModel.findOne({ appointmentId })
        if (existing) {
            return res.json({ success: false, message: 'Отзыв для этой записи уже существует' })
        }

        const masterId = appointment.docId
        await reviewModel.create({ masterId, userId, appointmentId, rating, comment })

        res.json({ success: true, message: 'Отзыв отправлен на модерацию' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/user/reviews/:masterId — approved reviews for a master
const getMasterReviews = async (req, res) => {
    try {
        const { masterId } = req.params
        const reviews = await reviewModel.find({ masterId, isApproved: true }).sort({ createdAt: -1 })
        res.json({ success: true, reviews })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// DELETE /api/user/reviews/:reviewId — user deletes own review
const deleteReview = async (req, res) => {
    try {
        const { userId } = req.body
        const { reviewId } = req.params

        const review = await reviewModel.findById(reviewId)
        if (!review) {
            return res.json({ success: false, message: 'Отзыв не найден' })
        }
        if (review.userId !== userId) {
            return res.json({ success: false, message: 'Нет доступа' })
        }

        const masterId = review.masterId
        await reviewModel.findByIdAndDelete(reviewId)
        await recalcMasterRating(masterId)

        res.json({ success: true, message: 'Отзыв удалён' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/user/reviews — all approved reviews (public, with user+master info)
const getAllApprovedReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({ isApproved: true }).sort({ createdAt: -1 }).lean()

        const userModel = (await import('../models/userModel.js')).default

        const enriched = await Promise.all(reviews.map(async (r) => {
            const user = await userModel.findById(r.userId).select('name image').lean()
            const master = await masterModel.findById(r.masterId).select('name').lean()
            return {
                ...r,
                userName: user?.name || 'Клиент',
                userImage: user?.image || '',
                masterName: master?.name || '',
            }
        }))

        res.json({ success: true, reviews: enriched })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/admin/reviews — all reviews including unapproved
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({}).sort({ createdAt: -1 })
        res.json({ success: true, reviews })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// PATCH /api/admin/reviews/:reviewId/approve — approve a review
const approveReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const review = await reviewModel.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true })
        if (!review) {
            return res.json({ success: false, message: 'Отзыв не найден' })
        }
        await recalcMasterRating(review.masterId)
        res.json({ success: true, message: 'Отзыв одобрен' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// DELETE /api/admin/reviews/:reviewId — admin deletes any review
const adminDeleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const review = await reviewModel.findByIdAndDelete(reviewId)
        if (!review) {
            return res.json({ success: false, message: 'Отзыв не найден' })
        }
        await recalcMasterRating(review.masterId)
        res.json({ success: true, message: 'Отзыв удалён' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { createReview, getMasterReviews, deleteReview, getAllApprovedReviews, getAllReviews, approveReview, adminDeleteReview }
