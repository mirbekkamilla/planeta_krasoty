import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [bonusPoints, setBonusPoints] = useState(0)
    const [bonusApplied, setBonusApplied] = useState({})
    const [applyingBonus, setApplyingBonus] = useState('')
    const [rescheduleModal, setRescheduleModal] = useState(null) // { appointmentId, docId }
    const [rescheduleSlots, setRescheduleSlots] = useState([])
    const [rescheduleDay, setRescheduleDay] = useState(0)
    const [rescheduleTime, setRescheduleTime] = useState('')

    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadBonusPoints = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/loyalty', { headers: { token } })
            if (data.success) setBonusPoints(data.loyalty.bonusPoints)
        } catch (error) {
            console.log(error)
        }
    }

    const openReschedule = async (appointment) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/master/list`)
            const master = data.masters.find(m => m._id === appointment.docId)
            if (!master) return toast.error('Мастер не найден')

            const today = new Date()
            const slots = []
            for (let i = 1; i <= 14; i++) {
                const d = new Date(today)
                d.setDate(today.getDate() + i)
                const dow = d.getDay()
                const schedule = master.workSchedule?.[dow]
                if (schedule && schedule.isWorking === false) continue

                const startH = schedule ? parseInt(schedule.start.split(':')[0]) : 9
                const endH = schedule ? parseInt(schedule.end.split(':')[0]) : 21
                const step = master.slotDuration || 60
                const dateKey = `${d.getDate()}_${d.getMonth()}_${d.getFullYear()}`
                const booked = master.slots_booked?.[dateKey] || []

                const times = []
                for (let mins = startH * 60; mins + step <= endH * 60; mins += step) {
                    const h = Math.floor(mins / 60)
                    const m = mins % 60
                    const timeStr = `${h}:${String(m).padStart(2, '0')}`
                    if (!booked.includes(timeStr)) times.push(timeStr)
                }
                if (times.length > 0) {
                    slots.push({ date: d, dateKey, dayLabel: `${d.getDate()} ${months[d.getMonth()]}`, times })
                }
            }

            setRescheduleSlots(slots)
            setRescheduleDay(0)
            setRescheduleTime('')
            setRescheduleModal({ appointmentId: appointment._id })
        } catch (error) {
            console.log(error)
            toast.error('Ошибка загрузки слотов')
        }
    }

    const confirmReschedule = async () => {
        if (!rescheduleTime) return toast.error('Выберите время')
        const slot = rescheduleSlots[rescheduleDay]
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/reschedule-appointment',
                { appointmentId: rescheduleModal.appointmentId, newSlotDate: slot.dateKey, newSlotTime: rescheduleTime },
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                setRescheduleModal(null)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const applyBonus = async (appointmentId, amount) => {
        if (bonusPoints <= 0) return toast.error('Нет доступных бонусных баллов')
        const toUse = Math.min(bonusPoints, amount)
        setApplyingBonus(appointmentId)
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/use-bonus',
                { bonusToUse: toUse, appointmentId },
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                setBonusApplied(prev => ({ ...prev, [appointmentId]: data.discount }))
                setBonusPoints(prev => prev - data.discount)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setApplyingBonus('')
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Оплата записи',
            description: 'Оплата записи в салон красоты',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)
                try {
                    const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
            loadBonusPoints()
        }
    }, [token])

    return (
        <div>
            <div className='flex items-center justify-between pb-3 mt-12 border-b'>
                <p className='text-lg font-medium text-gray-600'>Мои записи</p>
                {bonusPoints > 0 && (
                    <div className='flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5'>
                        <span className='text-indigo-500 text-sm font-semibold'>{bonusPoints}</span>
                        <span className='text-indigo-400 text-sm'>бонусных баллов</span>
                    </div>
                )}
            </div>
            <div>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Адрес:</p>
                            <p>{item.docData.address.line1}</p>
                            <p>{item.docData.address.line2}</p>
                            <p className='mt-1'>
                                <span className='text-sm text-[#3C3C3C] font-medium'>Дата и время:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>
                            <p className='mt-1 font-medium text-[#3C3C3C]'>
                                Стоимость: <span className='text-primary'>₽{item.amount}</span>
                                {bonusApplied[item._id] && (
                                    <span className='ml-2 text-xs text-green-600 font-normal'>
                                        (−{bonusApplied[item._id]} бонусов применено)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                <>
                                    {bonusPoints > 0 && !bonusApplied[item._id] && (
                                        <button
                                            onClick={() => applyBonus(item._id, item.amount)}
                                            disabled={applyingBonus === item._id}
                                            className='text-indigo-600 sm:min-w-48 py-2 border border-indigo-200 rounded hover:bg-indigo-50 transition-all duration-300 text-xs'
                                        >
                                            {applyingBonus === item._id ? 'Применяю...' : `Применить бонусы (${Math.min(bonusPoints, item.amount)} б.)`}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setPayment(item._id)}
                                        className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                                    >
                                        Оплатить онлайн
                                    </button>
                                </>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                    <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" />
                                </button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                    <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" />
                                </button>
                            )}
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]'>Оплачено</button>
                            )}
                            {item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Выполнено</button>
                            )}
                            {!item.cancelled && !item.isCompleted && (
                                <button onClick={() => openReschedule(item)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                                    Перенести
                                </button>
                            )}
                            {!item.cancelled && !item.isCompleted && (
                                <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                                    Отменить запись
                                </button>
                            )}
                            {item.cancelled && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Запись отменена</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        {/* Reschedule modal */}
        {rescheduleModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                <div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800'>Перенести запись</h3>
                        <button onClick={() => setRescheduleModal(null)} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>✕</button>
                    </div>

                    {rescheduleSlots.length === 0 ? (
                        <p className='text-gray-400 text-sm text-center py-6'>Нет доступных слотов на ближайшие 2 недели</p>
                    ) : (
                        <>
                            <div className='flex gap-2 overflow-x-auto pb-2 mb-4'>
                                {rescheduleSlots.map((slot, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setRescheduleDay(i); setRescheduleTime('') }}
                                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm border transition-colors ${rescheduleDay === i ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}
                                    >
                                        {slot.dayLabel}
                                    </button>
                                ))}
                            </div>

                            <div className='grid grid-cols-4 gap-2 mb-5'>
                                {rescheduleSlots[rescheduleDay]?.times.map((t, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setRescheduleTime(t)}
                                        className={`py-1.5 text-sm rounded-lg border transition-colors ${rescheduleTime === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={confirmReschedule}
                                disabled={!rescheduleTime}
                                className='w-full py-2.5 bg-primary text-white rounded-full font-medium hover:opacity-90 disabled:opacity-40 transition-opacity'
                            >
                                Подтвердить перенос
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}
    </div>
)
}

export default MyAppointments
