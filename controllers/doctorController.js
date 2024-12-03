import mongoose from 'mongoose';
import doctorModel from '../models/doctorModel.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import appointmentModel from '../models/appointmentModel.js';



// Change doctor's availability status
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: 'Doctor ID is required' });
    }

    // Validate if docId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ success: false, message: 'Invalid Doctor ID format' });
    }

    // Update availability directly
    const updatedDoc = await doctorModel.findByIdAndUpdate(
      docId,
      [{ $set: { available: { $not: "$available" } } }], // Toggle the available field
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, message: 'Availability status updated', doctor: updatedDoc });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// List all doctors
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//api for doctor login
const loginDoctor = async (req,res)=>{
  try {
    const {email,password} = req.body;
    const doctor = await doctorModel.findOne({email})

    if(!doctor){
      return res.json({success:false,message:"invaild credentials"})
    }
    const isMatch = await bcrypt.compare(password,doctor.password)

    if(isMatch){
      const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"invaild credentials"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// api to doctor appointment for doctor panel
const appointmentDcotor = async (req,res)=>{
  try {
    
    const {docId} = req.body;
    const appointments = await appointmentModel.find({docId})
    
    res.json({success:true,appointments})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//api to mark appointmnet completed for doctor pannel

const appointmentComplete = async(req,res)=>{
  try {
    const {docId,appointmentId} = req.body;
    const  appointmentData = await appointmentModel.findById(appointmentId)
    
    if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({success:true,message:"Appointmnet completed"})
    }else{
      return res.json({success:false,message:"Mark Failed"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//api to cancel appointmnet completed for doctor pannel

const appointmentCancel = async(req,res)=>{
  try {
    const {docId,appointmentId} = req.body;
    const  appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({success:true,message:"Appointmnet Cancelled"})
    }else{
      return res.json({success:false,message:"Cancellation Failed"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}


// api to get dashboard data for doctor panel 

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    const patientsSet = new Set();
    appointments.forEach((item) => {
      patientsSet.add(item.userId);
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientsSet.size,
      latestAppointments: appointments.reverse().slice(0, 5) // Use lowercase 'l' for consistency
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get doctor profile for doctor panel
const doctorProfile = async (req,res)=>{
  try {
    const {docId} = req.body;
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({success:true,profileData})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//api to updata doctor profile data fron doctor panel
const updataDoctorProfile = async(req,res)=>{
  try {
    const {docId, fees, address, available} =req.body;
    await doctorModel.findByIdAndUpdate(docId ,{fees,address,available})

    res.json({success:true,message:"profile Updated"})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}

export { changeAvailability, doctorList,loginDoctor,appointmentDcotor,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updataDoctorProfile };
