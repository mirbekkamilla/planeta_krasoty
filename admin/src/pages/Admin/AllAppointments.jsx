import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>Все записи клиентов</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Клиент</p>
          <p>Возраст</p>
          <p>Дата и время</p>
          <p>Мастер</p>
          <p>Стоимость</p>
          <p>Действие</p>
        </div>
        {appointments.map((item, index) => (
          <React.Fragment key={index}>
            {/* Mobile card layout */}
            <div className='sm:hidden flex flex-col gap-2 text-gray-500 py-3 px-4 border-b hover:bg-gray-50'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 min-w-0'>
                  <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover flex-shrink-0' alt="" />
                  <p className='font-medium text-gray-700 truncate'>{item.userData.name}</p>
                </div>
                {item.cancelled ? <p className='text-red-400 text-xs font-medium flex-shrink-0'>Отменена</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium flex-shrink-0'>Выполнена</p> : <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer flex-shrink-0' src={assets.cancel_icon} alt="" />}
              </div>
              <p className='text-xs text-gray-400'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 min-w-0'>
                  <img src={item.docData.image} className='w-7 h-7 rounded-full object-cover bg-gray-200 flex-shrink-0' alt="" />
                  <p className='truncate'>{item.docData.name}</p>
                </div>
                <p className='font-medium text-gray-700 flex-shrink-0'>{currency}{item.amount}</p>
              </div>
            </div>

            {/* Desktop table row */}
            <div className='hidden sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
              <p>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
              </div>
              <p>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt="" /> <p>{item.docData.name}</p>
              </div>
              <p>{currency}{item.amount}</p>
              {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Отменена</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Выполнена</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          </React.Fragment>
        ))}
      </div>

    </div>
  )
}

export default AllAppointments
