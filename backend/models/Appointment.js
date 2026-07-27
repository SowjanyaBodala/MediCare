const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    scheduledAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["requested", "approved", "cancelled", "completed"],
      default: "requested",
      index: true,
    },
    reason: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  },
  { timestamps: true }
);

// Prevent double booking for the same doctor and exact time
appointmentSchema.index({ doctorId: 1, scheduledAt: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);


