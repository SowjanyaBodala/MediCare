const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", index: true },
    items: { type: [invoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid", index: true },
    dueDate: { type: Date },
    paidAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", function (next) {
  const subtotal = this.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  this.subtotal = Math.round(subtotal * 100) / 100;
  const tax = this.tax || 0;
  this.total = Math.round((this.subtotal + tax) * 100) / 100;
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);


