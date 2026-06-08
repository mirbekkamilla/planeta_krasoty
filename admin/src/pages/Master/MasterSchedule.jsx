import React, { useContext, useEffect, useState } from 'react'
import { MasterContext } from '../../context/MasterContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

const defaultSchedule = {
    0: { isWorking: false, start: '09:00', end: '21:00' },
    1: { isWorking: true,  start: '09:00', end: '21:00' },
    2: { isWorking: true,  start: '09:00', end: '21:00' },
    3: { isWorking: true,  start: '09:00', end: '21:00' },
    4: { isWorking: true,  start: '09:00', end: '21:00' },
    5: { isWorking: true,  start: '09:00', end: '21:00' },
    6: { isWorking: false, start: '09:00', end: '21:00' },
}

const MasterSchedule = () => {
    const { mToken, backendUrl } = useContext(MasterContext)
    const [schedule, setSchedule] = useState(defaultSchedule)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!mToken) return
        axios.get(backendUrl + '/api/master/schedule', { headers: { dtoken: mToken } })
            .then(({ data }) => {
                if (data.success && data.workSchedule) {
                    setSchedule({ ...defaultSchedule, ...data.workSchedule })
                }
            })
            .catch(console.log)
    }, [mToken])

    const toggle = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], isWorking: !prev[day].isWorking }
        }))
    }

    const setTime = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }))
    }

    const save = async () => {
        setSaving(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/master/schedule', { workSchedule: schedule }, { headers: { dtoken: mToken } })
            if (data.success) toast.success(data.message)
            else toast.error(data.message)
        } catch (e) {
            toast.error(e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='m-5 max-w-lg'>
            <p className='mb-5 text-lg font-medium'>Рабочий график</p>

            <div className='flex flex-col gap-3'>
                {[1, 2, 3, 4, 5, 6, 0].map(day => {
                    const s = schedule[day] || defaultSchedule[day]
                    return (
                        <div key={day} className={`flex flex-wrap items-center gap-3 sm:gap-4 p-4 rounded-xl border transition-colors ${s.isWorking ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                            <div className='w-20 sm:w-32 flex-shrink-0'>
                                <p className={`text-sm font-medium ${s.isWorking ? 'text-gray-800' : 'text-gray-400'}`}>{DAY_NAMES[day]}</p>
                            </div>

                            <label className='relative inline-flex items-center cursor-pointer flex-shrink-0'>
                                <input type='checkbox' checked={s.isWorking} onChange={() => toggle(day)} className='sr-only peer' />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>

                            {s.isWorking && (
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='time'
                                        value={s.start}
                                        onChange={e => setTime(day, 'start', e.target.value)}
                                        className='border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-primary'
                                    />
                                    <span className='text-gray-400 text-sm'>—</span>
                                    <input
                                        type='time'
                                        value={s.end}
                                        onChange={e => setTime(day, 'end', e.target.value)}
                                        className='border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-primary'
                                    />
                                </div>
                            )}

                            {!s.isWorking && <p className='text-sm text-gray-400'>Выходной</p>}
                        </div>
                    )
                })}
            </div>

            <button
                onClick={save}
                disabled={saving}
                className='mt-6 w-full py-2.5 bg-primary text-white rounded-full font-medium hover:opacity-90 disabled:opacity-50 transition-opacity'
            >
                {saving ? 'Сохранение...' : 'Сохранить расписание'}
            </button>
        </div>
    )
}

export default MasterSchedule
