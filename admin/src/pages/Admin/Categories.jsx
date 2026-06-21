import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const emptyForm = { name: '', order: 0, active: true, image: null }

const Categories = () => {
  const { backendUrl, aToken } = useContext(AdminContext)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const fileRef = useRef(null)

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/category/all', { headers: { aToken } })
      if (data.success) setCategories(data.categories)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (aToken) fetchCategories()
  }, [aToken])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
    setCurrentImage('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const startEditing = (category) => {
    setEditingId(category._id)
    setCurrentImage(category.image || '')
    setForm({ name: category.name, order: category.order, active: category.active, image: null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveCategory = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return toast.error('Введите название категории')

    setSaving(true)
    try {
      const body = new FormData()
      body.append('name', form.name.trim())
      body.append('order', Number(form.order) || 0)
      body.append('active', String(form.active))
      if (form.image) body.append('image', form.image)

      const request = editingId
        ? axios.put(backendUrl + `/api/category/${editingId}`, body, { headers: { aToken } })
        : axios.post(backendUrl + '/api/category', body, { headers: { aToken } })
      const { data } = await request

      if (data.success) {
        toast.success(data.message)
        resetForm()
        fetchCategories()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (category) => {
    if (!confirm(`Удалить категорию «${category.name}»?`)) return
    setDeletingId(category._id)
    try {
      const { data } = await axios.delete(backendUrl + `/api/category/${category._id}`, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)
        setCategories(current => current.filter(item => item._id !== category._id))
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeletingId('')
    }
  }

  const preview = form.image ? URL.createObjectURL(form.image) : currentImage

  return (
    <div className='m-5 w-full max-w-5xl'>
      <div className='mb-6'>
        <h1 className='text-xl font-semibold text-gray-800'>Категории мастеров</h1>
        <p className='mt-1 text-sm text-gray-500'>Добавляйте направления, которые появятся на сайте и в формах мастеров.</p>
      </div>

      <form onSubmit={saveCategory} className='mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='font-medium text-gray-700'>{editingId ? 'Редактировать категорию' : 'Новая категория'}</h2>
          {editingId && <button type='button' onClick={resetForm} className='text-sm text-gray-400 hover:text-primary'>Отменить</button>}
        </div>
        <div className='grid gap-4 sm:grid-cols-[96px_1fr_110px]'>
          <label className='flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-xs text-gray-400 transition hover:border-primary'>
            {preview ? <img src={preview} alt='' className='h-full w-full object-cover' /> : <span>Добавить<br />фото</span>}
            <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={e => setForm({ ...form, image: e.target.files[0] || null })} />
          </label>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>Название</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={60} placeholder='Например: Барбер' className='w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary' />
            <label className='mt-3 flex items-center gap-2 text-sm text-gray-600'>
              <input type='checkbox' checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className='h-4 w-4 accent-primary' />
              Показывать на сайте
            </label>
          </div>
          <div>
            <label className='mb-1 block text-sm text-gray-500'>Порядок</label>
            <input type='number' min='0' value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} className='w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-primary' />
          </div>
        </div>
        <button disabled={saving} className='mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:opacity-50'>
          {saving ? 'Сохранение...' : editingId ? 'Сохранить изменения' : 'Добавить категорию'}
        </button>
      </form>

      {loading ? <p className='py-10 text-center text-gray-400'>Загрузка...</p> : (
        <div className='grid gap-3 sm:grid-cols-2'>
          {categories.map(category => (
            <div key={category._id} className={`flex items-center gap-4 rounded-2xl border bg-white p-4 transition ${category.active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              {category.image ? (
                <img src={category.image} alt='' className='h-16 w-16 flex-shrink-0 rounded-xl object-cover' />
              ) : (
                <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-semibold text-primary'>{category.name.charAt(0)}</div>
              )}
              <div className='min-w-0 flex-1'>
                <p className='truncate font-medium text-gray-800'>{category.name}</p>
                <p className='mt-1 text-xs text-gray-400'>{category.mastersCount} мастеров · порядок {category.order}</p>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] ${category.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{category.active ? 'Активна' : 'Скрыта'}</span>
              </div>
              <div className='flex flex-col gap-2'>
                <button onClick={() => startEditing(category)} className='rounded-lg bg-[#F2F3FF] px-3 py-1.5 text-xs text-primary hover:bg-primary hover:text-white'>Изменить</button>
                <button onClick={() => deleteCategory(category)} disabled={deletingId === category._id} className='rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-50 disabled:opacity-50'>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Categories
