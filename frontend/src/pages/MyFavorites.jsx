import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const MyFavorites = () => {
    const { token, backendUrl } = useContext(AppContext)
    const navigate = useNavigate()
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    const loadFavorites = async () => {
        if (!token) { navigate('/login'); return }
        try {
            const { data } = await axios.get(backendUrl + '/api/user/favorites', { headers: { token } })
            if (data.success) setFavorites(data.favorites)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const removeFavorite = async (masterId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/favorites/toggle', { masterId }, { headers: { token } })
            if (data.success) setFavorites(prev => prev.filter(m => m._id !== masterId))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadFavorites()
    }, [token])

    if (loading) return <div className='min-h-[60vh] flex items-center justify-center text-gray-400'>Загрузка...</div>

    return (
        <div className='max-w-2xl mx-auto pt-8 pb-16'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Избранные мастера</h2>

            {favorites.length === 0 ? (
                <div className='flex flex-col items-center gap-4 py-20 text-gray-400'>
                    <span className='text-5xl'>🤍</span>
                    <p className='text-lg'>Нет избранных мастеров</p>
                    <button
                        onClick={() => navigate('/masters')}
                        className='mt-2 border border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-colors'
                    >
                        Найти мастера
                    </button>
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {favorites.map(master => (
                        <div key={master._id} className='flex items-center gap-4 p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow'>
                            <img
                                src={master.image}
                                alt={master.name}
                                className='w-16 h-16 rounded-full object-cover flex-shrink-0 cursor-pointer'
                                onClick={() => navigate(`/appointment/${master._id}`)}
                            />
                            <div className='flex-1 min-w-0 cursor-pointer' onClick={() => navigate(`/appointment/${master._id}`)}>
                                <p className='font-semibold text-gray-800'>{master.name}</p>
                                <p className='text-sm text-gray-400'>{master.speciality}</p>
                            </div>
                            <div className='flex items-center gap-2 flex-shrink-0'>
                                <button
                                    onClick={() => navigate(`/appointment/${master._id}`)}
                                    className='text-sm px-4 py-1.5 bg-primary text-white rounded-full hover:opacity-90 transition-opacity'
                                >
                                    Записаться
                                </button>
                                <button
                                    onClick={() => removeFavorite(master._id)}
                                    className='text-sm px-4 py-1.5 border border-red-300 text-red-400 rounded-full hover:bg-red-50 transition-colors'
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyFavorites
