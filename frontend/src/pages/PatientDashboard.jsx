import { Link, useNavigate } from "react-router-dom";
import { Activity, Calendar, FileText, CreditCard, User, Clock, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "sonner";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get user info
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.role === "admin") {
          toast.info("Redirected to Admin Dashboard");
          navigate("/admin");
          return;
        }
        if (!userData || !userData.token) {
          toast.error("Please login to access the dashboard.");
          navigate("/login");
          return;
        }
        setCurrentUser(userData);
        setUserName(userData.fullName || "User");

        // Fetch appointments
        const appointmentsRes = await api.get("/appointments/mine?limit=5");
        if (appointmentsRes.data.success) {
          const now = new Date();
          const upcoming = appointmentsRes.data.data
            .filter(apt => new Date(apt.scheduledAt) >= now && apt.status !== "cancelled")
            .map(apt => ({
              id: apt._id,
              doctor: apt.doctorId?.name ? `Dr. ${apt.doctorId.name}` : "Unknown Doctor",
              specialty: apt.doctorId?.specialization || "General",
              date: new Date(apt.scheduledAt).toISOString().split("T")[0],
              time: new Date(apt.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
              status: apt.status === "approved" ? "Confirmed" : apt.status === "requested" ? "Pending" : apt.status,
            }));
          setUpcomingAppointments(upcoming);
        }

        // Fetch prescriptions from medical records
        const recordsRes = await api.get("/records/mine");
        if (recordsRes.data.success) {
          const presc = recordsRes.data.data
            .filter(rec => rec.type === "prescription")
            .map(rec => ({
              id: rec._id,
              medication: rec.title,
              dosage: rec.description || "As prescribed",
              prescribedBy: rec.doctorId?.name ? `Dr. ${rec.doctorId.name}` : "Unknown Doctor",
              date: new Date(rec.createdAt).toISOString().split("T")[0],
            }));
          setPrescriptions(presc);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              MediCare+
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {showProfileDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{currentUser.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">Patient</span>
                      </div>
                      <Link
                        to="/"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <UserCircle className="h-5 w-5 text-gray-500" />
                        <span>Home</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {userName || "User"}
              </span>
            </h1>
            <p className="text-gray-600">Here's your health dashboard</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link to="/appointments">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-scale-in">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                  <p className="text-sm text-gray-600">Schedule a visit</p>
                </div>
              </div>
            </Link>

            <Link to="/medical-records">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-scale-in">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Medical Records</h3>
                  <p className="text-sm text-gray-600">View your records</p>
                </div>
              </div>
            </Link>

            <Link to="/billing">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer animate-scale-in">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Billing</h3>
                  <p className="text-sm text-gray-600">View invoices</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 animate-slide-up">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" /> Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500 text-center py-4">Loading appointments...</p>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{appt.doctor}</h4>
                    <p className="text-sm text-gray-600">{appt.specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {appt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {appt.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      appt.status === "Confirmed"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              )}
            </div>
          </div>

          {/* Active Prescriptions */}
          <div className="bg-white shadow-xl rounded-2xl p-6 animate-slide-up">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <FileText className="h-5 w-5 text-blue-500" /> Active Prescriptions
            </h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500 text-center py-4">Loading prescriptions...</p>
              ) : prescriptions.length > 0 ? (
                prescriptions.map((presc) => (
                <div
                  key={presc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{presc.medication}</h4>
                    <p className="text-sm text-gray-600">Dosage: {presc.dosage}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Prescribed by {presc.prescribedBy} on {presc.date}
                    </p>
                  </div>
                  <button 
                    onClick={() => toast.success(`Refill requested for ${presc.medication}!`, {
                      description: `Your request has been sent to ${presc.prescribedBy} for approval.`,
                    })}
                    className="px-4 py-2 text-blue-500 border border-blue-500 rounded-xl hover:bg-blue-50 transition-all"
                  >
                    Refill
                  </button>
                </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No prescriptions found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
