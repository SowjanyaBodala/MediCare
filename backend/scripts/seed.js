require("dotenv").config();
const connectDB = require("../config/database");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Invoice = require("../models/Invoice");
const MedicalRecord = require("../models/MedicalRecord");

(async function seed() {
  try {
    await connectDB();
    console.log("Database connected for seeding...");

    // 1. Clear existing collections for a clean seed
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      Invoice.deleteMany({}),
      MedicalRecord.deleteMany({}),
    ]);
    console.log("Cleared existing collections.");

    // 2. Create Admin User
    const adminUser = await User.create({
      fullName: "MediCare Admin",
      email: "admin@medicare.local",
      phone: "1234567890",
      password: "Admin@123456",
      role: "admin",
    });
    console.log("Admin user created.");

    // 3. Create Sample Patient User
    const patientUser = await User.create({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 000-0000",
      password: "password123",
      role: "patient",
    });

    const patientUser2 = await User.create({
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 111-2222",
      password: "password123",
      role: "patient",
    });
    console.log("Patient users created.");

    // 4. Create Doctor Users & Doctor Profiles
    const doctorDataList = [
      {
        fullName: "Dr. Sarah Johnson",
        email: "sarah.johnson@medicare.local",
        password: "password123",
        specialization: "Cardiologist",
        qualifications: ["MD", "FACC"],
        yearsOfExperience: 15,
        bio: "Senior Cardiologist specializing in preventive heart health and cardiovascular therapies.",
        location: "New York, NY",
        consultationFee: 250,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
        rating: 4.9,
        reviews: 234,
        nextAvailable: "Today, 4:00 PM",
      },
      {
        fullName: "Dr. Michael Chen",
        email: "michael.chen@medicare.local",
        password: "password123",
        specialization: "Dermatologist",
        qualifications: ["MD", "FAAD"],
        yearsOfExperience: 12,
        bio: "Expert dermatologist providing advanced skin treatments, cosmetic procedures, and allergy management.",
        location: "Los Angeles, CA",
        consultationFee: 200,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
        rating: 4.8,
        reviews: 189,
        nextAvailable: "Tomorrow, 10:30 AM",
      },
      {
        fullName: "Dr. Emily Williams",
        email: "emily.williams@medicare.local",
        password: "password123",
        specialization: "Pediatrician",
        qualifications: ["MD", "FAAP"],
        yearsOfExperience: 18,
        bio: "Compassionate pediatrician dedicated to comprehensive child wellness and growth monitoring.",
        location: "Chicago, IL",
        consultationFee: 180,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
        rating: 5.0,
        reviews: 312,
        nextAvailable: "In 2 days",
      },
      {
        fullName: "Dr. James Rodriguez",
        email: "james.rodriguez@medicare.local",
        password: "password123",
        specialization: "Orthopedic",
        qualifications: ["MD", "FAAOS"],
        yearsOfExperience: 10,
        bio: "Specialist in joint reconstruction, sports injuries, and spine rehabilitation.",
        location: "Houston, TX",
        consultationFee: 220,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
        rating: 4.7,
        reviews: 156,
        nextAvailable: "Today, 2:00 PM",
      },
      {
        fullName: "Dr. Lisa Anderson",
        email: "lisa.anderson@medicare.local",
        password: "password123",
        specialization: "Neurologist",
        qualifications: ["MD", "FAAN"],
        yearsOfExperience: 20,
        bio: "Renowned neurologist specializing in stroke prevention, epilepsy, and neurological disorders.",
        location: "Boston, MA",
        consultationFee: 300,
        image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=300&q=80",
        rating: 4.9,
        reviews: 278,
        nextAvailable: "Tomorrow, 9:00 AM",
      },
      {
        fullName: "Dr. Robert Kim",
        email: "robert.kim@medicare.local",
        password: "password123",
        specialization: "Cardiologist",
        qualifications: ["MD", "FACC"],
        yearsOfExperience: 14,
        bio: "Interventional cardiologist expert in cardiac catheterization and vascular health.",
        location: "San Francisco, CA",
        consultationFee: 260,
        image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&q=80",
        rating: 4.8,
        reviews: 201,
        nextAvailable: "In 3 days",
      },
    ];

    const createdDoctors = [];

    for (const docData of doctorDataList) {
      const docUser = await User.create({
        fullName: docData.fullName,
        email: docData.email,
        phone: "+1 (555) 999-8888",
        password: docData.password,
        role: "doctor",
      });

      const doctorProfile = await Doctor.create({
        userId: docUser._id,
        name: docData.fullName,
        specialization: docData.specialization,
        qualifications: docData.qualifications,
        yearsOfExperience: docData.yearsOfExperience,
        bio: docData.bio,
        contact: {
          phone: docUser.phone,
          email: docUser.email,
          location: docData.location,
        },
        consultationFee: docData.consultationFee,
        image: docData.image,
        rating: docData.rating,
        reviews: docData.reviews,
        nextAvailable: docData.nextAvailable,
        isActive: true,
      });

      createdDoctors.push(doctorProfile);
    }
    console.log(`Created ${createdDoctors.length} doctors.`);

    // 5. Create Sample Appointments
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    const appt1 = await Appointment.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[0]._id, // Dr. Sarah Johnson
      scheduledAt: tomorrow,
      status: "approved",
      reason: "Annual heart checkup and ECG review.",
      createdBy: patientUser._id,
    });

    const appt2 = await Appointment.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[1]._id, // Dr. Michael Chen
      scheduledAt: nextWeek,
      status: "requested",
      reason: "Skin allergy consultation and prescription renewal.",
      createdBy: patientUser._id,
    });

    const appt3 = await Appointment.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[3]._id, // Dr. James Rodriguez
      scheduledAt: pastDate,
      status: "completed",
      reason: "Knee pain evaluation post-exercise.",
      createdBy: patientUser._id,
    });

    console.log("Sample appointments created.");

    // 6. Create Sample Invoices
    await Invoice.create({
      patientId: patientUser._id,
      appointmentId: appt3._id,
      items: [
        { description: "Annual Health Checkup", amount: 250 },
      ],
      tax: 0,
      status: "paid",
      paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      notes: "Paid in full via online portal.",
    });

    await Invoice.create({
      patientId: patientUser._id,
      appointmentId: appt1._id,
      items: [
        { description: "Blood Test - Complete Panel", amount: 150 },
      ],
      tax: 0,
      status: "paid",
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: "Paid via credit card.",
    });

    await Invoice.create({
      patientId: patientUser._id,
      appointmentId: appt2._id,
      items: [
        { description: "Dermatology Consultation", amount: 200 },
      ],
      tax: 0,
      status: "unpaid",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: "Payment due before appointment.",
    });

    await Invoice.create({
      patientId: patientUser._id,
      items: [
        { description: "X-Ray Imaging - Left Knee", amount: 180 },
      ],
      tax: 0,
      status: "unpaid",
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      notes: "Overdue invoice.",
    });

    console.log("Sample invoices created.");

    // 7. Create Sample Medical Records
    await MedicalRecord.collection.dropIndexes().catch(() => {});
    await MedicalRecord.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[0]._id,
      type: "lab",
      title: "Comprehensive Blood Panel",
      description: "Full lipid panel, glucose levels, and blood count within normal ranges.",
      files: [
        {
          filename: "blood_panel_report.pdf",
          mimetype: "application/pdf",
          size: 1024500,
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      tags: ["blood", "lab", "cardiology"],
    });

    await MedicalRecord.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[1]._id,
      type: "prescription",
      title: "Dermatology Prescription",
      description: "Topical cream applied twice daily for skin irritation.",
      files: [
        {
          filename: "prescription_skin_care.pdf",
          mimetype: "application/pdf",
          size: 512000,
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      tags: ["skin", "prescription"],
    });

    await MedicalRecord.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[3]._id,
      type: "imaging",
      title: "Knee Joint X-Ray Scan",
      description: "Standard anterior-posterior view of knee joint; no structural fractures detected.",
      files: [
        {
          filename: "knee_xray_scan.jpg",
          mimetype: "image/jpeg",
          size: 2048000,
          url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80",
        },
      ],
      tags: ["xray", "orthopedic"],
    });

    await MedicalRecord.create({
      patientId: patientUser._id,
      doctorId: createdDoctors[0]._id,
      type: "note",
      title: "Annual Cardiovascular Summary",
      description: "Patient exhibits excellent resting heart rate and normal blood pressure.",
      files: [
        {
          filename: "cardio_summary.pdf",
          mimetype: "application/pdf",
          size: 780000,
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      tags: ["cardiology", "summary"],
    });

    console.log("Sample medical records created.");

    console.log("\n==========================================");
    console.log("SUCCESS: Database seeding completed!");
    console.log("==========================================");
    console.log("Credentials for testing:");
    console.log("Admin:   admin@medicare.local  / Admin@123456");
    console.log("Patient: john@example.com      / password123");
    console.log("Doctor:  sarah.johnson@medicare.local / password123");
    console.log("==========================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
})();
