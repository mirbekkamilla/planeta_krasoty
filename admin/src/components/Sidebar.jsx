import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { MasterContext } from '../context/MasterContext'
import { AdminContext } from '../context/AdminContext'

const linkClass = ({ isActive }) =>
  `group mx-3 md:mx-0 mb-1 flex items-center gap-3 rounded-2xl md:rounded-none py-3.5 px-4 md:px-9 md:min-w-72 cursor-pointer transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 md:rounded-r-2xl [&>img]:brightness-0 [&>img]:invert' : 'hover:bg-[#F2F3FF] hover:text-primary hover:translate-x-1'}`

const Sidebar = ({ isOpen, onClose }) => {

  const { mToken } = useContext(MasterContext)
  const { aToken } = useContext(AdminContext)

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div onClick={onClose} className='fixed inset-0 bg-slate-950/45 backdrop-blur-[3px] z-40 md:hidden animate-[fadeIn_200ms_ease-out]' />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto flex flex-col w-[88%] max-w-[320px] md:w-auto md:max-w-none md:min-h-screen bg-white border-r overflow-y-auto rounded-r-[2rem] md:rounded-none shadow-2xl md:shadow-none transition-transform duration-300 ease-out md:transition-none md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className='relative overflow-hidden bg-gradient-to-br from-primary via-[#7280ff] to-[#98a1ff] px-5 pb-6 pt-5 text-white md:hidden'>
          <div className='absolute -right-10 -top-12 h-36 w-36 rounded-full border-[24px] border-white/10' />
          <div className='absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-white/10 blur-xl' />
          <div className='relative flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.2em] text-white/70'>Планета красоты</p>
              <p className='mt-1 text-xl font-semibold'>Панель управления</p>
            </div>
            <button onClick={onClose} aria-label='Закрыть меню' className='flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 active:scale-95'>
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <div className='relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur'>
            <span className='h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.15)]' />
            {aToken ? 'Администратор' : 'Мастер'}
          </div>
        </div>

        <div className='px-6 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 md:hidden'>Навигация</div>

        {aToken && <ul className='text-[#515151] mt-1 md:mt-5 pb-6 md:pb-0' onClick={onClose}>

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
          <NavLink to={'/job-applications'} className={linkClass}>
            <svg className='min-w-5 w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 17V7a2 2 0 012-2h6a2 2 0 012 2v10m-10 0a2 2 0 002 2h6a2 2 0 002-2m-10 0H7a2 2 0 01-2-2V9a2 2 0 012-2h2m6 0V5a2 2 0 00-2-2h-0a2 2 0 00-2 2v2m4 0H9' />
            </svg>
            <p>Отклики на вакансии</p>
          </NavLink>
        </ul>}

        {mToken && <ul className='text-[#515151] mt-1 md:mt-5 pb-6 md:pb-0' onClick={onClose}>
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
        <div className='mx-5 mb-5 mt-auto rounded-2xl bg-gradient-to-br from-[#F2F3FF] to-[#FAFAFF] p-4 md:hidden'>
          <p className='text-sm font-semibold text-gray-700'>Всё под рукой</p>
          <p className='mt-1 text-xs leading-5 text-gray-500'>Управляйте записями, профилем и расписанием в одном месте.</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
