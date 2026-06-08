import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Vacancies = () => {
  const { backendUrl } = useContext(AppContext)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/job-application', { name, phone, email, message })
      if (data.success) {
        toast.success(data.message)
        setName('')
        setPhone('')
        setEmail('')
        setMessage('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ОТКРЫТЫЕ <span className='text-gray-700 font-semibold'>ВАКАНСИИ</span></p>
      </div>

      <div className='my-10 max-w-lg mx-auto mb-28 text-sm'>
        <p className='text-gray-500 text-center mb-8'>Мы всегда рады талантливым мастерам в команду «Планета красоты». Расскажите немного о себе — мы свяжемся с вами в ближайшее время.</p>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          <div>
            <p className='text-gray-700 mb-1'>Имя</p>
            <input
              className='border border-[#DADADA] rounded w-full p-2 outline-none'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <p className='text-gray-700 mb-1'>Телефон</p>
            <input
              className='border border-[#DADADA] rounded w-full p-2 outline-none'
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <p className='text-gray-700 mb-1'>Email</p>
            <input
              className='border border-[#DADADA] rounded w-full p-2 outline-none'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <p className='text-gray-700 mb-1'>Расскажите о себе и опыте работы</p>
            <textarea
              className='border border-[#DADADA] rounded w-full p-2 outline-none'
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-50'
          >
            {loading ? 'Отправка...' : 'Отправить отклик'}
          </button>
        </form>
      </div>

    </div>
  )
}

export default Vacancies
