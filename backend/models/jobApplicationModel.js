import mongoose from 'mongoose'

const jobApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
})

const jobApplicationModel = mongoose.models.jobApplication || mongoose.model('jobApplication', jobApplicationSchema)
export default jobApplicationModel
