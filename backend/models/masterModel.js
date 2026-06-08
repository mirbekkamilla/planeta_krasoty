import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
}, { _id: true })

const masterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    portfolio: { type: [portfolioItemSchema], default: [] },
    services: {
        type: [{
            name: { type: String, required: true },
            price: { type: Number, required: true },
            duration: { type: Number, required: true }
        }],
        default: []
    },
    slotDuration: { type: Number, default: 60 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    workSchedule: {
        type: Object,
        default: {
            0: { isWorking: false, start: '09:00', end: '21:00' },
            1: { isWorking: true,  start: '09:00', end: '21:00' },
            2: { isWorking: true,  start: '09:00', end: '21:00' },
            3: { isWorking: true,  start: '09:00', end: '21:00' },
            4: { isWorking: true,  start: '09:00', end: '21:00' },
            5: { isWorking: true,  start: '09:00', end: '21:00' },
            6: { isWorking: false, start: '09:00', end: '21:00' },
        }
    },
}, { minimize: false })

const masterModel = mongoose.models.doctor || mongoose.model("doctor", masterSchema);
export default masterModel;
