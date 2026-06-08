import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { MasterContext } from '../context/MasterContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ onMenuClick }) => {

  const { mToken, setMToken } = useContext(MasterContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    mToken && setMToken('')
    mToken && localStorage.removeItem('mToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 sm:gap-3 text-xs'>
        <button
          onClick={onMenuClick}
          aria-label='Открыть меню'
          className='md:hidden -ml-1 p-1.5 text-gray-600 hover:text-primary transition-colors'
        >
          <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
        <img onClick={() => navigate('/')} className='w-28 sm:w-40 cursor-pointer' src={assets.logo} alt="Планета красоты" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 whitespace-nowrap'>{aToken ? 'Администратор' : 'Мастер'}</p>
      </div>
      <button onClick={() => logout()} className='bg-primary text-white text-sm px-5 sm:px-10 py-2 rounded-full whitespace-nowrap'>Выйти</button>
    </div>
  )
}

export default Navbar
