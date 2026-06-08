import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import masterModel from "../models/masterModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Master
const addMaster = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address, slotDuration } = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const masterData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            slotDuration: slotDuration ? Number(slotDuration) : 60,
            date: Date.now()
        }

        const newMaster = new masterModel(masterData)
        await newMaster.save()
        res.json({ success: true, message: 'Мастер добавлен' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all masters list for admin panel
const allMasters = async (req, res) => {
    try {

        const masters = await masterModel.find({}).select('-password')
        res.json({ success: true, masters })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const masters = await masterModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: masters.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for editing Master
const editMaster = async (req, res) => {
    try {
        const { docId, name, email, speciality, degree, experience, about, fees, address, slotDuration, services } = req.body
        const imageFile = req.file

        if (!docId) {
            return res.json({ success: false, message: "Master ID required" })
        }

        const updateData = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (speciality) updateData.speciality = speciality
        if (degree) updateData.degree = degree
        if (experience) updateData.experience = experience
        if (about) updateData.about = about
        if (fees) updateData.fees = fees
        if (slotDuration) updateData.slotDuration = Number(slotDuration)
        if (services !== undefined) updateData.services = JSON.parse(services)
        if (address) updateData.address = JSON.parse(address)

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            updateData.image = imageUpload.secure_url
        }

        await masterModel.findByIdAndUpdate(docId, updateData)
        res.json({ success: true, message: 'Данные мастера обновлены' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for archiving Master (soft delete)
const archiveMaster = async (req, res) => {
    try {
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: "Master ID required" })
        }

        await masterModel.findByIdAndUpdate(docId, { archived: true, available: false })
        res.json({ success: true, message: 'Мастер архивирован' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for restoring archived Master
const restoreMaster = async (req, res) => {
    try {
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: "Master ID required" })
        }

        await masterModel.findByIdAndUpdate(docId, { archived: false, available: true })
        res.json({ success: true, message: 'Мастер восстановлен' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin to change master password
const changeMasterPassword = async (req, res) => {
    try {
        const { docId, newPassword } = req.body
        if (!docId || !newPassword) {
            return res.json({ success: false, message: 'Недостаточно данных' })
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Пароль должен быть не менее 8 символов' })
        }
        const master = await masterModel.findById(docId)
        if (!master) {
            return res.json({ success: false, message: 'Мастер не найден' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        master.password = hashedPassword
        await master.save()
        res.json({ success: true, message: 'Пароль мастера изменён' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get single master data
const getMasterById = async (req, res) => {
    try {
        const { docId } = req.body
        const master = await masterModel.findById(docId).select('-password')
        res.json({ success: true, doctor: master })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin to add a portfolio image to a master's profile
const adminAddPortfolioImage = async (req, res) => {
    try {
        const { docId, category, description } = req.body
        const imageFile = req.file

        if (!docId) {
            return res.json({ success: false, message: "Master ID required" })
        }
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

// API for admin to remove a portfolio image from a master's profile
const adminDeletePortfolioImage = async (req, res) => {
    try {
        const { docId, imageId } = req.params

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

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addMaster,
    allMasters,
    adminDashboard,
    editMaster,
    archiveMaster,
    restoreMaster,
    getMasterById,
    changeMasterPassword,
    adminAddPortfolioImage,
    adminDeletePortfolioImage
}