import React, { useContext, useEffect, useRef, useState } from 'react'
import { MasterContext } from '../../context/MasterContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const CATEGORIES = ['Окрашивание', 'Стрижки', 'Укладки', 'Уход', 'Маникюр', 'Педикюр', 'Прочее']

const MasterProfile = () => {

    const { mToken, profileData, setProfileData, getProfileData } = useContext(MasterContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [newService, setNewService] = useState({ name: '', price: '', duration: 60 })

    const [portfolio, setPortfolio] = useState([])
    const [uploading, setUploading] = useState(false)
    const [newImage, setNewImage] = useState(null)
    const [newCategory, setNewCategory] = useState('Прочее')
    const [newDescription, setNewDescription] = useState('')
    const [deletingId, setDeletingId] = useState('')
    const fileInputRef = useRef(null)

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available,
                services: profileData.services || []
            }
            const { data } = await axios.post(backendUrl + '/api/master/update-profile', updateData, { headers: { dtoken: mToken } })
            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
            setIsEdit(false)
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const fetchPortfolio = async () => {
        if (!profileData?._id) return
        try {
            const { data } = await axios.get(backendUrl + `/api/master/portfolio/${profileData._id}`)
            if (data.success) setPortfolio(data.portfolio)
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImage = async (e) => {
        e.preventDefault()
        if (!newImage) return toast.error('Выберите изображение')
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', newImage)
            formData.append('category', newCategory)
            formData.append('description', newDescription)

            const { data } = await axios.post(backendUrl + '/api/master/portfolio', formData, {
                headers: { dtoken: mToken, 'Content-Type': 'multipart/form-data' }
            })

            if (data.success) {
                toast.success(data.message)
                setNewImage(null)
                setNewDescription('')
                if (fileInputRef.current) fileInputRef.current.value = ''
                fetchPortfolio()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setUploading(false)
        }
    }

    const deleteImage = async (imageId) => {
        if (!confirm('Удалить это изображение из портфолио?')) return
        setDeletingId(imageId)
        try {
            const { data } = await axios.delete(backendUrl + `/api/master/portfolio/${imageId}`, {
                headers: { dtoken: mToken }
            })
            if (data.success) {
                toast.success(data.message)
                fetchPortfolio()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setDeletingId('')
        }
    }

    useEffect(() => {
        if (mToken) {
            getProfileData()
        }
    }, [mToken])

    useEffect(() => {
        if (profileData?._id) {
            fetchPortfolio()
        }
    }, [profileData])

    return profileData && (
        <div className='m-5 flex flex-col gap-6'>

            {/* Profile card */}
            <div className='flex flex-col gap-4'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} — {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>О себе:</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {isEdit
                                ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className='w-full outline-primary p-2' rows={8} value={profileData.about} />
                                : profileData.about
                            }
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Базовая стоимость: <span className='text-gray-800'>{currency} {isEdit
                            ? <input type='number' className='border rounded px-2 py-0.5 w-24 outline-primary' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} />
                            : profileData.fees}
                        </span>
                    </p>

                    {/* Services management */}
                    <div className='mt-5'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Услуги</p>
                        <div className='flex flex-col gap-2 mb-3'>
                            {(profileData.services || []).length === 0 && !isEdit && (
                                <p className='text-sm text-gray-400'>Нет услуг. Нажмите «Редактировать», чтобы добавить.</p>
                            )}
                            {(profileData.services || []).map((svc, i) => (
                                <div key={i} className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-800'>{svc.name}</p>
                                        <p className='text-xs text-gray-400'>{svc.duration} мин · {currency}{svc.price}</p>
                                    </div>
                                    {isEdit && (
                                        <button
                                            type='button'
                                            onClick={() => setProfileData(prev => ({ ...prev, services: prev.services.filter((_, j) => j !== i) }))}
                                            className='text-red-400 hover:text-red-600 text-lg leading-none ml-3'
                                        >×</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEdit && (
                            <div className='flex gap-2 flex-wrap'>
                                <input
                                    type='text'
                                    placeholder='Название услуги'
                                    value={newService.name}
                                    onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
                                    className='border rounded px-2 py-1.5 text-sm flex-1 min-w-[140px] outline-primary'
                                />
                                <input
                                    type='number'
                                    placeholder='Цена ₽'
                                    value={newService.price}
                                    onChange={e => setNewService(s => ({ ...s, price: e.target.value }))}
                                    className='border rounded px-2 py-1.5 text-sm w-20 outline-primary'
                                />
                                <select
                                    value={newService.duration}
                                    onChange={e => setNewService(s => ({ ...s, duration: Number(e.target.value) }))}
                                    className='border rounded px-2 py-1.5 text-sm outline-primary'
                                >
                                    <option value={30}>30 мин</option>
                                    <option value={45}>45 мин</option>
                                    <option value={60}>1 ч</option>
                                    <option value={90}>1.5 ч</option>
                                    <option value={120}>2 ч</option>
                                    <option value={150}>2.5 ч</option>
                                    <option value={180}>3 ч</option>
                                </select>
                                <button
                                    type='button'
                                    onClick={() => {
                                        if (!newService.name || !newService.price) return
                                        setProfileData(prev => ({
                                            ...prev,
                                            services: [...(prev.services || []), { name: newService.name, price: Number(newService.price), duration: newService.duration }]
                                        }))
                                        setNewService({ name: '', price: '', duration: 60 })
                                    }}
                                    className='bg-primary text-white px-3 py-1.5 rounded text-sm whitespace-nowrap hover:bg-indigo-600 transition-colors'
                                >+ Добавить</button>
                            </div>
                        )}
                    </div>

                    <div className='flex gap-2 py-2'>
                        <p>Адрес:</p>
                        <p className='text-sm'>
                            {isEdit
                                ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                : profileData.address.line1}
                            <br />
                            {isEdit
                                ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                                : profileData.address.line2}
                        </p>
                    </div>

                    <div className='flex gap-1 pt-2'>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label>Принимаю записи</label>
                    </div>

                    {isEdit
                        ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Сохранить</button>
                        : <button onClick={() => setIsEdit(prev => !prev)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Редактировать</button>
                    }
                </div>
            </div>

            {/* Portfolio section */}
            <div className='border border-stone-100 rounded-lg bg-white p-6'>
                <h2 className='text-lg font-semibold text-gray-700 mb-5'>Моё портфолио</h2>

                {/* Upload form */}
                <form onSubmit={uploadImage} className='bg-gray-50 rounded-xl p-5 mb-6'>
                    <p className='text-sm font-medium text-gray-600 mb-3'>Добавить работу</p>
                    <div className='flex flex-col sm:flex-row gap-3'>

                        <label className='flex flex-col items-center justify-center w-full sm:w-40 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors bg-white flex-shrink-0'>
                            {newImage ? (
                                <img
                                    src={URL.createObjectURL(newImage)}
                                    className='w-full h-full object-cover rounded-xl'
                                    alt='preview'
                                />
                            ) : (
                                <div className='flex flex-col items-center gap-1 text-gray-400'>
                                    <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <span className='text-xs'>Выбрать фото</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => setNewImage(e.target.files[0] || null)}
                            />
                        </label>

                        <div className='flex flex-col gap-2 flex-1'>
                            <select
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                className='border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white'
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input
                                type='text'
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                                placeholder='Описание работы (необязательно)'
                                className='border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white'
                            />
                            <button
                                type='submit'
                                disabled={uploading || !newImage}
                                className='mt-auto px-5 py-2 bg-primary text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50'
                            >
                                {uploading ? 'Загрузка...' : 'Загрузить'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Portfolio grid */}
                {portfolio.length === 0 ? (
                    <div className='text-center py-10 text-gray-400'>
                        <p className='text-3xl mb-2'>🖼️</p>
                        <p className='text-sm'>Портфолио пока пустое. Добавьте первую работу!</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                        {portfolio.map((item) => (
                            <div key={item._id} className='relative group rounded-xl overflow-hidden bg-gray-100 aspect-square'>
                                <img
                                    src={item.imageUrl}
                                    alt={item.description || item.category}
                                    className='w-full h-full object-cover'
                                />

                                {/* Overlay on hover */}
                                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2'>
                                    <p className='text-white text-xs text-center font-medium line-clamp-1'>
                                        {item.category}
                                    </p>
                                    {item.description && (
                                        <p className='text-white/80 text-xs text-center line-clamp-2'>{item.description}</p>
                                    )}
                                    <button
                                        onClick={() => deleteImage(item._id)}
                                        disabled={deletingId === item._id}
                                        className='mt-1 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50'
                                    >
                                        {deletingId === item._id ? (
                                            'Удаление...'
                                        ) : (
                                            <>
                                                <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                </svg>
                                                Удалить
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className='text-xs text-gray-400 mt-3'>{portfolio.length} {portfolio.length === 1 ? 'работа' : portfolio.length < 5 ? 'работы' : 'работ'} в портфолио</p>
            </div>

        </div>
    )
}

export default MasterProfile
