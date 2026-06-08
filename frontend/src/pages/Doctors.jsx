import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <div className='flex items-center justify-between mb-1'>
        <p className='text-gray-600'>Выберите специалиста по нужному направлению.</p>
      </div>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Фильтры</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Парикмахер' ? navigate('/masters') : navigate('/masters/Парикмахер')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Парикмахер' ? 'bg-[#E2E5FF] text-black' : ''}`}>Парикмахер</p>
          <p onClick={() => speciality === 'Мастер маникюра' ? navigate('/masters') : navigate('/masters/Мастер маникюра')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Мастер маникюра' ? 'bg-[#E2E5FF] text-black' : ''}`}>Мастер маникюра</p>
          <p onClick={() => speciality === 'Мастер педикюра' ? navigate('/masters') : navigate('/masters/Мастер педикюра')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Мастер педикюра' ? 'bg-[#E2E5FF] text-black' : ''}`}>Мастер педикюра</p>
          <p onClick={() => speciality === 'Визажист' ? navigate('/masters') : navigate('/masters/Визажист')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Визажист' ? 'bg-[#E2E5FF] text-black' : ''}`}>Визажист</p>
          <p onClick={() => speciality === 'Бровист' ? navigate('/masters') : navigate('/masters/Бровист')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Бровист' ? 'bg-[#E2E5FF] text-black' : ''}`}>Бровист</p>
          <p onClick={() => speciality === 'Косметолог' ? navigate('/masters') : navigate('/masters/Косметолог')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Косметолог' ? 'bg-[#E2E5FF] text-black' : ''}`}>Косметолог</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
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
    </div>
  )
}

export default Doctors