require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");
const Invoice = require("./models/Invoice");
const MedicalRecord = require("./models/MedicalRecord");

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const [userCount, doctorCount, appointmentCount, invoiceCount, recordCount] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Invoice.countDocuments(),
      MedicalRecord.countDocuments(),
    ]);
    
    console.log(`Users: ${userCount}`);
    console.log(`Doctors: ${doctorCount}`);
    console.log(`Appointments: ${appointmentCount}`);
    console.log(`Invoices: ${invoiceCount}`);
    console.log(`Medical Records: ${recordCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
