import express from 'express';
import { loginMaster, appointmentsMaster, appointmentCancel, masterList, changeAvailablity, appointmentComplete, masterDashboard, masterProfile, updateMasterProfile, addPortfolioImage, deletePortfolioImage, getPortfolio, getSchedule, updateSchedule, masterStats } from '../controllers/masterController.js';
import authMaster from '../middleware/authMaster.js';
import upload from '../middleware/multer.js';
const masterRouter = express.Router();

masterRouter.post("/login", loginMaster)
masterRouter.post("/cancel-appointment", authMaster, appointmentCancel)
masterRouter.get("/appointments", authMaster, appointmentsMaster)
masterRouter.get("/list", masterList)
masterRouter.post("/change-availability", authMaster, changeAvailablity)
masterRouter.post("/complete-appointment", authMaster, appointmentComplete)
masterRouter.get("/dashboard", authMaster, masterDashboard)
masterRouter.get("/profile", authMaster, masterProfile)
masterRouter.post("/update-profile", authMaster, updateMasterProfile)

masterRouter.post("/portfolio", authMaster, upload.single('image'), addPortfolioImage)
masterRouter.delete("/portfolio/:imageId", authMaster, deletePortfolioImage)
masterRouter.get("/portfolio/:masterId", getPortfolio)

masterRouter.get("/schedule", authMaster, getSchedule)
masterRouter.post("/schedule", authMaster, updateSchedule)
masterRouter.get("/stats", authMaster, masterStats)

export default masterRouter;
