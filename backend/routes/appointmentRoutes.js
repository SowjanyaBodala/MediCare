const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Validation error", errors: errors.array() });
  }
  next();
};

// Create appointment (patient)
router.post(
  "/",
  protect,
  [
    body("doctorId").isMongoId(),
    body("scheduledAt").isISO8601().toDate(),
    body("reason").optional().isString().isLength({ max: 500 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { doctorId, scheduledAt, reason } = req.body;
      if (new Date(scheduledAt) <= new Date()) {
        return res.status(400).json({ success: false, message: "scheduledAt must be in the future" });
      }

      const appointment = await Appointment.create({
        patientId: req.user._id,
        doctorId,
        scheduledAt,
        reason,
        createdBy: req.user._id,
      });

      // Notify patient (console log mail)
      try {
        await sendMail({
          to: req.user.email,
          subject: "MediCare+ Appointment Request Received",
          text: `Your appointment request with doctor ${doctorId} is scheduled at ${new Date(scheduledAt).toISOString()}. We will confirm shortly.`,
          html: `<p>Your appointment request with doctor <b>${doctorId}</b> is scheduled at <b>${new Date(scheduledAt).toLocaleString()}</b>. We will confirm shortly.</p>`,
        });
      } catch (e) {
        // non-fatal
      }

      res.status(201).json({ success: true, data: appointment });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(409).json({ success: false, message: "This time slot is already booked for the doctor" });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Get current patient's appointments
router.get("/mine", protect, async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const filter = { patientId: req.user._id };
    const [items, total] = await Promise.all([
      Appointment.find(filter)
        .populate("doctorId", "name specialization")
        .sort({ scheduledAt: -1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get doctor's appointments (for logged-in doctor)
router.get("/doctor", protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found for user" });
    }
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const filter = { doctorId: doctor._id };
    const [items, total] = await Promise.all([
      Appointment.find(filter).sort({ scheduledAt: -1 }).skip(skip).limit(limit),
      Appointment.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin list with filters
router.get(
  "/",
  protect,
  authorize("admin"),
  [
    query("doctorId").optional().isMongoId(),
    query("patientId").optional().isMongoId(),
    query("status").optional().isIn(["requested", "approved", "cancelled", "completed"]),
    query("from").optional().isISO8601().toDate(),
    query("to").optional().isISO8601().toDate(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { doctorId, patientId, status, from, to } = req.query;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const skip = (page - 1) * limit;
      const filter = {};
      if (doctorId) filter.doctorId = doctorId;
      if (patientId) filter.patientId = patientId;
      if (status) filter.status = status;
      if (from || to) filter.scheduledAt = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
      const [items, total] = await Promise.all([
        Appointment.find(filter)
          .populate("doctorId", "name specialization")
          .populate("patientId", "fullName email")
          .sort({ scheduledAt: -1 })
          .skip(skip)
          .limit(limit),
        Appointment.countDocuments(filter),
      ]);
      res.json({ success: true, data: items, pagination: { page, limit, total } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Update status (doctor/admin)
router.patch(
  "/:id/status",
  protect,
  [param("id").isMongoId(), body("status").isIn(["approved", "cancelled", "completed"])],
  handleValidation,
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

      // Only admin or doctor owning the appointment can change status
      let isDoctorOwner = false;
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor && String(doctor._id) === String(appointment.doctorId)) {
        isDoctorOwner = true;
      }
      const isAdmin = req.user.role === "admin";
      if (!isAdmin && !isDoctorOwner) {
        return res.status(403).json({ success: false, message: "Not authorized to update this appointment" });
      }

      appointment.status = req.body.status;
      await appointment.save();

      // Notify patient about status change
      try {
        const patient = await User.findById(appointment.patientId);
        if (patient && patient.email) {
          await sendMail({
            to: patient.email,
            subject: `MediCare+ Appointment ${appointment.status}`,
            text: `Your appointment on ${new Date(appointment.scheduledAt).toISOString()} is now ${appointment.status}.`,
            html: `<p>Your appointment on <b>${new Date(appointment.scheduledAt).toLocaleString()}</b> is now <b>${appointment.status}</b>.</p>`,
          });
        }
      } catch (e) {
        // non-fatal
      }
      res.json({ success: true, data: appointment });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;


