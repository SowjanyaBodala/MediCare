const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true },   // e.g., "17:00"
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true, index: true },
    qualifications: { type: [String], default: [] },
    yearsOfExperience: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      location: { type: String, trim: true },
    },
    availability: { type: [availabilitySlotSchema], default: [] },
    consultationFee: { type: Number, default: 0 },
    image: { type: String, trim: true },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 100 },
    nextAvailable: { type: String, default: "Today, 4:00 PM" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.index({ name: "text", specialization: "text", bio: "text" });

module.exports = mongoose.model("Doctor", doctorSchema);
