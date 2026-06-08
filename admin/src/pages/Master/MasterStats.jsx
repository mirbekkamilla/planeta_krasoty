import React, { useContext, useEffect, useState } from 'react'
import { MasterContext } from '../../context/MasterContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

const MasterStats = () => {
    const { mToken, backendUrl } = useContext(MasterContext)
    const { currency } = useContext(AppContext)
    const [stats, setStats] = useState(null)

    useEffect(() => {
        if (!mToken) return
        axios.get(backendUrl + '/api/master/stats', { headers: { dtoken: mToken } })
            .then(({ data }) => { if (data.success) setStats(data.stats) })
            .catch(console.log)
    }, [mToken])

    if (!stats) return <div className='m-5 text-gray-400'>Загрузка...</div>

    const monthEntries = Object.entries(stats.byMonth).sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
    const maxRevenue = Math.max(...monthEntries.map(([, v]) => v.revenue), 1)

    const monthLabel = (key) => {
        const [year, month] = key.split('-')
        const names = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
        return `${names[parseInt(month) - 1]} ${year}`
    }

    return (
        <div className='m-5 max-w-3xl'>
            <p className='mb-5 text-lg font-medium'>Статистика</p>

            {/* Summary cards */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
                {[
                    { label: 'Всего записей', value: stats.total, color: 'text-gray-800' },
                    { label: 'Выполнено', value: stats.completed, color: 'text-green-600' },
                    { label: 'Отменено', value: stats.cancelled, color: 'text-red-500' },
                    { label: 'Уникальных клиентов', value: stats.uniqueClients, color: 'text-indigo-600' },
                ].map((card, i) => (
                    <div key={i} className='bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
                        <p className='text-xs text-gray-400 mb-1'>{card.label}</p>
                        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue */}
            <div className='bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-6'>
                <p className='text-xs text-gray-400 mb-1'>Общая выручка (выполненные записи)</p>
                <p className='text-3xl font-bold text-primary'>{currency}{stats.totalRevenue.toLocaleString()}</p>
            </div>

            {/* Monthly chart */}
            {monthEntries.length > 0 && (
                <div className='bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
                    <p className='text-sm font-medium text-gray-700 mb-4'>Выручка по месяцам</p>
                    <div className='flex items-end gap-3 h-32'>
                        {monthEntries.map(([key, val]) => (
                            <div key={key} className='flex-1 flex flex-col items-center gap-1'>
                                <p className='text-xs text-gray-500 font-medium'>{currency}{val.revenue}</p>
                                <div
                                    className='w-full bg-primary rounded-t-md transition-all'
                                    style={{ height: `${Math.max((val.revenue / maxRevenue) * 96, 4)}px` }}
                                />
                                <p className='text-xs text-gray-400 text-center leading-tight'>{monthLabel(key)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {monthEntries.length === 0 && (
                <div className='text-center py-10 text-gray-400'>
                    <p className='text-4xl mb-3'>📊</p>
                    <p>Нет данных для отображения</p>
                </div>
            )}
        </div>
    )
}

export default MasterStats
