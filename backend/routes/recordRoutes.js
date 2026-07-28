const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const Doctor = require("../models/Doctor");
const MedicalRecord = require("../models/MedicalRecord");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Validation error", errors: errors.array() });
  }
  next();
};

// Create medical record (doctor/admin/patient)
router.post(
  "/",
  protect,
  authorize("admin", "doctor", "patient"),
  [
    body("patientId").isMongoId(),
    body("type").optional().isIn(["prescription", "lab", "imaging", "note", "other"]),
    body("title").isString().notEmpty(),
    body("description").optional().isString(),
    body("files").optional().isArray(),
    body("files.*.filename").optional().isString().notEmpty(),
    body("files.*.mimetype").optional().isString().notEmpty(),
    body("files.*.size").optional().isInt({ min: 0 }),
    body("files.*.url").optional().isString().notEmpty(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      let doctorId = null;
      if (req.user.role === "doctor") {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
          return res.status(400).json({ success: false, message: "No doctor profile linked to this user" });
        }
        doctorId = doctor._id;
      } else if (req.body.doctorId) {
        doctorId = req.body.doctorId; // admin may provide doctorId explicitly
      }

      // Enforce patientId for patient role
      if (req.user.role === "patient") {
        req.body.patientId = req.user._id;
      }

      const record = await MedicalRecord.create({ ...req.body, doctorId });
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Get own medical records (patient)
router.get("/mine", protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get patient medical records (doctor/admin)
router.get(
  "/patient/:patientId",
  protect,
  authorize("admin", "doctor"),
  [param("patientId").isMongoId()],
  handleValidation,
  async (req, res) => {
    try {
      const records = await MedicalRecord.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
      res.json({ success: true, data: records });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;


