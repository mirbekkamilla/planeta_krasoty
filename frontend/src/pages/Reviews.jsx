import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const StarRating = ({ rating, size = 'sm' }) => {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${cls} ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  )
}

const Reviews = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const INITIAL_COUNT = 6

  const [reviews, setReviews] = useState([])
  const [visible, setVisible] = useState(INITIAL_COUNT)
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/reviews')
      if (data.success) setReviews(data.reviews)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const totalReviews = reviews.length
  const overallRating = totalReviews
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
    : 0

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => { if (ratingBreakdown[r.rating] !== undefined) ratingBreakdown[r.rating]++ })

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-2'>Отзывы наших клиентов</h1>
        <p className='text-gray-500 text-sm'>Мы ценим каждого клиента и всегда рады вашим отзывам и предложениям.</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>

        {/* Left sidebar */}
        <div className='flex flex-col gap-4 lg:w-56 flex-shrink-0'>

          {/* Write review card */}
          <div className='bg-white border border-gray-200 rounded-2xl p-5'>
            <div className='w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3'>
              <svg className='w-5 h-5 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
            </div>
            <p className='font-semibold text-gray-800 text-sm mb-1'>Оставить отзыв</p>
            <p className='text-xs text-gray-500 mb-4 leading-relaxed'>Отзыв можно оставить после завершённого визита в разделе «Мои записи»</p>
            <button
              onClick={() => token ? navigate('/my-appointments') : navigate('/login')}
              className='w-full bg-primary text-white text-sm py-2 rounded-full hover:bg-indigo-600 transition-colors'
            >
              {token ? 'Мои записи' : 'Войти'}
            </button>
          </div>

          {/* Rating summary */}
          {totalReviews > 0 && (
            <div className='bg-white border border-gray-200 rounded-2xl p-5'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-4xl font-bold text-gray-800'>{overallRating}</span>
                <StarRating rating={Math.round(overallRating)} size='lg' />
              </div>
              <p className='text-xs text-gray-500 mb-4'>на основе {totalReviews} {totalReviews === 1 ? 'отзыва' : totalReviews < 5 ? 'отзывов' : 'отзывов'}</p>
              <div className='flex flex-col gap-2'>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className='flex items-center gap-2 text-xs'>
                    <span className='text-gray-600 w-3 text-right'>{star}</span>
                    <svg className='w-3 h-3 text-yellow-400 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <div className='flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden'>
                      <div
                        className='bg-yellow-400 h-1.5 rounded-full'
                        style={{ width: `${totalReviews ? (ratingBreakdown[star] / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                    <span className='text-gray-400 w-6 text-right'>{ratingBreakdown[star]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews grid */}
        <div className='flex-1'>
          {loading ? (
            <div className='flex items-center justify-center py-20 text-gray-400'>
              <p className='text-sm'>Загрузка отзывов...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
              <p className='text-4xl mb-3'>💬</p>
              <p className='text-sm'>Отзывов пока нет</p>
              <p className='text-xs mt-1'>Будьте первым — запишитесь к мастеру!</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                {reviews.slice(0, visible).map((review) => (
                  <div key={review._id} className='bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        {review.userImage ? (
                          <img src={review.userImage} alt={review.userName} className='w-10 h-10 rounded-full object-cover flex-shrink-0' />
                        ) : (
                          <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0'>
                            <span className='text-primary font-semibold text-sm'>{review.userName.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className='text-sm font-semibold text-gray-800 leading-tight'>{review.userName}</p>
                          {review.masterName && (
                            <p className='text-xs text-gray-400'>→ {review.masterName}</p>
                          )}
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <StarRating rating={review.rating} />
                        <p className='text-xs text-gray-400 mt-0.5'>{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <p className='text-sm text-gray-600 leading-relaxed'>{review.comment}</p>
                  </div>
                ))}
              </div>

              {visible < reviews.length && (
                <div className='flex justify-center mt-6'>
                  <button
                    onClick={() => setVisible(v => v + INITIAL_COUNT)}
                    className='flex items-center gap-2 border border-gray-300 text-gray-600 px-8 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors'
                  >
                    Показать ещё отзывы
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reviews
