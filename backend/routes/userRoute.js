import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe, getLoyalty, useBonus, getBonusHistory, rescheduleAppointment, toggleFavorite, getFavorites } from '../controllers/userController.js';
import { createReview, getMasterReviews, deleteReview, getAllApprovedReviews } from '../controllers/reviewController.js';
import { submitJobApplication } from '../controllers/jobApplicationController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
userRouter.post("/payment-stripe", authUser, paymentStripe)
userRouter.post("/verifyStripe", authUser, verifyStripe)

userRouter.get("/loyalty", authUser, getLoyalty)
userRouter.post("/use-bonus", authUser, useBonus)
userRouter.get("/bonus-history", authUser, getBonusHistory)
userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment)

userRouter.post("/favorites/toggle", authUser, toggleFavorite)
userRouter.get("/favorites", authUser, getFavorites)

userRouter.get("/reviews", getAllApprovedReviews)
userRouter.post("/reviews", authUser, createReview)
userRouter.get("/reviews/:masterId", getMasterReviews)
userRouter.delete("/reviews/:reviewId", authUser, deleteReview)

userRouter.post("/job-application", submitJobApplication)

export default userRouter;