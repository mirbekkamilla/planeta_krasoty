import React from 'react'
import { useNavigate } from 'react-router-dom'
import bookingBeautyTools from '../assets/booking_beauty_tools.webp'
import appointmentImage from '../assets/appointment_img.png'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='relative isolate my-10 flex overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5364ff] via-primary to-[#8490ff] px-6 shadow-xl shadow-primary/15 sm:px-10 md:my-20 md:mx-10 md:min-h-[360px] md:px-14 lg:px-12'>

            <div className='absolute -left-20 -top-24 h-56 w-56 rounded-full bg-white/10 blur-sm' />
            <div className='absolute bottom-[-90px] right-[-55px] h-64 w-64 rounded-full border-[38px] border-white/10' />

            {/* ------- Left Side ------- */}
            <div className='relative z-10 flex-1 pb-52 pt-8 sm:pb-60 sm:pt-10 md:py-16 lg:py-20 lg:pl-5'>
                <p className='mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70 sm:text-sm'>Красота начинается здесь</p>
                <div className='max-w-[560px] text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl'>
                    <p>Запишитесь онлайн</p>
                    <p className='mt-2 sm:mt-3'>к лучшим мастерам города</p>
                </div>
                <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='mt-6 rounded-full bg-white px-8 py-3 text-sm font-medium text-[#4f5de0] shadow-lg shadow-indigo-950/10 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:text-base'>Создать аккаунт</button>
            </div>

            {/* ------- Mobile Image ------- */}
            <img className='absolute bottom-[-14px] right-[-14px] z-[1] w-64 drop-shadow-[0_18px_22px_rgba(30,41,120,0.3)] sm:right-3 sm:w-72 md:hidden' src={bookingBeautyTools} alt='Инструменты и косметика салона красоты' />

            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img className='absolute bottom-[-8px] right-0 w-[92%] max-w-[340px] drop-shadow-[0_22px_30px_rgba(30,41,120,0.28)]' src={appointmentImage} alt='Мастер салона красоты' />
            </div>
        </div>
    )
}

export default Banner
