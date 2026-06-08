import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddMaster = () => {

    const [masterImg, setMasterImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Парикмахер')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [slotDuration, setSlotDuration] = useState(60)

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const passwordStrong = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!masterImg) {
                return toast.error('Фото не выбрано')
            }

            const formData = new FormData();

            formData.append('image', masterImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('slotDuration', Number(slotDuration))

            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-master', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setMasterImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Добавить мастера</p>

            <div className='bg-white px-4 sm:px-8 py-6 sm:py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="master-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={masterImg ? URL.createObjectURL(masterImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setMasterImg(e.target.files[0])} type="file" name="" id="master-img" hidden />
                    <p>Загрузите фото <br /> мастера</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Имя мастера</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Имя и фамилия' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Email мастера</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <div className='flex items-center gap-2'>
                                <p>Пароль</p>
                                <div className='relative group'>
                                    <span className='w-4 h-4 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center cursor-pointer select-none'>?</span>
                                    <div className='absolute left-6 top-[-8px] z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-3 w-56 shadow-lg'>
                                        <p className='font-semibold mb-1'>Требования к паролю:</p>
                                        <ul className='flex flex-col gap-1'>
                                            <li>&#10003; Минимум 8 символов</li>
                                            <li>&#10003; Хотя бы одна заглавная буква</li>
                                            <li>&#10003; Хотя бы одна цифра</li>
                                        </ul>
                                        <p className='mt-2 text-gray-300'>Пример: <span className='text-white'>Master2024</span></p>
                                    </div>
                                </div>
                            </div>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Мин. 8 символов, заглавная буква и цифра' required />
                            {password.length > 0 && password.length < 8 && (
                                <p className='text-xs text-red-400'>Слишком короткий — нужно минимум 8 символов</p>
                            )}
                            {password.length >= 8 && !/[A-Z]/.test(password) && (
                                <p className='text-xs text-orange-400'>Добавьте хотя бы одну заглавную букву (A-Z)</p>
                            )}
                            {password.length >= 8 && /[A-Z]/.test(password) && !/[0-9]/.test(password) && (
                                <p className='text-xs text-orange-400'>Добавьте хотя бы одну цифру (0-9)</p>
                            )}
                            {passwordStrong && (
                                <p className='text-xs text-green-500'>&#10003; Пароль подходит</p>
                            )}
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Опыт работы</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                <option value="1 Year">1 год</option>
                                <option value="2 Year">2 года</option>
                                <option value="3 Year">3 года</option>
                                <option value="4 Year">4 года</option>
                                <option value="5 Year">5 лет</option>
                                <option value="6 Year">6 лет</option>
                                <option value="8 Year">8 лет</option>
                                <option value="9 Year">9 лет</option>
                                <option value="10 Year">10+ лет</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Стоимость услуги</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Стоимость приёма' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Длительность процедуры</p>
                            <select onChange={e => setSlotDuration(e.target.value)} value={slotDuration} className='border rounded px-2 py-2'>
                                <option value={30}>30 минут</option>
                                <option value={45}>45 минут</option>
                                <option value={60}>1 час</option>
                                <option value={90}>1,5 часа</option>
                                <option value={120}>2 часа</option>
                                <option value={150}>2,5 часа</option>
                                <option value={180}>3 часа</option>
                            </select>
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Специализация</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
                                <option value="Парикмахер">Парикмахер</option>
                                <option value="Мастер маникюра">Мастер маникюра</option>
                                <option value="Мастер педикюра">Мастер педикюра</option>
                                <option value="Визажист">Визажист</option>
                                <option value="Бровист">Бровист</option>
                                <option value="Косметолог">Косметолог</option>
                                <option value="Массажист">Массажист</option>
                                <option value="Лешмейкер">Лешмейкер</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Сертификаты / Квалификация</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder="Например: Сертификат L'Oreal" required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Адрес / Рабочее место</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Адрес салона' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Кабинет / этаж' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>О мастере</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Расскажите о мастере, его стиле и опыте'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Добавить мастера</button>

            </div>

        </form>
    )
}

export default AddMaster
