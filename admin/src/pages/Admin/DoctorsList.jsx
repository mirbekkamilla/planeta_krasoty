import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { masters, changeAvailability, aToken, getAllMasters, archiveMaster, restoreMaster } = useContext(AdminContext)
  const navigate = useNavigate()

  const [confirmArchive, setConfirmArchive] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (aToken) {
      getAllMasters()
    }
  }, [aToken])

  const filteredDoctors = masters.filter(doc => {
    if (filter === 'active') return !doc.archived
    if (filter === 'archived') return doc.archived
    return true
  })

  const activeCount = masters.filter(d => !d.archived).length
  const archivedCount = masters.filter(d => d.archived).length

  const handleArchive = async (docId) => {
    await archiveMaster(docId)
    setConfirmArchive(null)
  }

  const handleRestore = async (docId) => {
    await restoreMaster(docId)
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-medium'>Все мастера</h1>
        <div className='flex gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all ${filter === 'all' ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Все ({masters.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all ${filter === 'active' ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Активные ({activeCount})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all ${filter === 'archived' ? 'bg-gray-500 text-white border-gray-500' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Архив ({archivedCount})
          </button>
        </div>
      </div>

      <div className='w-full flex flex-wrap gap-4 pt-2 gap-y-6'>
        {filteredDoctors.map((item, index) => (
          <div className={`border rounded-xl w-56 overflow-hidden cursor-pointer group flex flex-col ${item.archived ? 'border-gray-300 opacity-75' : 'border-[#C9D8FF]'}`} key={index}>
            <div className='h-56 overflow-hidden bg-[#EAEFFF] relative'>
              <img className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500' src={item.image} alt="" />
              {item.archived && (
                <div className='absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded'>
                  В архиве
                </div>
              )}
            </div>
            <div className='p-4 flex flex-col flex-1'>
              <p className='text-[#262626] text-lg font-medium truncate'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <p className='text-[#5C5C5C] text-xs mt-1'>{item.experience}</p>

              {!item.archived && (
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <p>Принимает записи</p>
                </div>
              )}

              <div className='mt-auto pt-3 flex gap-2'>
                {item.archived ? (
                  <button
                    onClick={() => handleRestore(item._id)}
                    className='flex-1 py-1.5 text-xs border border-green-500 text-green-600 rounded hover:bg-green-500 hover:text-white transition-all'
                  >
                    Восстановить
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(`/edit-master/${item._id}`)}
                      className='flex-1 py-1.5 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-white transition-all'
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => setConfirmArchive(item._id)}
                      className='flex-1 py-1.5 text-xs border border-red-400 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all'
                    >
                      Архивировать
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <p className='text-gray-400 text-center py-10'>
          {filter === 'archived' ? 'Нет архивных мастеров' : 'Нет мастеров'}
        </p>
      )}

      {/* Confirm Archive Modal */}
      {confirmArchive && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-96 shadow-xl'>
            <h2 className='text-lg font-medium mb-3'>Подтверждение</h2>
            <p className='text-sm text-gray-600 mb-6'>Вы уверены, что хотите архивировать этого мастера? Мастер не будет отображаться на сайте.</p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setConfirmArchive(null)}
                className='px-4 py-2 text-sm border rounded hover:bg-gray-50 transition-all'
              >
                Отмена
              </button>
              <button
                onClick={() => handleArchive(confirmArchive)}
                className='px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all'
              >
                Архивировать
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DoctorsList
