const express = require("express");
const Doctor = require("../models/Doctor");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all active doctors (optional search & specialization filter)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search, specialization } = req.query;
    let filter = { isActive: true };

    if (specialization && specialization !== "All") {
      filter.specialization = new RegExp(specialization, "i");
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { specialization: searchRegex },
        { bio: searchRegex },
      ];
    }

    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/doctors
// @desc    Create doctor profile
// @access  Private (Admin / Doctor)
router.post("/", protect, authorize("admin", "doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
