import { Link, useNavigate } from "react-router-dom";
import { Activity, Upload, FileText, Image, Clipboard, User, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "sonner";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ["All", "Lab Reports", "Prescriptions", "Imaging", "Visit Summaries"];
  const [activeCategory, setActiveCategory] = useState("All");

  // Map backend type to frontend category
  const typeToCategory = {
    lab: "Lab Reports",
    prescription: "Prescriptions",
    imaging: "Imaging",
    note: "Visit Summaries",
    other: "Visit Summaries",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData.role === "admin") {
          toast.info("Redirected to Admin Dashboard");
          navigate("/admin");
          return;
        }
        if (!userData || !userData.token) {
          toast.error("Please login to access medical records.");
          navigate("/login");
          return;
        }
        setCurrentUser(userData);

        const response = await api.get("/records/mine");
        if (response.data.success) {
          // Map backend data to frontend format
          const mappedRecords = response.data.data.map((record) => {
            const doctorName = record.doctorId?.name || "Unknown Doctor";
            const fileType = record.files?.[0]?.mimetype || "application/pdf";
            const isImage = fileType.includes("image");
            
            return {
              id: record._id,
              title: record.title,
              category: typeToCategory[record.type] || "Visit Summaries",
              date: new Date(record.createdAt).toISOString().split("T")[0],
              doctor: doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`,
              type: isImage ? "image" : "pdf",
              description: record.description,
            };
          });
          setRecords(mappedRecords);
        }
      } catch (error) {
        console.error("Failed to fetch medical records:", error);
        toast.error("Failed to load medical records");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => activeCategory === "All" || record.category === activeCategory);

  const RecordCard = ({ record }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
            {record.type === "pdf" ? <FileText className="h-5 w-5 text-white" /> : <Image className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{record.title}</h3>
            <p className="text-sm text-gray-600">{record.category}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">{record.date}</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-gray-600">By {record.doctor}</p>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">
          View
        </button>
      </div>
    </div>
  );

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
                        to="/patient-dashboard"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <UserCircle className="h-5 w-5 text-gray-500" />
                        <span>Profile Dashboard</span>
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
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Medical <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Records</span>
              </h1>
              <p className="text-gray-600">Access and manage your health records</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
              <Upload className="h-4 w-4" /> Upload Record
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Records Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <Clipboard className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-500 text-lg">Loading records...</p>
              </div>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map(record => <RecordCard key={record.id} record={record} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <Clipboard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No {activeCategory.toLowerCase()} found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
