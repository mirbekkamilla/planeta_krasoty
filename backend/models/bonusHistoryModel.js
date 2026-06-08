import mongoose from "mongoose"

const bonusHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['earned', 'spent'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

const bonusHistoryModel = mongoose.models.bonusHistory || mongoose.model("bonusHistory", bonusHistorySchema)
export default bonusHistoryModel
