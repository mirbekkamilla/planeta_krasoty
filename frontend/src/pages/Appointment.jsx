import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedMasters from '../components/RelatedMasters'
import axios from 'axios'
import { toast } from 'react-toastify'

const portfolioCategories = ['Все работы', 'Окрашивание', 'Стрижки', 'Укладки', 'Уход', 'Прочее']

const DEFAULT_SERVICES_BY_SPECIALITY = {
  'Парикмахер':      ['Стрижки', 'Окрашивание', 'Укладки', 'Уход за волосами'],
  'Мастер маникюра': ['Маникюр', 'Покрытие гель-лак', 'Наращивание ногтей', 'Уход за руками'],
  'Мастер педикюра': ['Педикюр', 'Покрытие гель-лак', 'Аппаратный педикюр', 'Уход за ногами'],
  'Визажист':        ['Дневной макияж', 'Вечерний макияж', 'Свадебный макияж', 'Макияж для фото'],
  'Бровист':         ['Коррекция бровей', 'Окрашивание бровей', 'Ламинирование бровей', 'Архитектура бровей'],
  'Косметолог':      ['Чистка лица', 'Пилинг', 'Уход за кожей', 'Мезотерапия'],
  'Массажист':       ['Классический массаж', 'Расслабляющий массаж', 'Антицеллюлитный массаж', 'Точечный массаж'],
  'Лешмейкер':       ['Наращивание ресниц', 'Ламинирование ресниц', 'Снятие ресниц', 'Окрашивание ресниц'],
}

const StarRating = ({ rating, size = 'sm' }) => {
  const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${cls} ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  )
}

