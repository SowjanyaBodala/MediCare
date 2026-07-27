const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const Invoice = require("../models/Invoice");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Validation error", errors: errors.array() });
  }
  next();
};

// Create invoice (admin/doctor)
router.post(
  "/invoices",
  protect,
  authorize("admin", "doctor"),
  [
    body("patientId").isMongoId(),
    body("appointmentId").optional().isMongoId(),
    body("items").isArray({ min: 1 }),
    body("items.*.description").isString().notEmpty(),
    body("items.*.amount").isFloat({ min: 0 }),
    body("tax").optional().isFloat({ min: 0 }),
    body("dueDate").optional().isISO8601().toDate(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const invoice = await Invoice.create(req.body);
      res.status(201).json({ success: true, data: invoice });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Patient: list own invoices
router.get("/invoices/mine", protect, async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const filter = { patientId: req.user._id };
    const [items, total] = await Promise.all([
      Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Invoice.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: list invoices with filters
router.get(
  "/invoices",
  protect,
  authorize("admin"),
  [query("patientId").optional().isMongoId(), query("status").optional().isIn(["unpaid", "paid", "refunded"])],
  handleValidation,
  async (req, res) => {
    try {
      const { patientId, status } = req.query;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const skip = (page - 1) * limit;
      const filter = {};
      if (patientId) filter.patientId = patientId;
      if (status) filter.status = status;
      const [items, total] = await Promise.all([
        Invoice.find(filter).populate("patientId", "fullName email phone").sort({ createdAt: -1 }).skip(skip).limit(limit),
        Invoice.countDocuments(filter),
      ]);
      res.json({ success: true, data: items, pagination: { page, limit, total } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Pay invoice (simulate)
router.patch(
  "/invoices/:id/pay",
  protect,
  [param("id").isMongoId()],
  handleValidation,
  async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
      // Only the owner patient or admin can mark as paid
      const isOwner = String(invoice.patientId) === String(req.user._id);
      const isAdmin = req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: "Not authorized to pay this invoice" });
      }
      invoice.status = "paid";
      invoice.paidAt = new Date();
      await invoice.save();
      res.json({ success: true, data: invoice });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;




