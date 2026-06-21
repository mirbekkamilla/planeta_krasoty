import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const FALLBACK_SPECIALITIES = ['Парикмахер', 'Мастер маникюра', 'Мастер педикюра', 'Визажист', 'Бровист', 'Косметолог']
const RATING_FILTERS = [
  { value: 0, label: 'Все' },
  { value: 4, label: '4+' },
  { value: 3, label: '3+' },
  { value: 2, label: '2+' }
]

const StarRating = ({ rating }) => (
  <div className='flex items-center gap-0.5'>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
      </svg>
    ))}
  </div>
)

const Masters = () => {
  const { speciality } = useParams()
  const [filterMaster, setFilterMaster] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const navigate = useNavigate()
  const { masters, categories } = useContext(AppContext)
  const specialities = categories.length ? categories.map(category => category.name) : FALLBACK_SPECIALITIES

  const applyFilter = () => {
    let list = speciality
      ? masters.filter(master => master.speciality === speciality)
      : [...masters]

    if (minRating > 0) {
      list = list.filter(master => Number(master.rating || 0) >= minRating)
    }

    setFilterMaster(list)
  }

  useEffect(() => {
    applyFilter()
  }, [masters, speciality, minRating])

  const toggleSpeciality = (value) => {
    navigate(speciality === value ? '/masters' : `/masters/${value}`)
  }

  const resetFilters = () => {
    setMinRating(0)
    navigate('/masters')
  }

  return (
    <div>
      <p className='text-gray-600'>Выберите специалиста по нужному направлению.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Filters sidebar */}
        <div className='w-full sm:w-60 flex-shrink-0'>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`w-full py-2.5 px-4 border rounded-xl text-sm font-medium transition-all sm:hidden ${showFilter ? 'bg-primary border-primary text-white' : 'border-gray-200 text-gray-700'}`}
          >
            Фильтры
          </button>

          <div className={`${showFilter ? 'block' : 'hidden'} sm:block mt-3 sm:mt-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm`}>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>Направление</p>
            <div className='flex flex-col gap-1.5'>
              {specialities.map((value) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => toggleSpeciality(value)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all ${speciality === value ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-[#F2F4FF] hover:text-primary'}`}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className='my-4 h-px bg-gray-100' />

            <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>Рейтинг</p>
            <div className='grid grid-cols-4 gap-2'>
              {RATING_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => setMinRating(value)}
                  className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium transition-all ${minRating === value ? 'border-primary bg-primary text-white shadow-sm' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                >
                  {value > 0 && <span className='text-yellow-400'>★</span>}
                  {label}
                </button>
              ))}
            </div>

            {(speciality || minRating > 0) && (
              <button type='button' onClick={resetFilters} className='mt-4 w-full text-xs text-gray-400 transition-colors hover:text-primary'>
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {/* Master cards grid */}
        <div className='w-full min-w-0'>
          <div className='mb-3 flex items-center justify-between'>
            <p className='text-sm text-gray-500'>Найдено мастеров: <span className='font-medium text-gray-800'>{filterMaster.length}</span></p>
          </div>
          <div className='grid grid-cols-auto gap-4 gap-y-6'>
            {filterMaster.map((item) => (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              className='border border-[#E1E5FF] rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col'
              key={item._id}
            >
              <div className='h-48 bg-[#EAEFFF] overflow-hidden'>
                <img className='w-full h-full object-contain sm:object-cover' src={item.image} alt='' />
              </div>
              <div className='p-4 flex flex-col flex-1'>
                <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 rounded-full flex-shrink-0 ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                  <p>{item.available ? 'Принимает записи' : 'Не принимает'}</p>
                </div>
                <p className='text-[#262626] text-base font-medium mt-1 line-clamp-1'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                {item.rating > 0 && (
                  <div className='flex items-center gap-1.5 mt-2'>
                    <StarRating rating={item.rating} />
                    <span className='text-xs text-yellow-500 font-semibold'>{item.rating}</span>
                    {item.reviewCount > 0 && (
                      <span className='text-xs text-gray-400'>({item.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            ))}
            {filterMaster.length === 0 && (
              <div className='col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center'>
                <p className='text-gray-500'>Мастера с выбранными параметрами не найдены</p>
                <button type='button' onClick={resetFilters} className='mt-3 text-sm font-medium text-primary hover:underline'>Сбросить фильтры</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Masters
