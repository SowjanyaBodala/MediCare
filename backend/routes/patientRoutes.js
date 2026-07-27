const express = require("express");
const { protect } = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const Invoice = require("../models/Invoice");
const MedicalRecord = require("../models/MedicalRecord");

const router = express.Router();

// GET /api/patient/dashboard - summary for logged-in patient
router.get("/dashboard", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const [upcomingCount, unpaidCount, recentRecords] = await Promise.all([
      Appointment.countDocuments({ patientId: userId, scheduledAt: { $gte: now }, status: { $in: ["requested", "approved"] } }),
      Invoice.countDocuments({ patientId: userId, status: "unpaid" }),
      MedicalRecord.find({ patientId: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      data: {
        upcomingAppointments: upcomingCount,
        unpaidInvoices: unpaidCount,
        recentRecords,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;




