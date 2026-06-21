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
        <div id='speciality' className='flex flex-col items-center gap-4 py-8 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Найти по специализации</h1>
            <p className='sm:w-1/3 text-center text-sm'>Выберите нужного специалиста из нашей команды и запишитесь онлайн без очередей.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
                {items.map((item) => (
                    <Link to={`/masters/${encodeURIComponent(item.speciality)}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs text-center cursor-pointer flex-shrink-0 w-16 sm:w-24 hover:translate-y-[-10px] transition-all duration-500' key={item.speciality}>
                        {item.image ? (
                            <img className='w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-full mb-2' src={item.image} alt={item.speciality} />
                        ) : (
                            <span className='flex w-16 h-16 sm:w-24 sm:h-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-2xl font-semibold text-primary mb-2'>{item.speciality.charAt(0)}</span>
                        )}
                        <p>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
