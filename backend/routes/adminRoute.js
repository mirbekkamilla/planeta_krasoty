import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addMaster, allMasters, adminDashboard, editMaster, archiveMaster, restoreMaster, getMasterById, changeMasterPassword, adminAddPortfolioImage, adminDeletePortfolioImage } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/masterController.js';
import { getAllReviews, approveReview, adminDeleteReview } from '../controllers/reviewController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-master", authAdmin, upload.single('image'), addMaster)
adminRouter.post("/edit-master", authAdmin, upload.single('image'), editMaster)
adminRouter.post("/archive-master", authAdmin, archiveMaster)
adminRouter.post("/restore-master", authAdmin, restoreMaster)
adminRouter.post("/get-master", authAdmin, getMasterById)
adminRouter.post("/change-master-password", authAdmin, changeMasterPassword)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-masters", authAdmin, allMasters)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

adminRouter.post("/portfolio", authAdmin, upload.single('image'), adminAddPortfolioImage)
adminRouter.delete("/portfolio/:docId/:imageId", authAdmin, adminDeletePortfolioImage)

adminRouter.get("/reviews", authAdmin, getAllReviews)
adminRouter.patch("/reviews/:reviewId/approve", authAdmin, approveReview)
adminRouter.delete("/reviews/:reviewId", authAdmin, adminDeleteReview)

export default adminRouter;