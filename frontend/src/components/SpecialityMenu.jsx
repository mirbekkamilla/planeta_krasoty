import React, { useContext } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const SpecialityMenu = () => {
    const { categories } = useContext(AppContext)
    const fallbackImages = Object.fromEntries(specialityData.map(item => [item.speciality, item.image]))
    const items = categories.length
        ? categories.map(category => ({ speciality: category.name, image: category.image || fallbackImages[category.name] }))
        : specialityData

    return (
        <div id='speciality' className='flex flex-col items-center gap-3 py-8 text-[#262626] sm:gap-4'>
            <h1 className='text-center text-2xl font-medium leading-tight sm:text-3xl'>Найти по специализации</h1>
            <p className='max-w-md px-3 text-center text-sm leading-5 text-gray-600'>Выберите нужного специалиста из нашей команды и запишитесь онлайн без очередей.</p>
            <div className='flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 pt-4 sm:justify-center sm:gap-4 sm:px-0 sm:pt-5'>
                {items.map((item) => (
                    <Link
                        to={`/masters/${encodeURIComponent(item.speciality)}`}
                        onClick={() => scrollTo(0, 0)}
                        className='group flex w-[104px] flex-shrink-0 snap-start flex-col items-center rounded-2xl border border-gray-100 bg-white px-2 pb-3 pt-2.5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md sm:w-28'
                        key={item.speciality}
                    >
                        {item.image ? (
                            <img className='mb-2.5 h-[76px] w-[76px] rounded-full object-cover ring-2 ring-[#F2F3FF] transition group-hover:ring-primary/20 sm:h-20 sm:w-20' src={item.image} alt={item.speciality} />
                        ) : (
                            <span className='mb-2.5 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-2xl font-semibold text-primary ring-2 ring-[#F2F3FF] sm:h-20 sm:w-20'>{item.speciality.charAt(0)}</span>
                        )}
                        <p className='flex min-h-8 items-center justify-center text-[13px] font-medium leading-4 text-gray-700'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
