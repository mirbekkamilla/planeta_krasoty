import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>О <span className='text-gray-700 font-semibold'>НАС</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Добро пожаловать в наш салон красоты — место, где каждый клиент получает профессиональный уход и индивидуальный подход. Мы понимаем, как важно выглядеть и чувствовать себя на высоте, и поэтому создали платформу, которая делает запись к мастеру простой и удобной.</p>
          <p>Наш салон постоянно развивается: мы следим за новейшими тенденциями в индустрии красоты, обучаем мастеров и внедряем лучшие технологии ухода. Будь то первый визит или регулярное обслуживание — мы всегда рядом и готовы позаботиться о вас.</p>
          <b className='text-gray-800'>Наша миссия</b>
          <p>Наша цель — сделать красоту доступной для каждого. Мы стремимся создать пространство, где вы чувствуете себя комфортно, а наши мастера помогают вам раскрыть вашу индивидуальность и подчеркнуть естественную красоту.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>ПОЧЕМУ <span className='text-gray-700 font-semibold'>ВЫБИРАЮТ НАС</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>УДОБСТВО:</b>
          <p>Запись онлайн в любое время — без звонков и ожидания ответа.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>ПРОФЕССИОНАЛИЗМ:</b>
          <p>Все мастера имеют подтверждённые сертификаты и многолетний опыт работы.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>ИНДИВИДУАЛЬНЫЙ ПОДХОД:</b>
          <p>Каждый клиент получает персональные рекомендации и уход с учётом его особенностей.</p>
        </div>
      </div>

    </div>
  )
}

export default About
