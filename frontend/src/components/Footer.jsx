import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Наш салон красоты — место, где каждый клиент получает индивидуальный подход и профессиональный уход. Мы работаем только с проверенными материалами и следим за новейшими тенденциями в мире красоты.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>НАВИГАЦИЯ</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Главная</li>
            <li>О нас</li>
            <li>Мастера</li>
            <li>Политика конфиденциальности</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>КОНТАКТЫ</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+7 (800) 123-45-67</li>
            <li>planeta-krasoty@salon.ru</li>
          </ul>
          <div className='flex items-center gap-4 mt-5 text-gray-600'>
            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' aria-label='Instagram' className='hover:text-[#262626] transition-colors'>
              <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect x='2' y='2' width='20' height='20' rx='6' stroke='currentColor' strokeWidth='2' />
                <circle cx='12' cy='12' r='5' stroke='currentColor' strokeWidth='2' />
                <circle cx='17.5' cy='6.5' r='1.5' fill='currentColor' />
              </svg>
            </a>
            <a href='https://vk.com' target='_blank' rel='noopener noreferrer' aria-label='ВКонтакте' className='hover:text-[#262626] transition-colors'>
              <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                <rect x='2' y='2' width='20' height='20' rx='6' fill='currentColor' />
                <text x='12' y='16' textAnchor='middle' fontSize='10' fontWeight='700' fill='white' fontFamily='Arial, sans-serif'>VK</text>
              </svg>
            </a>
            <a href='https://wa.me/78001234567' target='_blank' rel='noopener noreferrer' aria-label='WhatsApp' className='hover:text-[#262626] transition-colors'>
              <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.43-4.4-1.18l-.32-.19-3.27.86.87-3.18-.21-.33A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z' />
                <path d='M16.6 14.13c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.4-.55-.41-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z' />
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>© 2026 Салон «Планета красоты» — Все права защищены.</p>
      </div>

    </div>
  )
}

export default Footer
