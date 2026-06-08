import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedMasters = ({ speciality, docId }) => {

    const navigate = useNavigate()
    const { masters } = useContext(AppContext)

    const [relMaster, setRelMaster] = useState([])

    useEffect(() => {
        if (masters.length > 0 && speciality) {
            const mastersData = masters.filter((master) => master.speciality === speciality && master._id !== docId)
            setRelMaster(mastersData)
        }
    }, [masters, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Другие мастера этой специализации</h1>
            <p className='sm:w-1/3 text-center text-sm'>Посмотрите других специалистов и выберите подходящего мастера.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relMaster.map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 flex flex-col' key={index}>
                        <div className='h-48 bg-[#EAEFFF] overflow-hidden'>
                            <img className='w-full h-full object-cover' src={item.image} alt="" />
                        </div>
                        <div className='p-4 flex flex-col flex-1'>
                            <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                <p className={`w-2 h-2 rounded-full flex-shrink-0 ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                                <p>{item.available ? 'Принимает записи' : 'Не принимает'}</p>
                            </div>
                            <p className='text-[#262626] text-base font-medium mt-1 line-clamp-1'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedMasters
