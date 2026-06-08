import axios from 'axios'
import React, { useContext, useState } from 'react'
import { MasterContext } from '../context/MasterContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setMToken } = useContext(MasterContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/master/login', { email, password })
      if (data.success) {
        setMToken(data.token)
        localStorage.setItem('mToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-6 sm:p-8 w-[90vw] max-w-[340px] sm:w-96 sm:max-w-none border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state === 'Admin' ? 'Администратор' : 'Мастер'}</span> — Вход
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Пароль</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Войти</button>
        {
          state === 'Admin'
            ? <p>Вы мастер? <span onClick={() => setState('Master')} className='text-primary underline cursor-pointer'>Войти как мастер</span></p>
            : <p>Вы администратор? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Войти как администратор</span></p>
        }
      </div>
    </form>
  )
}

export default Login
