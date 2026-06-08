import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { MasterContext } from '../context/MasterContext'
import { AdminContext } from '../context/AdminContext'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 py-3.5 px-4 md:px-9 md:min-w-72 cursor-pointer transition-colors ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : 'hover:bg-gray-50'}`

const Sidebar = ({ isOpen, onClose }) => {

  const { mToken } = useContext(MasterContext)
  const { aToken } = useContext(AdminContext)

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div onClick={onClose} className='fixed inset-0 bg-black/30 z-40 md:hidden' />
      )}

      <div className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 md:w-auto md:min-h-screen bg-white border-r overflow-y-auto transition-transform duration-300 ease-in-out md:transition-none md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className='flex items-center justify-between px-4 py-3 border-b md:hidden'>
          <p className='font-medium text-gray-700'>Меню</p>
          <button onClick={onClose} aria-label='Закрыть меню' className='p-1 text-gray-500 hover:text-primary transition-colors'>
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {aToken && <ul className='text-[#515151] mt-2 md:mt-5' onClick={onClose}>

          <NavLink to={'/admin-dashboard'} className={linkClass}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p>Дашборд</p>
          </NavLink>
          <NavLink to={'/all-appointments'} className={linkClass}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p>Все записи</p>
          </NavLink>
          <NavLink to={'/add-master'} className={linkClass}>
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p>Добавить мастера</p>
          </NavLink>
          <NavLink to={'/master-list'} className={linkClass}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p>Все мастера</p>
          </NavLink>
          <NavLink to={'/support'} className={linkClass}>
            <svg className='min-w-5 w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
            </svg>
            <p>Чат поддержки</p>
          </NavLink>
          <NavLink to={'/review-moderation'} className={linkClass}>
            <svg className='min-w-5 w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
            </svg>
            <p>Отзывы</p>
          </NavLink>
        </ul>}

        {mToken && <ul className='text-[#515151] mt-2 md:mt-5' onClick={onClose}>
          <NavLink to={'/master-dashboard'} className={linkClass}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p>Дашборд</p>
          </NavLink>
          <NavLink to={'/master-appointments'} className={linkClass}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p>Мои записи</p>
          </NavLink>
          <NavLink to={'/master-profile'} className={linkClass}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p>Мой профиль</p>
          </NavLink>
          <NavLink to={'/master-schedule'} className={linkClass}>
            <svg className='min-w-5 w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
            <p>Расписание</p>
          </NavLink>
          <NavLink to={'/master-stats'} className={linkClass}>
            <svg className='min-w-5 w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
            </svg>
            <p>Статистика</p>
          </NavLink>
        </ul>}
      </div>
    </>
  )
}

export default Sidebar
