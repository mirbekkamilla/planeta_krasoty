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
          className='group md:hidden -ml-1 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-primary to-[#8690ff] text-white shadow-lg shadow-primary/25 transition active:scale-95'
        >
          <span className='h-0.5 w-5 rounded-full bg-white transition-transform group-hover:translate-x-0.5' />
          <span className='h-0.5 w-3.5 self-start ml-3 rounded-full bg-white transition-all group-hover:w-5' />
          <span className='h-0.5 w-5 rounded-full bg-white transition-transform group-hover:-translate-x-0.5' />
        </button>
        <img onClick={() => navigate('/')} className='w-28 sm:w-40 cursor-pointer' src={assets.logo} alt="Планета красоты" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 whitespace-nowrap'>{aToken ? 'Администратор' : 'Мастер'}</p>
      </div>
      <button onClick={() => logout()} className='bg-primary text-white text-sm px-5 sm:px-10 py-2 rounded-full whitespace-nowrap'>Выйти</button>
    </div>
  )
}

export default Navbar
