import cron from 'node-cron'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import masterModel from '../models/masterModel.js'
import { sendMail } from './mailer.js'

const formatSlotDate = (slotDate) => {
    const [day, month, year] = slotDate.split('_')
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    return `${day} ${months[parseInt(month)]} ${year}`
}

// runs every day at 10:00
export const startReminderJob = () => {
    cron.schedule('0 10 * * *', async () => {
        try {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const dateKey = `${tomorrow.getDate()}_${tomorrow.getMonth()}_${tomorrow.getFullYear()}`

            const appointments = await appointmentModel.find({
                slotDate: dateKey,
                cancelled: false,
                isCompleted: false
            })

            for (const apt of appointments) {
                const user = await userModel.findById(apt.userId).select('email name')
                const master = await masterModel.findById(apt.docId).select('name')
                if (!user?.email) continue

                await sendMail({
                    to: user.email,
                    subject: 'Напоминание о записи — Планета Красоты',
                    html: `
                        <div style="font-family:sans-serif;max-width:480px;margin:auto">
                            <h2 style="color:#5f6fff">Напоминание о визите</h2>
                            <p>Привет, <b>${user.name}</b>!</p>
                            <p>Завтра у тебя запись:</p>
                            <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin:16px 0">
                                <p style="margin:4px 0"><b>Мастер:</b> ${master?.name || 'Мастер'}</p>
                                <p style="margin:4px 0"><b>Дата:</b> ${formatSlotDate(apt.slotDate)}</p>
                                <p style="margin:4px 0"><b>Время:</b> ${apt.slotTime}</p>
                                <p style="margin:4px 0"><b>Стоимость:</b> ₽${apt.amount}</p>
                            </div>
                            <p style="color:#999;font-size:13px">Если нужно перенести или отменить — зайди в личный кабинет.</p>
                        </div>
                    `
                })
            }

            console.log(`[reminder] Sent ${appointments.length} reminders for ${dateKey}`)
        } catch (err) {
            console.error('[reminder] Error:', err.message)
        }
    })
}