const StarSelector = ({ value, onChange }) => (
  <div className='flex items-center gap-1'>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        onClick={() => onChange(star)}
        className={`w-7 h-7 cursor-pointer transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
      </svg>
    ))}
  </div>
)

const Appointment = () => {
  const { docId } = useParams()
  const { masters, currencySymbol, backendUrl, token, getMastersData } = useContext(AppContext)
  const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']

  const [docInfo, setDocInfo] = useState(false)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [portfolioFilter, setPortfolioFilter] = useState('Все работы')
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [completedAppointments, setCompletedAppointments] = useState([])
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const navigate = useNavigate()

  const fetchDocInfo = async () => {
    const docInfo = masters.find((master) => master._id === docId)
    setDocInfo(docInfo)
  }

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/master/portfolio/${docId}`)
      if (data.success) setPortfolio(data.portfolio)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/user/reviews/${docId}`)
      if (data.success) setReviews(data.reviews)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCompletedAppointments = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        const completed = data.appointments.filter(a => a.docId === docId && a.isCompleted)
        setCompletedAppointments(completed)
        if (completed.length > 0) setSelectedAppointmentId(completed[0]._id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!selectedAppointmentId) {
      return toast.error('Выберите запись для отзыва')
    }
    setSubmittingReview(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/reviews',
        { appointmentId: selectedAppointmentId, rating: reviewForm.rating, comment: reviewForm.comment },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        setShowReviewForm(false)
        setReviewForm({ rating: 5, comment: '' })
        fetchReviews()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  const getAvailableSolts = async (serviceOverride) => {
    setDocSlots([])
    const svc = serviceOverride !== undefined ? serviceOverride : selectedService
    const step = svc ? svc.duration : (docInfo.slotDuration || 60)
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        // skip slot if it ends after working hours
        const slotEnd = new Date(currentDate)
        slotEnd.setMinutes(slotEnd.getMinutes() + step)
        if (slotEnd > endTime) break

        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        const slotDate = day + '_' + month + '_' + year
        const isSlotAvailable = !(docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime))
        if (isSlotAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        }
        currentDate.setMinutes(currentDate.getMinutes() + step)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Войдите в аккаунт, чтобы записаться')
      return navigate('/login')
    }

    const date = docSlots[slotIndex][0].datetime
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const slotDate = day + '_' + month + '_' + year

    try {
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime, service: selectedService }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getMastersData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (masters.length > 0) {
      fetchDocInfo()
    }
  }, [masters, docId])

  const checkFavorite = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(backendUrl + '/api/user/favorites', { headers: { token } })
      if (data.success) setIsFavorite(data.favorites.some(m => m._id === docId))
    } catch (error) { console.log(error) }
  }

  const handleToggleFavorite = async () => {
    if (!token) { navigate('/login'); return }
    setFavLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/favorites/toggle', { masterId: docId }, { headers: { token } })
      if (data.success) setIsFavorite(data.isFavorite)
    } catch (error) { console.log(error) }
    finally { setFavLoading(false) }
  }

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts()
      fetchPortfolio()
      fetchReviews()
      fetchCompletedAppointments()
      checkFavorite()
    }
  }, [docInfo])

  const filteredPortfolio = portfolio.filter(item =>
    portfolioFilter === 'Все работы' || item.category === portfolioFilter
  )

  const rating = docInfo?.rating || 0
  const reviewCount = docInfo?.reviewCount || 0

  const effectiveServices = docInfo?.services?.length > 0
    ? docInfo.services
    : (DEFAULT_SERVICES_BY_SPECIALITY[docInfo?.speciality] || []).map(name => ({
        name,
        price: docInfo?.fees || 0,
        duration: docInfo?.slotDuration || 60
      }))

  const ratingBreakdown = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1
    return acc
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

  return docInfo ? (
    <div>

      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
        <Link to='/' className='hover:text-primary transition-colors'>Главная</Link>
        <span>/</span>
        <Link to='/masters' className='hover:text-primary transition-colors'>Мастера</Link>
        <span>/</span>
        <span className='text-gray-800 font-medium'>{docInfo.name}</span>
      </nav>

      {/* Main profile card */}
      <div className='bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 mb-6'>

        {/* Photo */}
        <div className='flex-shrink-0'>
          <img
            className='w-44 h-52 sm:w-48 sm:h-56 object-cover rounded-xl bg-[#EAEFFF]'
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        {/* Info + Action buttons */}
        <div className='flex flex-1 gap-4 flex-col sm:flex-row'>

          {/* Info */}
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h1 className='text-2xl font-semibold text-gray-800'>{docInfo.name}</h1>
              <img className='w-5 h-5' src={assets.verified_icon} alt='verified' />
            </div>

            <p className='text-gray-500 text-sm mb-3'>{docInfo.speciality}</p>

            <div className='flex items-center gap-2 mb-4'>
              <StarRating rating={rating} />
              {rating > 0 ? (
                <>
                  <span className='text-yellow-500 font-semibold text-sm'>{rating}</span>
                  <span className='text-primary text-sm'>({reviewCount} отзывов)</span>
                </>
              ) : (
                <span className='text-gray-400 text-sm'>Нет отзывов</span>
              )}
            </div>

            <div className='mb-3'>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-800 mb-1'>
                О мастере <img className='w-3.5' src={assets.info_icon} alt='' />
              </p>
              <p className='text-sm text-gray-600 max-w-xl leading-relaxed'>{docInfo.about}</p>
            </div>

            <p className='text-gray-700 font-medium text-sm'>
              Стоимость услуг:{' '}
              <span className='text-primary font-semibold'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className='flex sm:flex-col gap-3 items-start sm:items-stretch'>
            <div className='relative'>
              <button
                onClick={() => setShowServiceDropdown(v => !v)}
                className='bg-primary text-white px-8 py-2.5 rounded-full font-medium text-sm hover:bg-indigo-600 transition-colors whitespace-nowrap flex items-center gap-2 w-full justify-center'
              >
                Записаться
                <svg className={`w-4 h-4 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {showServiceDropdown && (
                <div className='absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 overflow-hidden min-w-[240px]'>
                  <p className='text-xs text-gray-400 font-medium px-4 pt-3 pb-1'>Выберите услугу</p>
                  {effectiveServices.map((svc, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedService(svc)
                        setShowServiceDropdown(false)
                        setSlotTime('')
                        setShowBooking(true)
                        getAvailableSolts(svc)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-indigo-50 transition-colors ${selectedService?.name === svc.name ? 'bg-indigo-50 text-primary' : 'text-gray-700'}`}
                    >
                      <span className='text-sm font-medium'>{svc.name}</span>
                      <div className='text-right ml-4 flex-shrink-0'>
                        <p className='text-sm font-semibold text-primary'>{currencySymbol}{svc.price}</p>
                        <p className='text-xs text-gray-400'>{svc.duration} мин</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-60 ${
                isFavorite
                  ? 'bg-red-50 border-red-300 text-red-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <svg
                className={`w-4 h-4 flex-shrink-0 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-500'}`}
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking panel */}
      {showBooking && (
        <div className='bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6'>
          {/* Header */}
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100'>
            <p className='font-semibold text-gray-800'>Запись к мастеру</p>
          </div>

          <div className='p-6'>
            {selectedService && (
              <div className='flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3 mb-5'>
                <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0'></div>
                <div className='flex-1'>
                  <p className='text-xs text-indigo-400 font-medium'>Услуга</p>
                  <p className='text-sm font-semibold text-indigo-700'>{selectedService.name} · {selectedService.duration} мин · {currencySymbol}{selectedService.price}</p>
                </div>
                <button
                  onClick={() => { setSelectedService(null); setShowBooking(false); setShowServiceDropdown(true) }}
                  className='text-indigo-400 hover:text-indigo-600 text-xs underline'
                >изменить</button>
              </div>
            )}

            {(selectedService || !effectiveServices.length) && (
            <>
            {/* Day selector */}
            <div className='flex gap-2 overflow-x-auto pb-1 mb-5'>
              {docSlots.length > 0 && docSlots.map((item, index) => {
                const hasSlots = item.length > 0
                return (
                  <button
                    onClick={() => { if (hasSlots) { setSlotIndex(index); setSlotTime('') } }}
                    key={index}
                    disabled={!hasSlots}
                    className={`flex flex-col items-center py-3 px-4 min-w-[60px] rounded-2xl flex-shrink-0 transition-all border ${
                      slotIndex === index && hasSlots
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                        : hasSlots
                        ? 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        : 'border-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className='text-xs font-medium mb-0.5'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</span>
                    <span className='text-lg font-bold leading-none'>{item[0] && item[0].datetime.getDate()}</span>
                  </button>
                )
              })}
            </div>

            {/* Time grid */}
            {docSlots[slotIndex]?.length > 0 ? (
              <div className='grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6'>
                {docSlots[slotIndex].map((item, index) => (
                  <button
                    onClick={() => setSlotTime(item.time)}
                    key={index}
                    className={`py-2 text-sm rounded-xl border font-medium transition-all ${
                      item.time === slotTime
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {item.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className='text-center text-gray-400 text-sm py-6 mb-4'>Нет свободных слотов на этот день</p>
            )}

            {/* Summary + confirm */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 transition-all`}>
              {slotTime ? (
                <div className='flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3 flex-1'>
                  <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0'></div>
                  <div>
                    <p className='text-xs text-indigo-400 font-medium'>Выбрано</p>
                    <p className='text-sm font-semibold text-indigo-700'>
                      {daysOfWeek[docSlots[slotIndex]?.[0]?.datetime.getDay()]}, {docSlots[slotIndex]?.[0]?.datetime.getDate()} · {slotTime}
                      <span className='ml-2 text-primary'>· {currencySymbol}{selectedService ? selectedService.price : docInfo.fees}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-sm text-gray-400'>Выберите время для записи</p>
              )}
              <button
                onClick={bookAppointment}
                disabled={!slotTime}
                className='bg-primary text-white text-sm px-10 py-3 rounded-full hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0'
              >
                Подтвердить запись
              </button>
            </div>
            </>
            )}
          </div>
        </div>
      )}

      {/* Portfolio + Rating */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>

        {/* Portfolio */}
        <div className='lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='font-semibold text-gray-800'>Портфолио мастера</h2>

            <div className='relative'>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className='text-sm text-gray-600 flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors'
              >
                {portfolioFilter}
                <svg className={`w-4 h-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              {showFilterMenu && (
                <div className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[140px]'>
                  {portfolioCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setPortfolioFilter(cat); setShowFilterMenu(false) }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        portfolioFilter === cat
                          ? 'text-primary font-medium bg-indigo-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredPortfolio.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
              <svg className='w-12 h-12 mb-3 opacity-30' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <p className='text-sm'>Работ пока нет</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
              {filteredPortfolio.map((item) => (
                <div key={item._id} className='flex flex-col gap-1'>
                  <div className='aspect-square rounded-xl overflow-hidden bg-gray-100'>
                    <img
                      src={item.imageUrl}
                      alt={item.description || item.category}
                      className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  {(item.description || item.category) && (
                    <p className='text-xs text-center text-gray-600 line-clamp-1 leading-tight'>
                      {item.description || item.category}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating sidebar */}
        <div className='bg-white border border-gray-200 rounded-2xl p-6'>
          <div className='flex items-center gap-1 mb-4'>
            <h2 className='font-semibold text-gray-800'>Рейтинг</h2>
          </div>

          {reviewCount > 0 ? (
            <>
              <div className='flex items-center gap-3 mb-2'>
                <span className='text-5xl font-bold text-gray-800'>{rating}</span>
                <StarRating rating={rating} size='lg' />
              </div>
              <p className='text-sm text-gray-500 mb-5'>На основе {reviewCount} оценок</p>
              <div className='flex flex-col gap-2.5'>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingBreakdown[star] || 0
                  const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0
                  return (
                    <div key={star} className='flex items-center gap-2 text-sm'>
                      <span className='text-gray-600 w-3 text-right'>{star}</span>
                      <svg className='w-3.5 h-3.5 text-yellow-400 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                      <div className='flex-1 bg-gray-100 rounded-full h-2 overflow-hidden'>
                        <div className='bg-yellow-400 h-2 rounded-full transition-all' style={{ width: `${pct}%` }} />
                      </div>
                      <span className='text-gray-400 w-8 text-right text-xs'>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className='text-center py-8 text-gray-400'>
              <p className='text-3xl mb-2'>⭐</p>
              <p className='text-sm'>Отзывов пока нет</p>
            </div>
          )}

          <button
            onClick={() => navigate('/masters')}
            className='w-full mt-6 border border-primary text-primary py-2.5 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors'
          >
            Все мастера
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <div className='bg-white border border-gray-200 rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='font-semibold text-gray-800'>Отзывы клиентов</h2>
          {token && completedAppointments.length > 0 && (
            <button
              onClick={() => setShowReviewForm(true)}
              className='bg-primary text-white text-sm px-5 py-2 rounded-full hover:bg-indigo-600 transition-colors'
            >
              Написать отзыв
            </button>
          )}
          {!token && (
            <button
              onClick={() => navigate('/login')}
              className='text-sm text-primary border border-primary px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors'
            >
              Войти, чтобы оставить отзыв
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className='text-center py-10 text-gray-400'>
            <p className='text-3xl mb-2'>💬</p>
            <p className='text-sm'>Пока нет отзывов</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {reviews.map((review) => (
              <div key={review._id} className='border border-gray-100 rounded-xl p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <StarRating rating={review.rating} />
                  <span className='text-xs text-gray-400'>
                    {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className='text-sm text-gray-700 leading-relaxed'>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review form modal */}
      {showReviewForm && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-xl'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-semibold text-gray-800'>Написать отзыв</h2>
              <button onClick={() => setShowReviewForm(false)} className='text-gray-400 hover:text-gray-600'>
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={submitReview} className='flex flex-col gap-4'>
              {completedAppointments.length > 1 && (
                <div>
                  <label className='text-sm text-gray-600 mb-1 block'>Визит</label>
                  <select
                    value={selectedAppointmentId}
                    onChange={e => setSelectedAppointmentId(e.target.value)}
                    className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary'
                  >
                    {completedAppointments.map(a => (
                      <option key={a._id} value={a._id}>
                        {a.slotDate?.replace(/_/g, '.')} {a.slotTime}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className='text-sm text-gray-600 mb-2 block'>Оценка</label>
                <StarSelector value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
              </div>
              <div>
                <label className='text-sm text-gray-600 mb-1 block'>Ваш отзыв</label>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder='Поделитесь впечатлениями...'
                  rows={4}
                  className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none'
                />
              </div>
              <button
                type='submit'
                disabled={submittingReview}
                className='bg-primary text-white py-2.5 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-60'
              >
                {submittingReview ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  ) : null
}

export default Appointment
