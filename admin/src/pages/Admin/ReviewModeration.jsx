import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const StarRating = ({ rating }) => (
    <div className='flex items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                fill='currentColor'
                viewBox='0 0 20 20'
            >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
        ))}
    </div>
)

const ReviewModeration = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [reviews, setReviews] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    const loadReviews = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/reviews', { headers: { aToken } })
            if (data.success) setReviews(data.reviews)
        } catch (error) {
            console.log(error)
            toast.error('Ошибка загрузки отзывов')
        } finally {
            setLoading(false)
        }
    }

    const approveReview = async (reviewId) => {
        try {
            const { data } = await axios.patch(
                backendUrl + `/api/admin/reviews/${reviewId}/approve`,
                {},
                { headers: { aToken } }
            )
            if (data.success) {
                toast.success('Отзыв одобрен')
                loadReviews()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Ошибка')
        }
    }

    const deleteReview = async (reviewId) => {
        if (!confirm('Удалить этот отзыв?')) return
        try {
            const { data } = await axios.delete(
                backendUrl + `/api/admin/reviews/${reviewId}`,
                { headers: { aToken } }
            )
            if (data.success) {
                toast.success('Отзыв удалён')
                loadReviews()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Ошибка')
        }
    }

    useEffect(() => {
        loadReviews()
    }, [])

    const filtered = reviews.filter(r => {
        if (filter === 'pending') return !r.isApproved
        if (filter === 'approved') return r.isApproved
        return true
    })

    const pendingCount = reviews.filter(r => !r.isApproved).length

    return (
        <div className='m-5 w-full'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-xl font-semibold text-gray-800'>Модерация отзывов</h1>
                    {pendingCount > 0 && (
                        <p className='text-sm text-amber-600 mt-0.5'>{pendingCount} отзывов ожидают одобрения</p>
                    )}
                </div>
                <button
                    onClick={loadReviews}
                    className='text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors'
                >
                    Обновить
                </button>
            </div>

            {/* Filter tabs */}
            <div className='flex gap-2 mb-5'>
                {[
                    { key: 'all', label: 'Все', count: reviews.length },
                    { key: 'pending', label: 'Ожидают', count: pendingCount },
                    { key: 'approved', label: 'Одобренные', count: reviews.length - pendingCount },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            filter === tab.key
                                ? 'bg-primary text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className='flex justify-center py-20 text-gray-400'>
                    <p>Загрузка...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className='bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400'>
                    <p className='text-4xl mb-3'>💬</p>
                    <p className='font-medium'>Отзывов нет</p>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {filtered.map((review) => (
                        <div
                            key={review._id}
                            className={`bg-white rounded-2xl border p-5 transition-all ${
                                review.isApproved ? 'border-gray-200' : 'border-amber-200 bg-amber-50/30'
                            }`}
                        >
                            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <StarRating rating={review.rating} />
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                            review.isApproved
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {review.isApproved ? 'Одобрен' : 'Ожидает'}
                                        </span>
                                    </div>

                                    <p className='text-gray-800 text-sm leading-relaxed mb-3'>{review.comment}</p>

                                    <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400'>
                                        <span>Мастер: <span className='text-gray-600 font-medium'>{review.masterId}</span></span>
                                        <span>Запись: <span className='text-gray-600'>{review.appointmentId}</span></span>
                                        <span>{new Date(review.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className='flex sm:flex-col gap-2 flex-shrink-0'>
                                    {!review.isApproved && (
                                        <button
                                            onClick={() => approveReview(review._id)}
                                            className='flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors'
                                        >
                                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                            </svg>
                                            Одобрить
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteReview(review._id)}
                                        className='flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 border border-red-200 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-colors'
                                    >
                                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                        </svg>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewModeration
