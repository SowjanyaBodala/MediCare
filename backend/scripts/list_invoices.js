require("dotenv").config();
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const User = require("../models/User");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const invoices = await Invoice.find().populate("patientId", "fullName email");
    console.log("INVOICES LIST:");
    invoices.forEach(inv => {
      console.log({
        _id: inv._id,
        patient: inv.patientId ? { name: inv.patientId.fullName, email: inv.patientId.email } : null,
        total: inv.total,
        status: inv.status,
        items: inv.items
      });
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
