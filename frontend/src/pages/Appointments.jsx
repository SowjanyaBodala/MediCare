import { Link, useSearchParams } from "react-router-dom";
import { Activity, User, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../utils/api";

const Appointments = () => {
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get("doctorId") || "";

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    doctorId: initialDoctorId,
    date: "",
    time: "",
    reason: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await api.get("/doctors");
        if (res.data && res.data.success) {
          setDoctors(res.data.data);
          if (initialDoctorId && res.data.data.some(d => d._id === initialDoctorId)) {
            setFormData(prev => ({ ...prev, doctorId: initialDoctorId }));
          }
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [initialDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId) {
      toast.error("Please select a doctor");
      return;
    }

    try {
      setSubmitting(true);
      const scheduledDateTime = new Date(`${formData.date}T${formData.time || "09:00"}:00`);

      if (scheduledDateTime <= new Date()) {
        toast.error("Please select a date and time in the future.");
        setSubmitting(false);
        return;
      }

      const response = await api.post("/appointments", {
        doctorId: formData.doctorId,
        scheduledAt: scheduledDateTime.toISOString(),
        reason: formData.reason,
      });

      if (response.data && response.data.success) {
        toast.success("Appointment booked successfully!", {
          description: "Your request has been recorded in the database.",
        });
        setFormData({
          patientName: "",
          email: "",
          phone: "",
          doctorId: "",
          date: "",
          time: "",
          reason: "",
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg = err.response?.data?.message || "Failed to book appointment. Make sure you are logged in.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">MediCare+</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link>
            <Link to="/doctors" className="text-gray-700 hover:text-blue-500 transition">Doctors</Link>
            <Link to="/appointments" className="text-blue-500 font-semibold">Appointments</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500 transition">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="px-4 py-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all">Login</button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Book an <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Appointment</span>
            </h1>
            <p className="text-xl text-gray-600">Schedule your visit with our expert doctors</p>
          </div>

          {/* Appointment Card */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 animate-scale-in">
            <h2 className="text-2xl font-bold mb-6">Appointment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Grid Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4" /> Patient Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Select Doctor</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">{loadingDoctors ? "Loading doctors..." : "Choose a doctor"}</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar className="h-4 w-4" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Clock className="h-4 w-4" /> Preferred Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">Reason for Visit</label>
                <textarea
                  placeholder="Please describe your symptoms or reason for visit..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg py-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointments;
