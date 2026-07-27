const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }, // storage URL or path
  },
  { _id: false }
);

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", index: true },
    type: { type: String, enum: ["prescription", "lab", "imaging", "note", "other"], default: "other" },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    files: { type: [fileSchema], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ title: "text", description: "text" });
medicalRecordSchema.index({ tags: 1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
