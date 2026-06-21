import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { CUSTOM_PORTFOLIO_CATEGORY, getPortfolioCategories } from '../../constants/portfolioCategories'
import useCategories from '../../hooks/useCategories'
import { EXPERIENCE_OPTIONS, formatExperience } from '../../utils/experience'

const EditMaster = () => {
  const categories = useCategories()
  const { docId } = useParams()
  const navigate = useNavigate()
  const { aToken, backendUrl, editMaster } = useContext(AdminContext)

  const [editData, setEditData] = useState(null)
  const [editImage, setEditImage] = useState(null)
  const [newService, setNewService] = useState({ name: '', price: '', duration: 60 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [portfolio, setPortfolio] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newPortfolioImage, setNewPortfolioImage] = useState(null)
  const [newPortfolioCategory, setNewPortfolioCategory] = useState('Прочее')
  const [customPortfolioCategory, setCustomPortfolioCategory] = useState('')
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('')
  const [deletingImageId, setDeletingImageId] = useState('')
  const [editingPortfolioItem, setEditingPortfolioItem] = useState(null)
  const [editPortfolioCategory, setEditPortfolioCategory] = useState('')
  const [editCustomPortfolioCategory, setEditCustomPortfolioCategory] = useState('')
  const [editPortfolioDescription, setEditPortfolioDescription] = useState('')
  const [savingPortfolioItem, setSavingPortfolioItem] = useState(false)
  const portfolioFileInputRef = useRef(null)

  useEffect(() => {
    if (aToken && docId) fetchMaster()
  }, [aToken, docId])

  const fetchMaster = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/get-master', { docId }, { headers: { aToken } })
      if (data.success) {
        const d = data.master
        setEditData({
          docId: d._id,
          name: d.name,
          email: d.email || '',
          speciality: d.speciality,
          degree: d.degree,
          experience: formatExperience(d.experience),
          about: d.about,
          fees: d.fees,
          slotDuration: d.slotDuration || 60,
          services: d.services || [],
          address: d.address || { line1: '', line2: '' },
          image: d.image
        })
      } else {
        toast.error(data.message)
        navigate('/master-list')
      }
    } catch (error) {
      toast.error(error.message)
      navigate('/master-list')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editData) return
    setSaving(true)
    const formData = new FormData()
    formData.append('docId', editData.docId)
    formData.append('name', editData.name)
    formData.append('email', editData.email)
    formData.append('speciality', editData.speciality)
    formData.append('degree', editData.degree)
    formData.append('experience', editData.experience)
    formData.append('about', editData.about)
    formData.append('fees', editData.fees)
    formData.append('slotDuration', Number(editData.slotDuration || 60))
    formData.append('services', JSON.stringify(editData.services || []))
    formData.append('address', JSON.stringify(editData.address))
    if (editImage) formData.append('image', editImage)
    const result = await editMaster(formData)
    setSaving(false)
    if (result?.success) navigate('/master-list')
  }

  const handleChangePassword = async () => {
    if (!newPassword) return toast.error('Введите новый пароль')
    if (newPassword.length < 8) return toast.error('Пароль должен быть не менее 8 символов')
    if (newPassword !== confirmPassword) return toast.error('Пароли не совпадают')
    setChangingPassword(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/change-master-password',
        { docId, newPassword },
        { headers: { aToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setChangingPassword(false)
    }
  }

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/master/portfolio/${docId}`)
      if (data.success) setPortfolio(data.portfolio)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (docId) fetchPortfolio()
  }, [docId])

  const uploadPortfolioImage = async (e) => {
    e.preventDefault()
    if (!newPortfolioImage) return toast.error('Выберите изображение')
    const category = newPortfolioCategory === CUSTOM_PORTFOLIO_CATEGORY
      ? customPortfolioCategory.trim()
      : newPortfolioCategory
    if (!category) return toast.error('Введите название категории')
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('docId', docId)
      formData.append('image', newPortfolioImage)
      formData.append('category', category)
      formData.append('description', newPortfolioDescription)

      const { data } = await axios.post(backendUrl + '/api/admin/portfolio', formData, {
        headers: { aToken, 'Content-Type': 'multipart/form-data' }
      })

      if (data.success) {
        toast.success(data.message)
        setNewPortfolioImage(null)
        setNewPortfolioDescription('')
        setNewPortfolioCategory('Прочее')
        setCustomPortfolioCategory('')
        if (portfolioFileInputRef.current) portfolioFileInputRef.current.value = ''
        fetchPortfolio()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } finally {
      setUploadingImage(false)
    }
  }

  const deletePortfolioImage = async (imageId) => {
    if (!confirm('Удалить это изображение из портфолио?')) return
    setDeletingImageId(imageId)
    try {
      const { data } = await axios.delete(backendUrl + `/api/admin/portfolio/${docId}/${imageId}`, {
        headers: { aToken }
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
      setDeletingImageId('')
    }
  }

  const openPortfolioEditor = (item) => {
    const categories = getPortfolioCategories(editData?.speciality)
    const isKnownCategory = categories.includes(item.category)

    setEditingPortfolioItem(item)
    setEditPortfolioCategory(isKnownCategory ? item.category : CUSTOM_PORTFOLIO_CATEGORY)
    setEditCustomPortfolioCategory(isKnownCategory ? '' : item.category)
    setEditPortfolioDescription(item.description || '')
  }

  const closePortfolioEditor = () => {
    if (savingPortfolioItem) return
    setEditingPortfolioItem(null)
    setEditCustomPortfolioCategory('')
  }

  const savePortfolioItem = async (e) => {
    e.preventDefault()
    const category = editPortfolioCategory === CUSTOM_PORTFOLIO_CATEGORY
      ? editCustomPortfolioCategory.trim()
      : editPortfolioCategory

    if (!category) return toast.error('Введите название категории')

    setSavingPortfolioItem(true)
    try {
      const { data } = await axios.patch(
        backendUrl + `/api/admin/portfolio/${docId}/${editingPortfolioItem._id}`,
        { category, description: editPortfolioDescription.trim() },
        { headers: { aToken } }
      )

      if (data.success) {
        setPortfolio(current => current.map(item =>
          item._id === editingPortfolioItem._id ? data.portfolioItem : item
        ))
        toast.success(data.message)
        setEditingPortfolioItem(null)
        setEditCustomPortfolioCategory('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } finally {
      setSavingPortfolioItem(false)
    }
  }

  if (loading) return (
    <div className='flex justify-center items-center h-64 text-gray-400 text-sm'>Загрузка...</div>
  )
  if (!editData) return null

  return (
    <div className='m-5 max-w-3xl'>

      {/* Breadcrumb */}
      <div className='flex items-center gap-2 mb-6'>
        <button
          onClick={() => navigate('/master-list')}
          className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors'
        >
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Все мастера
        </button>
        <span className='text-gray-300'>/</span>
        <h1 className='text-base font-medium text-gray-800'>Редактировать мастера</h1>
      </div>

      {/* Basic info */}
      <div className='bg-white rounded-2xl border border-gray-200 p-6 mb-4'>
        <h2 className='font-medium text-gray-700 mb-5'>Основные данные</h2>

        <div className='flex items-center gap-4 mb-5'>
          <label htmlFor='edit-img' className='cursor-pointer group relative flex-shrink-0'>
            <img
              className='w-24 h-24 rounded-xl object-cover border-2 border-gray-200 group-hover:opacity-75 transition-opacity'
              src={editImage ? URL.createObjectURL(editImage) : editData.image}
              alt=''
            />
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl'>
              <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            </div>
          </label>
          <input onChange={(e) => setEditImage(e.target.files[0])} type='file' id='edit-img' hidden accept='image/*' />
          <p className='text-sm text-gray-400'>Нажмите на фото для замены</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm text-gray-600 block mb-1'>Имя</label>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </div>

          <div>
            <label className='text-sm text-gray-600 block mb-1'>Email (логин)</label>
            <input
              type='email'
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
          </div>

          <div>
            <label className='text-sm text-gray-600 block mb-1'>Специализация</label>
            <select
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.speciality}
              onChange={(e) => setEditData({ ...editData, speciality: e.target.value })}
            >
              {categories.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='text-sm text-gray-600 block mb-1'>Квалификация</label>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.degree}
              onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
            />
          </div>

          <div>
            <label className='text-sm text-gray-600 block mb-1'>Опыт</label>
            <select
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.experience}
              onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
            >
              {EXPERIENCE_OPTIONS.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='text-sm text-gray-600 block mb-1'>Базовая стоимость (₽)</label>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              type='number'
              value={editData.fees}
              onChange={(e) => setEditData({ ...editData, fees: e.target.value })}
            />
          </div>

          <div>
            <label className='text-sm text-gray-600 block mb-1'>Длительность слота</label>
            <select
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.slotDuration}
              onChange={(e) => setEditData({ ...editData, slotDuration: Number(e.target.value) })}
            >
              <option value={30}>30 минут</option>
              <option value={45}>45 минут</option>
              <option value={60}>1 час</option>
              <option value={90}>1,5 часа</option>
              <option value={120}>2 часа</option>
              <option value={150}>2,5 часа</option>
              <option value={180}>3 часа</option>
            </select>
          </div>

          <div className='sm:col-span-2'>
            <label className='text-sm text-gray-600 block mb-1'>Адрес (строка 1)</label>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.address.line1}
              onChange={(e) => setEditData({ ...editData, address: { ...editData.address, line1: e.target.value } })}
            />
          </div>

          <div className='sm:col-span-2'>
            <label className='text-sm text-gray-600 block mb-1'>Адрес (строка 2)</label>
            <input
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
              value={editData.address.line2}
              onChange={(e) => setEditData({ ...editData, address: { ...editData.address, line2: e.target.value } })}
            />
          </div>

          <div className='sm:col-span-2'>
            <label className='text-sm text-gray-600 block mb-1'>О мастере</label>
            <textarea
              className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none'
              rows={4}
              value={editData.about}
              onChange={(e) => setEditData({ ...editData, about: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>

        {/* Services */}
        <div className='bg-white rounded-2xl border border-gray-200 p-6'>
          <h2 className='font-medium text-gray-700 mb-4'>Услуги мастера</h2>

          <div className='flex flex-col gap-2 mb-4'>
            {(editData.services || []).length === 0 && (
              <p className='text-sm text-gray-400 py-1'>Нет услуг</p>
            )}
            {(editData.services || []).map((svc, i) => (
              <div key={i} className='flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5'>
                <div>
                  <p className='text-sm font-medium text-gray-800'>{svc.name}</p>
                  <p className='text-xs text-gray-400'>{svc.duration} мин · ₽{svc.price}</p>
                </div>
                <button
                  type='button'
                  onClick={() => setEditData({ ...editData, services: editData.services.filter((_, j) => j !== i) })}
                  className='text-red-400 hover:text-red-600 text-xl leading-none ml-3 flex-shrink-0'
                >×</button>
              </div>
            ))}
          </div>

          <div className='flex gap-2 flex-wrap'>
            <input
              type='text'
              placeholder='Название услуги'
              value={newService.name}
              onChange={e => setNewService({ ...newService, name: e.target.value })}
              className='border rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px] outline-none focus:border-primary transition-colors'
            />
            <input
              type='number'
              placeholder='₽'
              value={newService.price}
              onChange={e => setNewService({ ...newService, price: e.target.value })}
              className='border rounded-lg px-3 py-2 text-sm w-16 outline-none focus:border-primary transition-colors'
            />
            <select
              value={newService.duration}
              onChange={e => setNewService({ ...newService, duration: Number(e.target.value) })}
              className='border rounded-lg px-2 py-2 text-sm outline-none focus:border-primary transition-colors'
            >
              <option value={30}>30м</option>
              <option value={45}>45м</option>
              <option value={60}>1ч</option>
              <option value={90}>1.5ч</option>
              <option value={120}>2ч</option>
              <option value={150}>2.5ч</option>
              <option value={180}>3ч</option>
            </select>
            <button
              type='button'
              onClick={() => {
                if (!newService.name || !newService.price) return
                setEditData({ ...editData, services: [...(editData.services || []), { name: newService.name, price: Number(newService.price), duration: newService.duration }] })
                setNewService({ name: '', price: '', duration: 60 })
              }}
              className='bg-primary text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-indigo-600 transition-colors'
            >+ Добавить</button>
          </div>
        </div>

        {/* Change password */}
        <div className='bg-white rounded-2xl border border-gray-200 p-6'>
          <h2 className='font-medium text-gray-700 mb-4'>Изменить пароль мастера</h2>
          <div className='flex flex-col gap-3 mb-4'>
            <div>
              <label className='text-sm text-gray-600 block mb-1'>Новый пароль</label>
              <input
                type='password'
                className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
                placeholder='Минимум 8 символов'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className='text-sm text-gray-600 block mb-1'>Повторить пароль</label>
              <input
                type='password'
                className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors'
                placeholder='Повторите пароль'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword}
            className='px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-40'
          >
            {changingPassword ? 'Сохранение...' : 'Сменить пароль'}
          </button>
        </div>

      </div>

      {/* Portfolio management */}
      <div className='bg-white rounded-2xl border border-gray-200 p-6 mb-4'>
        <h2 className='font-medium text-gray-700 mb-5'>Портфолио мастера</h2>

        {/* Upload form */}
        <form onSubmit={uploadPortfolioImage} className='bg-gray-50 rounded-xl p-5 mb-6'>
          <p className='text-sm font-medium text-gray-600 mb-3'>Добавить работу</p>
          <div className='flex flex-col sm:flex-row gap-3'>

            <label className='flex flex-col items-center justify-center w-full sm:w-40 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors bg-white flex-shrink-0'>
              {newPortfolioImage ? (
                <img
                  src={URL.createObjectURL(newPortfolioImage)}
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
                ref={portfolioFileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => setNewPortfolioImage(e.target.files[0] || null)}
              />
            </label>

            <div className='flex flex-col gap-2 flex-1'>
              <select
                value={newPortfolioCategory}
                onChange={e => setNewPortfolioCategory(e.target.value)}
                className='border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white'
              >
                {getPortfolioCategories(editData?.speciality).map(c => <option key={c} value={c}>{c}</option>)}
                <option value={CUSTOM_PORTFOLIO_CATEGORY}>+ Своя категория</option>
              </select>
              {newPortfolioCategory === CUSTOM_PORTFOLIO_CATEGORY && (
                <input
                  type='text'
                  value={customPortfolioCategory}
                  onChange={e => setCustomPortfolioCategory(e.target.value)}
                  maxLength={60}
                  placeholder='Введите название категории'
                  className='border border-primary rounded-lg px-3 py-2 text-sm outline-none bg-white'
                />
              )}
              <input
                type='text'
                value={newPortfolioDescription}
                onChange={e => setNewPortfolioDescription(e.target.value)}
                placeholder='Описание работы (необязательно)'
                className='border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white'
              />
              <button
                type='submit'
                disabled={uploadingImage || !newPortfolioImage}
                className='mt-auto px-5 py-2 bg-primary text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50'
              >
                {uploadingImage ? 'Загрузка...' : 'Загрузить'}
              </button>
            </div>
          </div>
        </form>

        {/* Portfolio grid */}
        {portfolio.length === 0 ? (
          <div className='text-center py-10 text-gray-400'>
            <svg className='w-10 h-10 mx-auto mb-2 opacity-30' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
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
                  <div className='mt-1 flex items-center gap-1.5'>
                    <button
                      type='button'
                      onClick={() => openPortfolioEditor(item)}
                      className='flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-colors'
                    >
                      <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 13H9v-2.828l6.586-6.586z' />
                      </svg>
                      Изменить
                    </button>
                    <button
                      type='button'
                      onClick={() => deletePortfolioImage(item._id)}
                      disabled={deletingImageId === item._id}
                      className='flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50'
                    >
                    {deletingImageId === item._id ? (
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
              </div>
            ))}
          </div>
        )}

        <p className='text-xs text-gray-400 mt-3'>{portfolio.length} {portfolio.length === 1 ? 'работа' : portfolio.length < 5 ? 'работы' : 'работ'} в портфолио</p>
      </div>

      {editingPortfolioItem && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm' onMouseDown={closePortfolioEditor}>
          <form onSubmit={savePortfolioItem} onMouseDown={e => e.stopPropagation()} className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
            <div className='mb-5 flex items-start justify-between gap-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Редактировать работу</h3>
                <p className='mt-1 text-sm text-gray-500'>Измените категорию или описание фотографии.</p>
              </div>
              <button type='button' onClick={closePortfolioEditor} className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200' aria-label='Закрыть'>
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='flex gap-4'>
              <img src={editingPortfolioItem.imageUrl} alt='' className='h-24 w-24 flex-shrink-0 rounded-xl object-cover' />
              <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <label className='text-xs font-medium text-gray-500'>Категория</label>
                <select value={editPortfolioCategory} onChange={e => setEditPortfolioCategory(e.target.value)} className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary'>
                  {getPortfolioCategories(editData?.speciality).map(category => <option key={category} value={category}>{category}</option>)}
                  <option value={CUSTOM_PORTFOLIO_CATEGORY}>+ Своя категория</option>
                </select>
                {editPortfolioCategory === CUSTOM_PORTFOLIO_CATEGORY && (
                  <input
                    autoFocus
                    type='text'
                    value={editCustomPortfolioCategory}
                    onChange={e => setEditCustomPortfolioCategory(e.target.value)}
                    maxLength={60}
                    placeholder='Название категории'
                    className='w-full rounded-lg border border-primary px-3 py-2 text-sm outline-none'
                  />
                )}
              </div>
            </div>

            <label className='mt-4 block text-xs font-medium text-gray-500'>Описание</label>
            <textarea
              value={editPortfolioDescription}
              onChange={e => setEditPortfolioDescription(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder='Описание работы (необязательно)'
              className='mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary'
            />

            <div className='mt-5 flex justify-end gap-2'>
              <button type='button' onClick={closePortfolioEditor} disabled={savingPortfolioItem} className='rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50'>Отмена</button>
              <button type='submit' disabled={savingPortfolioItem} className='rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50'>
                {savingPortfolioItem ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer */}
      <div className='flex gap-3 justify-end mb-10'>
        <button
          onClick={() => navigate('/master-list')}
          className='px-6 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-all'
        >Отмена</button>
        <button
          onClick={handleSave}
          disabled={saving}
          className='px-6 py-2.5 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50'
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  )
}

export default EditMaster
