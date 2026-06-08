import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import masterModel from "../models/masterModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import bonusHistoryModel from "../models/bonusHistoryModel.js";
import { v2 as cloudinary } from "cloudinary";

// API for master Login 
const loginMaster = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await masterModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get master appointments for master panel
const appointmentsMaster = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for master panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Award bonus points and update achievements for a user after completed visit
const awardLoyalty = async (userId, amount) => {
    const user = await userModel.findById(userId)
    if (!user) return

    const bonusEarned = Math.floor(amount * 0.05)
    const newBonusPoints = user.bonusPoints + bonusEarned
    const newTotalVisits = user.totalVisits + 1

    const achievements = new Set(user.achievements)
    if (newTotalVisits >= 1) achievements.add('first_visit')
    if (newTotalVisits >= 5) achievements.add('loyal_client')
    if (newTotalVisits >= 10 || newBonusPoints >= 1000) achievements.add('vip')

    const isVip = newTotalVisits >= 10 || newBonusPoints >= 1000

    await userModel.findByIdAndUpdate(userId, {
        bonusPoints: newBonusPoints,
        totalVisits: newTotalVisits,
        achievements: Array.from(achievements),
        isVip
    })

    if (bonusEarned > 0) {
        await bonusHistoryModel.create({
            userId,
            type: 'earned',
            amount: bonusEarned,
            description: `Визит на сумму ${amount}₽`
        })
    }
}

// API to mark appointment completed for master panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            await awardLoyalty(appointmentData.userId, appointmentData.amount)
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all masters list for Frontend
const masterList = async (req, res) => {
    try {

        const masters = await masterModel.find({}).select(['-password', '-email'])
        res.json({ success: true, masters })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change master availability for Admin and Master Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await masterModel.findById(docId)
        await masterModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get master profile for Master Panel
const masterProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await masterModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update master profile data from Master Panel
const updateMasterProfile = async (req, res) => {
    try {

        const { docId, fees, address, available, about, services } = req.body

        const updateData = { fees, address, available, about }
        if (services !== undefined) {
            updateData.services = typeof services === 'string' ? JSON.parse(services) : services
        }

        await masterModel.findByIdAndUpdate(docId, updateData)

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for master panel
const masterDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let clients = []

        appointments.map((item) => {
            if (!clients.includes(item.userId)) {
                clients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            clients: clients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/master/portfolio — upload portfolio image via Cloudinary
const addPortfolioImage = async (req, res) => {
    try {
        const { docId, category, description } = req.body
        const imageFile = req.file

        if (!imageFile) {
            return res.json({ success: false, message: 'Изображение не загружено' })
        }

        const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

        const portfolioItem = {
            imageUrl: upload.secure_url,
            publicId: upload.public_id,
            category: category || '',
            description: description || '',
            createdAt: new Date()
        }

        await masterModel.findByIdAndUpdate(docId, { $push: { portfolio: portfolioItem } })
        res.json({ success: true, message: 'Изображение добавлено в портфолио' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// DELETE /api/master/portfolio/:imageId — remove image from portfolio and Cloudinary
const deletePortfolioImage = async (req, res) => {
    try {
        const { docId } = req.body
        const { imageId } = req.params

        const master = await masterModel.findById(docId)
        if (!master) {
            return res.json({ success: false, message: 'Мастер не найден' })
        }

        const item = master.portfolio.id(imageId)
        if (!item) {
            return res.json({ success: false, message: 'Изображение не найдено' })
        }

        await cloudinary.uploader.destroy(item.publicId)
        await masterModel.findByIdAndUpdate(docId, { $pull: { portfolio: { _id: imageId } } })

        res.json({ success: true, message: 'Изображение удалено' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/master/schedule — get master work schedule
const getSchedule = async (req, res) => {
    try {
        const { docId } = req.body
        const master = await masterModel.findById(docId).select('workSchedule')
        res.json({ success: true, workSchedule: master.workSchedule })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/master/schedule — update master work schedule
const updateSchedule = async (req, res) => {
    try {
        const { docId, workSchedule } = req.body
        await masterModel.findByIdAndUpdate(docId, { workSchedule })
        res.json({ success: true, message: 'Расписание обновлено' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/master/stats — master statistics
const masterStats = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        const completed = appointments.filter(a => a.isCompleted)
        const cancelled = appointments.filter(a => a.cancelled)
        const upcoming = appointments.filter(a => !a.isCompleted && !a.cancelled)

        const totalRevenue = completed.reduce((sum, a) => sum + a.amount, 0)

        // Group completed by month
        const byMonth = {}
        completed.forEach(a => {
            const d = new Date(a.date)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            if (!byMonth[key]) byMonth[key] = { count: 0, revenue: 0 }
            byMonth[key].count++
            byMonth[key].revenue += a.amount
        })

        const uniqueClients = [...new Set(appointments.map(a => a.userId))].length

        res.json({
            success: true,
            stats: {
                total: appointments.length,
                completed: completed.length,
                cancelled: cancelled.length,
                upcoming: upcoming.length,
                totalRevenue,
                uniqueClients,
                byMonth
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/master/portfolio/:masterId — get portfolio of a master (public)
const getPortfolio = async (req, res) => {
    try {
        const { masterId } = req.params
        const master = await masterModel.findById(masterId).select('portfolio')
        if (!master) {
            return res.json({ success: false, message: 'Мастер не найден' })
        }
        res.json({ success: true, portfolio: master.portfolio })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginMaster,
    appointmentsMaster,
    appointmentCancel,
    masterList,
    changeAvailablity,
    appointmentComplete,
    masterDashboard,
    masterProfile,
    updateMasterProfile,
    addPortfolioImage,
    deletePortfolioImage,
    getPortfolio,
    getSchedule,
    updateSchedule,
    masterStats
}
