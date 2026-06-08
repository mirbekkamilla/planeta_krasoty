import React, { useContext, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const SERVICES = ['Окрашивание', 'Стрижка', 'Укладка', 'Маникюр', 'Педикюр', 'Уход за кожей', 'Брови и ресницы', 'Другое']
const BUDGETS = ['До 1500 руб', '1500–3000 руб', '3000–5000 руб', 'Свыше 5000 руб']
const PRIORITIES = ['Опыт мастера', 'Низкая цена', 'Высокий рейтинг', 'Быстрый результат', 'Индивидуальный подход', 'Экономия времени']

const steps = ['Услуга', 'Бюджет', 'Приоритеты', 'Результат']

const AIMasterPicker = ({ onClose }) => {
    const { backendUrl } = useContext(AppContext)
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [service, setService] = useState('')
    const [budget, setBudget] = useState('')
    const [selectedPriorities, setSelectedPriorities] = useState([])
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    const togglePriority = (p) => {
        setSelectedPriorities(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : prev.length < 3 ? [...prev, p] : prev
        )
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        setStep(3)
        try {
            const { data } = await axios.post(backendUrl + '/api/ai/recommend', {
                service,
                budget,
                priorities: selectedPriorities,
                additionalInfo
            })
            if (data.success) {
                setResult(data.recommendation)
            } else {
                setError(data.message || 'Ошибка подбора')
            }
        } catch (e) {
            setError('Не удалось получить рекомендацию. Проверьте соединение.')
        }
        setLoading(false)
    }

    const goToMaster = () => {
        if (result?.master?._id) {
            onClose()
            navigate(`/appointment/${result.master._id}`)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden'>

                {/* Header */}
                <div className='bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-9 h-9 bg-white/20 rounded-full flex items-center justify-center'>
                                <svg className='w-5 h-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.416a4 4 0 00-.643 2.285v.382a2 2 0 01-2 2h-2a2 2 0 01-2-2v-.382a4 4 0 00-.643-2.285L7.343 16.243z' />
                                </svg>
                            </div>
                            <div>
                                <p className='text-white font-semibold text-sm'>ИИ-подбор мастера</p>
                                <p className='text-white/70 text-xs'>Powered by Claude AI</p>
                            </div>
                        </div>
                        <button onClick={onClose} className='text-white/70 hover:text-white transition-colors'>
                            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Step progress */}
                    <div className='flex gap-1.5 mt-4'>
                        {steps.map((s, i) => (
                            <div key={s} className='flex-1'>
                                <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-white/30'}`} />
                                <p className={`text-xs mt-1 text-center ${i === step ? 'text-white' : 'text-white/50'}`}>{s}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className='p-6'>

                    {/* Step 0 — Service */}
                    {step === 0 && (
                        <div>
                            <p className='font-semibold text-gray-800 mb-4'>Какая услуга вас интересует?</p>
                            <div className='grid grid-cols-2 gap-2'>
                                {SERVICES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setService(s)}
                                        className={`py-2.5 px-3 rounded-xl text-sm border-2 transition-all font-medium ${service === s ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                disabled={!service}
                                className='mt-5 w-full py-3 bg-indigo-500 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-indigo-600 transition-colors'
                            >
                                Далее
                            </button>
                        </div>
                    )}

                    {/* Step 1 — Budget */}
                    {step === 1 && (
                        <div>
                            <p className='font-semibold text-gray-800 mb-4'>Ваш бюджет на услугу?</p>
                            <div className='flex flex-col gap-2'>
                                {BUDGETS.map(b => (
                                    <button
                                        key={b}
                                        onClick={() => setBudget(b)}
                                        className={`py-3 px-4 rounded-xl text-sm border-2 transition-all font-medium text-left ${budget === b ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                            <div className='flex gap-3 mt-5'>
                                <button onClick={() => setStep(0)} className='flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors'>Назад</button>
                                <button onClick={() => setStep(2)} disabled={!budget} className='flex-1 py-3 bg-indigo-500 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-indigo-600 transition-colors'>Далее</button>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Priorities */}
                    {step === 2 && (
                        <div>
                            <p className='font-semibold text-gray-800 mb-1'>Что для вас важно? <span className='text-indigo-500'>(до 3)</span></p>
                            <p className='text-xs text-gray-400 mb-4'>Выбрано: {selectedPriorities.length}/3</p>
                            <div className='flex flex-wrap gap-2 mb-4'>
                                {PRIORITIES.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => togglePriority(p)}
                                        className={`py-2 px-3 rounded-full text-sm border-2 transition-all font-medium ${selectedPriorities.includes(p) ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={additionalInfo}
                                onChange={e => setAdditionalInfo(e.target.value)}
                                placeholder='Дополнительные пожелания (необязательно)...'
                                rows={2}
                                className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none transition-colors'
                            />
                            <div className='flex gap-3 mt-4'>
                                <button onClick={() => setStep(1)} className='flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors'>Назад</button>
                                <button onClick={handleSubmit} disabled={selectedPriorities.length === 0} className='flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-40 hover:opacity-90 transition-opacity'>Подобрать</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Result */}
                    {step === 3 && (
                        <div>
                            {loading && (
                                <div className='flex flex-col items-center justify-center py-10 gap-4'>
                                    <div className='relative'>
                                        <div className='w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin' />
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <svg className='w-6 h-6 text-indigo-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.416a4 4 0 00-.643 2.285v.382a2 2 0 01-2 2h-2a2 2 0 01-2-2v-.382a4 4 0 00-.643-2.285L7.343 16.243z' />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <p className='font-semibold text-gray-800'>ИИ анализирует мастеров...</p>
                                        <p className='text-sm text-gray-400 mt-1'>Это займёт несколько секунд</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className='text-center py-8'>
                                    <p className='text-4xl mb-3'>😕</p>
                                    <p className='text-gray-600 font-medium'>{error}</p>
                                    <button onClick={() => setStep(2)} className='mt-4 px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors'>Попробовать снова</button>
                                </div>
                            )}

                            {result && !loading && (
                                <div>
                                    <div className='flex items-center gap-2 mb-4'>
                                        <div className='w-2 h-2 rounded-full bg-green-400' />
                                        <p className='text-sm text-gray-500'>Подбор завершён</p>
                                    </div>

                                    {/* Master card */}
                                    <div className='border-2 border-indigo-100 rounded-2xl p-4 bg-indigo-50/50 mb-4'>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0'>
                                                <span className='text-white text-xl font-bold'>
                                                    {result.master.name?.charAt(0)}
                                                </span>
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2 flex-wrap'>
                                                    <p className='font-semibold text-gray-800'>{result.master.name}</p>
                                                    <span className='text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full'>{result.matchScore}% совпадение</span>
                                                </div>
                                                <p className='text-sm text-indigo-600 mt-0.5'>{result.master.speciality}</p>
                                                <div className='flex items-center gap-3 mt-1 text-xs text-gray-500'>
                                                    <span>{result.master.experience}</span>
                                                    <span>•</span>
                                                    <span>{result.master.fees} руб</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-600 mt-3 leading-relaxed'>{result.reason}</p>
                                    </div>

                                    {/* Tips */}
                                    {result.tips?.length > 0 && (
                                        <div className='mb-5'>
                                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Советы</p>
                                            <ul className='space-y-1.5'>
                                                {result.tips.map((tip, i) => (
                                                    <li key={i} className='flex items-start gap-2 text-sm text-gray-600'>
                                                        <span className='text-indigo-500 mt-0.5'>✓</span>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className='flex gap-3'>
                                        <button onClick={() => { setStep(0); setResult(null); setService(''); setBudget(''); setSelectedPriorities([]); setAdditionalInfo('') }} className='flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors'>
                                            Начать заново
                                        </button>
                                        <button onClick={goToMaster} className='flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity'>
                                            Записаться
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AIMasterPicker
