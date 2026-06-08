import React from 'react'
import { useContext, useEffect } from 'react'
import { MasterContext } from '../../context/MasterContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const MasterAppointments = () => {

  const { mToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(MasterContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (mToken) {
      getAppointments()
    }
  }, [mToken])

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>Мои записи</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Клиент</p>
          <p>Оплата</p>
          <p>Возраст</p>
          <p>Дата и время</p>
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
                <p className='text-xs border border-primary px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0'>
                  {item.payment ? 'Онлайн' : 'Наличные'}
                </p>
              </div>
              <p className='text-xs text-gray-400'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <div className='flex items-center justify-between gap-2'>
                <p className='font-medium text-gray-700'>{currency}{item.amount}</p>
                {item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>Отменена</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs font-medium'>Выполнена</p>
                    : <div className='flex gap-1'>
                      <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer' src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer' src={assets.tick_icon} alt="" />
                    </div>
                }
              </div>
            </div>

            {/* Desktop table row */}
            <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
              <p>{index}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.payment ? 'Онлайн' : 'Наличные'}
                </p>
              </div>
              <p>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Отменена</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Выполнена</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          </React.Fragment>
        ))}
      </div>

    </div>
  )
}

export default MasterAppointments
