import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import masterModel from "../models/masterModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bonusHistoryModel from "../models/bonusHistoryModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, dob, gender, currentPassword, newPassword } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Handle password change if requested
        if (newPassword) {
            if (!currentPassword) {
                return res.json({ success: false, message: "Введите текущий пароль" })
            }
            if (newPassword.length < 8) {
                return res.json({ success: false, message: "Новый пароль должен быть не менее 8 символов" })
            }
            const user = await userModel.findById(userId)
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Текущий пароль неверный" })
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await userModel.findByIdAndUpdate(userId, { password: hashedPassword })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime, service } = req.body
        const docData = await masterModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Мастер недоступен' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            service: service || null,
            amount: service ? service.price : docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await masterModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing master slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await masterModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await masterModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// GET /api/user/loyalty — bonus points, achievements, VIP status
const getLoyalty = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId).select('bonusPoints totalVisits achievements isVip')
        if (!user) {
            return res.json({ success: false, message: 'Пользователь не найден' })
        }

        const nextLevel = user.totalVisits < 1 ? { name: 'first_visit', visitsRequired: 1 } :
            user.totalVisits < 5 ? { name: 'loyal_client', visitsRequired: 5 } :
            user.totalVisits < 10 ? { name: 'vip', visitsRequired: 10 } : null

        res.json({
            success: true,
            loyalty: {
                bonusPoints: user.bonusPoints,
                totalVisits: user.totalVisits,
                achievements: user.achievements,
                isVip: user.isVip,
                nextLevel
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/user/use-bonus — deduct bonus points during payment
const useBonus = async (req, res) => {
    try {
        const { userId, bonusToUse, appointmentId } = req.body

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'Пользователь не найден' })
        }
        if (user.bonusPoints < bonusToUse) {
            return res.json({ success: false, message: 'Недостаточно бонусных баллов' })
        }

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment || appointment.userId !== userId) {
            return res.json({ success: false, message: 'Запись не найдена' })
        }

        const discount = Math.min(bonusToUse, appointment.amount)
        await userModel.findByIdAndUpdate(userId, { $inc: { bonusPoints: -discount } })
        await appointmentModel.findByIdAndUpdate(appointmentId, { $inc: { amount: -discount } })
        await bonusHistoryModel.create({
            userId,
            type: 'spent',
            amount: discount,
            description: `Оплата записи`
        })

        res.json({ success: true, message: `Списано ${discount} бонусных баллов`, discount })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/user/favorites/toggle — add or remove master from favorites
const toggleFavorite = async (req, res) => {
    try {
        const { userId, masterId } = req.body
        const user = await userModel.findById(userId)
        const isFav = user.favorites.includes(masterId)
        if (isFav) {
            await userModel.findByIdAndUpdate(userId, { $pull: { favorites: masterId } })
            res.json({ success: true, isFavorite: false, message: 'Удалено из избранного' })
        } else {
            await userModel.findByIdAndUpdate(userId, { $push: { favorites: masterId } })
            res.json({ success: true, isFavorite: true, message: 'Добавлено в избранное' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/user/bonus-history
const getBonusHistory = async (req, res) => {
    try {
        const { userId } = req.body
        const history = await bonusHistoryModel.find({ userId }).sort({ date: -1 }).limit(50)
        res.json({ success: true, history })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/user/reschedule-appointment
const rescheduleAppointment = async (req, res) => {
    try {
        const { userId, appointmentId, newSlotDate, newSlotTime } = req.body

        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment || appointment.userId !== userId) {
            return res.json({ success: false, message: 'Запись не найдена' })
        }
        if (appointment.cancelled || appointment.isCompleted) {
            return res.json({ success: false, message: 'Нельзя перенести эту запись' })
        }

        const master = await masterModel.findById(appointment.docId)
        const slots_booked = master.slots_booked

        // check new slot is free
        if (slots_booked[newSlotDate] && slots_booked[newSlotDate].includes(newSlotTime)) {
            return res.json({ success: false, message: 'Выбранное время уже занято' })
        }

        // release old slot
        if (slots_booked[appointment.slotDate]) {
            slots_booked[appointment.slotDate] = slots_booked[appointment.slotDate].filter(t => t !== appointment.slotTime)
        }

        // book new slot
        if (!slots_booked[newSlotDate]) slots_booked[newSlotDate] = []
        slots_booked[newSlotDate].push(newSlotTime)

        await masterModel.findByIdAndUpdate(appointment.docId, { slots_booked })
        await appointmentModel.findByIdAndUpdate(appointmentId, { slotDate: newSlotDate, slotTime: newSlotTime })

        res.json({ success: true, message: 'Запись перенесена' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/user/favorites — get user's favorite masters
const getFavorites = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId).select('favorites')
        const masters = await masterModel.find({ _id: { $in: user.favorites } }).select('-password')
        res.json({ success: true, favorites: masters })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    getLoyalty,
    useBonus,
    getBonusHistory,
    rescheduleAppointment,
    toggleFavorite,
    getFavorites
}