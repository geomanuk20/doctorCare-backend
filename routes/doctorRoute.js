import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentDcotor, doctorDashboard, doctorList, doctorProfile, loginDoctor, updataDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentDcotor)
doctorRouter.post('/complete-appointments',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointments',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updataDoctorProfile)

export default doctorRouter;