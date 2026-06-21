import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/'>
          <li className='py-1'>ГЛАВНАЯ</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/masters'>
          <li className='py-1'>МАСТЕРА</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>О НАС</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>КОНТАКТЫ</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/reviews'>
          <li className='py-1'>ОТЗЫВЫ</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>Мой профиль</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>Мои записи</p>
                  <p onClick={() => navigate('/my-favorites')} className='hover:text-black cursor-pointer'>Избранное</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Выйти</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Создать аккаунт</button>
        }
        <button
          type='button'
          onClick={() => setShowMenu(true)}
          className='md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-primary hover:text-primary active:scale-95'
          aria-label='Открыть меню'
          aria-expanded={showMenu}
        >
          <img className='w-5' src={assets.menu_icon} alt="" />
        </button>

        {/* ---- Mobile Menu ---- */}
        <div className={`fixed inset-0 z-50 md:hidden ${showMenu ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!showMenu}>
          <button
            type='button'
            onClick={() => setShowMenu(false)}
            className={`absolute inset-0 bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'opacity-0'}`}
            aria-label='Закрыть меню'
          />

          <div className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-hidden rounded-l-[2rem] bg-white shadow-2xl transition-transform duration-300 ease-out ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/10' />
            <div className='relative flex items-center justify-between border-b border-gray-100 px-6 py-6'>
              <img onClick={() => { navigate('/'); setShowMenu(false) }} src={assets.logo} className='w-36 cursor-pointer' alt='Планета красоты' />
              <button
                type='button'
                onClick={() => setShowMenu(false)}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-primary/10 active:scale-95'
                aria-label='Закрыть меню'
              >
                <img src={assets.cross_icon} className='w-4' alt="" />
              </button>
            </div>

            <div className='relative px-6 pb-3 pt-7'>
              <p className='text-xs font-semibold uppercase tracking-[0.22em] text-primary'>Навигация</p>
            </div>
            <ul className='relative flex flex-col gap-2 px-4 text-base font-medium'>
              {[
                ['/', 'ГЛАВНАЯ'],
                ['/masters', 'МАСТЕРА'],
                ['/about', 'О НАС'],
                ['/contact', 'КОНТАКТЫ'],
                ['/reviews', 'ОТЗЫВЫ']
              ].map(([path, label]) => (
                <li key={path}>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to={path}
                    className={({ isActive }) => `group flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}
                  >
                    <span>{label}</span>
                    <span className='text-xl font-light transition-transform group-hover:translate-x-1' aria-hidden='true'>›</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className='relative mt-auto border-t border-gray-100 p-6'>
              {token && userData ? (
                <button onClick={() => { navigate('/my-profile'); setShowMenu(false) }} className='flex w-full items-center gap-3 rounded-2xl bg-gray-50 p-3 text-left transition hover:bg-primary/10'>
                  <img className='h-11 w-11 rounded-full object-cover ring-2 ring-white' src={userData.image} alt="" />
                  <span>
                    <span className='block text-sm font-semibold text-gray-800'>Мой профиль</span>
                    <span className='block text-xs text-gray-500'>Записи и настройки</span>
                  </span>
                </button>
              ) : (
                <button onClick={() => { navigate('/login'); setShowMenu(false) }} className='w-full rounded-2xl bg-primary px-5 py-3.5 font-medium text-white shadow-lg shadow-primary/25 transition hover:bg-[#5362ee] active:scale-[0.98]'>
                  Создать аккаунт
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
