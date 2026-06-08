import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const JobApplications = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    const loadApplications = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/job-applications', { headers: { aToken } })
            if (data.success) setApplications(data.applications)
        } catch (error) {
            console.log(error)
            toast.error('Ошибка загрузки откликов')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadApplications()
    }, [])

    return (
        <div className='m-5 w-full'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-xl font-semibold text-gray-800'>Отклики на вакансии</h1>
                <button
                    onClick={loadApplications}
                    className='text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors'
                >
                    Обновить
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center py-20 text-gray-400'>
                    <p>Загрузка...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className='bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400'>
                    <p className='text-4xl mb-3'>📋</p>
                    <p className='font-medium'>Откликов пока нет</p>
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {applications.map((app) => (
                        <div key={app._id} className='bg-white rounded-2xl border border-gray-200 p-5'>
                            <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mb-2'>
                                <p className='font-medium text-gray-800'>{app.name}</p>
                                <a href={`tel:${app.phone}`} className='text-sm text-primary hover:underline'>{app.phone}</a>
                                <a href={`mailto:${app.email}`} className='text-sm text-primary hover:underline'>{app.email}</a>
                            </div>
                            {app.message && <p className='text-sm text-gray-600 mb-2 whitespace-pre-line'>{app.message}</p>}
                            <p className='text-xs text-gray-400'>
                                {new Date(app.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default JobApplications
