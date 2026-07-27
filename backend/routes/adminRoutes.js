const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const MedicalRecord = require("../models/MedicalRecord");

const router = express.Router();

// Get all users (admin only)
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({}, "_id fullName email phone role createdAt").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin dashboard stats summary
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const [
      userCount,
      doctorCount,
      patientCount,
      appointmentCount,
      recordCount,
      newUsers,
      newAppointments
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments({}),
      MedicalRecord.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } }),
      Appointment.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } })
    ]);
    res.json({
      success: true,
      data: {
        userCount,
        doctorCount,
        patientCount,
        appointmentCount,
        recordCount,
        newUsersLast7d: newUsers,
        newAppointmentsLast7d: newAppointments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

