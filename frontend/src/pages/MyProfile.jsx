import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const ACHIEVEMENTS_META = {
  first_visit: { label: 'Первый визит', icon: '🌟', description: 'Совершил первый визит в салон' },
  loyal_client: { label: 'Постоянный клиент', icon: '💎', description: '5 визитов' },
  vip: { label: 'VIP-клиент', icon: '👑', description: '10 визитов или 1000+ баллов' },
}

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loyalty, setLoyalty] = useState(null)
    const [favorites, setFavorites] = useState([])
    const [bonusHistory, setBonusHistory] = useState([])
    const [showBonusHistory, setShowBonusHistory] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const loadLoyalty = async () => {
        if (!token) return
        try {
            const { data } = await axios.get(backendUrl + '/api/user/loyalty', { headers: { token } })
            if (data.success) setLoyalty(data.loyalty)
        } catch (error) {
            console.log(error)
        }
    }

    const loadBonusHistory = async () => {
        if (!token) return
        try {
            const { data } = await axios.get(backendUrl + '/api/user/bonus-history', { headers: { token } })
            if (data.success) setBonusHistory(data.history)
        } catch (error) {
            console.log(error)
        }
    }

    const loadFavorites = async () => {
        if (!token) return
        try {
            const { data } = await axios.get(backendUrl + '/api/user/favorites', { headers: { token } })
            if (data.success) setFavorites(data.favorites)
        } catch (error) {
            console.log(error)
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
        loadLoyalty()
        loadFavorites()
        loadBonusHistory()
    }, [token])

    const updateUserProfileData = async () => {
        try {
            if (newPassword && newPassword !== confirmPassword) {
                return toast.error('Новые пароли не совпадают')
            }

            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            if (newPassword) {
                formData.append('currentPassword', currentPassword)
                formData.append('newPassword', newPassword)
            }

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className='max-w-2xl flex flex-col gap-2 text-sm pt-5'>

            {isEdit
                ? <label htmlFor='image'>
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
                : <img className='w-36 rounded' src={userData.image} alt="" />
            }

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            }

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>КОНТАКТНАЯ ИНФОРМАЦИЯ</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Телефон:</p>
                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        : <p className='text-blue-500'>{userData.phone}</p>
                    }
                </div>
            </div>

            <div>
                <p className='text-[#797979] underline mt-3'>ОСНОВНАЯ ИНФОРМАЦИЯ</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Пол:</p>
                    {isEdit
                        ? <select className='max-w-28 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                            <option value="Not Selected">Не указан</option>
                            <option value="Male">Мужской</option>
                            <option value="Female">Женский</option>
                        </select>
                        : <p className='text-gray-500'>{userData.gender === 'Male' ? 'Мужской' : userData.gender === 'Female' ? 'Женский' : 'Не указан'}</p>
                    }
                    <p className='font-medium'>Дата рождения:</p>
                    {isEdit
                        ? <input className='max-w-28 bg-gray-50' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                        : <p className='text-gray-500'>{userData.dob}</p>
                    }
                </div>
            </div>

            {isEdit && (
                <div>
                    <p className='text-[#797979] underline mt-3'>СМЕНА ПАРОЛЯ</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                        <p className='font-medium'>Текущий пароль:</p>
                        <input
                            className='bg-gray-50 max-w-52 px-2 py-1 border border-gray-200 rounded'
                            type='password'
                            placeholder='Введите текущий пароль'
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <p className='font-medium'>Новый пароль:</p>
                        <input
                            className='bg-gray-50 max-w-52 px-2 py-1 border border-gray-200 rounded'
                            type='password'
                            placeholder='Не менее 8 символов'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <p className='font-medium'>Повторите пароль:</p>
                        <input
                            className='bg-gray-50 max-w-52 px-2 py-1 border border-gray-200 rounded'
                            type='password'
                            placeholder='Повторите новый пароль'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <p className='text-gray-400 text-xs mt-1'>Оставьте поля пустыми, если не хотите менять пароль</p>
                </div>
            )}

            {/* Loyalty & Achievements section */}
            {loyalty && (
                <div className='mt-6'>
                    <p className='text-[#797979] underline mb-4'>МОИ ДОСТИЖЕНИЯ</p>

                    {/* Bonus + VIP row */}
                    <div className='flex flex-col sm:flex-row gap-4 mb-5'>
                        <div className='flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4'>
                            <p className='text-xs text-indigo-400 font-medium mb-1'>Бонусные баллы</p>
                            <div className='flex items-end gap-2'>
                                <span className='text-3xl font-bold text-indigo-600'>{loyalty.bonusPoints}</span>
                                <span className='text-indigo-400 text-sm mb-1'>баллов</span>
                            </div>
                            <p className='text-xs text-indigo-300 mt-1'>Всего визитов: {loyalty.totalVisits}</p>
                        </div>

                        {loyalty.isVip && (
                            <div className='flex items-center gap-3 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl px-5 py-4'>
                                <span className='text-3xl'>👑</span>
                                <div>
                                    <p className='font-semibold text-amber-700 text-sm'>VIP-клиент</p>
                                    <p className='text-xs text-amber-500'>Особые привилегии</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress to next level */}
                    {loyalty.nextLevel && (
                        <div className='mb-5'>
                            <div className='flex justify-between text-xs text-gray-500 mb-1'>
                                <span>Прогресс до «{ACHIEVEMENTS_META[loyalty.nextLevel.name]?.label || loyalty.nextLevel.name}»</span>
                                <span>{loyalty.totalVisits} / {loyalty.nextLevel.visitsRequired} визитов</span>
                            </div>
                            <div className='w-full bg-gray-100 rounded-full h-2.5 overflow-hidden'>
                                <div
                                    className='bg-primary h-2.5 rounded-full transition-all duration-500'
                                    style={{ width: `${Math.min((loyalty.totalVisits / loyalty.nextLevel.visitsRequired) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Achievements list */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                        {Object.entries(ACHIEVEMENTS_META).map(([key, meta]) => {
                            const earned = loyalty.achievements.includes(key)
                            return (
                                <div
                                    key={key}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        earned
                                            ? 'bg-white border-indigo-200 shadow-sm'
                                            : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                                    }`}
                                >
                                    <span className='text-2xl flex-shrink-0'>{meta.icon}</span>
                                    <div>
                                        <p className={`text-sm font-medium ${earned ? 'text-gray-800' : 'text-gray-500'}`}>{meta.label}</p>
                                        <p className='text-xs text-gray-400'>{meta.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Bonus history section */}
            {bonusHistory.length > 0 && (
                <div className='mt-6'>
                    <button
                        onClick={() => setShowBonusHistory(v => !v)}
                        className='flex items-center gap-2 text-[#797979] underline mb-3 hover:text-gray-800 transition-colors'
                    >
                        ИСТОРИЯ БОНУСНЫХ БАЛЛОВ
                        <span className='text-xs no-underline'>{showBonusHistory ? '▲' : '▼'}</span>
                    </button>
                    {showBonusHistory && (
                        <div className='flex flex-col gap-2'>
                            {bonusHistory.map((entry, i) => (
                                <div key={i} className='flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100'>
                                    <div>
                                        <p className='text-sm text-gray-700'>{entry.description}</p>
                                        <p className='text-xs text-gray-400'>{new Date(entry.date).toLocaleDateString('ru-RU')}</p>
                                    </div>
                                    <span className={`font-semibold text-sm ${entry.type === 'earned' ? 'text-green-600' : 'text-red-500'}`}>
                                        {entry.type === 'earned' ? '+' : '−'}{entry.amount} б.
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Favorites section */}
            <div className='mt-8'>
                <p className='text-gray-600 underline mb-3'>ИЗБРАННЫЕ МАСТЕРА</p>
                {favorites.length === 0 ? (
                    <p className='text-gray-400 text-sm'>Нет избранных мастеров. Добавьте мастеров через кнопку «В избранное» на странице мастера.</p>
                ) : (
                    <div className='flex flex-col gap-3'>
                        {favorites.map(master => (
                            <div key={master._id} className='flex items-center gap-3 p-3 border border-gray-100 rounded-xl'>
                                <img src={master.image} alt={master.name} className='w-12 h-12 rounded-full object-cover flex-shrink-0' />
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-gray-800 truncate'>{master.name}</p>
                                    <p className='text-xs text-gray-400'>{master.speciality}</p>
                                </div>
                                <div className='flex items-center gap-2 flex-shrink-0'>
                                    <button
                                        onClick={() => { window.location.href = `/appointment/${master._id}` }}
                                        className='text-xs px-3 py-1.5 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors'
                                    >
                                        Записаться
                                    </button>
                                    <button
                                        onClick={() => removeFavorite(master._id)}
                                        className='text-xs px-3 py-1.5 border border-red-300 text-red-400 rounded-full hover:bg-red-50 transition-colors'
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='mt-6'>
                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Сохранить</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Редактировать</button>
                }
            </div>
        </div>
    ) : null
}

export default MyProfile
