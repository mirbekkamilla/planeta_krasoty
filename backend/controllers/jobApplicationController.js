import jobApplicationModel from '../models/jobApplicationModel.js'

// POST /api/user/job-application — submit a job application (public)
const submitJobApplication = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body

        if (!name || !phone || !email) {
            return res.json({ success: false, message: 'Заполните имя, телефон и email' })
        }

        await jobApplicationModel.create({ name, phone, email, message })

        res.json({ success: true, message: 'Спасибо! Ваш отклик отправлен, мы свяжемся с вами' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/admin/job-applications — list all job applications (admin only)
const getAllJobApplications = async (req, res) => {
    try {
        const applications = await jobApplicationModel.find({}).sort({ createdAt: -1 })
        res.json({ success: true, applications })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { submitJobApplication, getAllJobApplications }
