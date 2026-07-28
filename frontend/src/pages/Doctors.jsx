import { Link } from "react-router-dom";
import { Activity, Star, Calendar, MapPin, Award, Search, Clock, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/api";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileDropdown(false);
    window.location.reload();
  };

  const specialties = ["All", "Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic", "Neurologist"];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/doctors");
        if (res.data && res.data.success) {
          // Normalize doctor objects for UI rendering
          const normalized = res.data.data.map((doc) => ({
            id: doc._id,
            name: doc.name,
            specialty: doc.specialization,
            rating: doc.rating || 4.8,
            reviews: doc.reviews || 120,
            experience: doc.yearsOfExperience ? `${doc.yearsOfExperience} years` : "10+ years",
            image: doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
            location: doc.contact?.location || "Main Medical Center",
            available: doc.isActive !== false,
            nextAvailable: doc.nextAvailable || "Today, 4:00 PM",
          }));
          setDoctors(normalized);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              MediCare+
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link>
            <Link to="/doctors" className="text-blue-500 font-semibold">Doctors</Link>
            <Link to="/appointments" className="text-gray-700 hover:text-blue-500 transition">Appointments</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500 transition">About</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user.fullName}
                  </span>
                  <span className={`hidden sm:inline px-2 py-0.5 text-xs font-semibold rounded capitalize ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "doctor"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.role}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded capitalize ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "doctor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {user.role}
                        </span>
                      </div>

                      {/* Profile Link */}
                      {user.role === "admin" ? (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 transition font-semibold"
                        >
                          <Activity className="h-5 w-5 text-blue-500" />
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          to="/patient-dashboard"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                        >
                          <UserCircle className="h-5 w-5" />
                          <span>My Profile</span>
                        </Link>
                      )}

                      {/* Logout button */}
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
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-blue-500 hover:bg-blue-100 rounded-lg transition">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-12 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Meet Our <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Top Doctors</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Trusted professionals providing compassionate and expert care for every patient.
        </p>
      </section>

      {/* Search & Filter */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto bg-white rounded-2xl shadow-lg p-6 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-blue-500 focus:outline-none transition bg-gray-50"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-500 text-xl animate-pulse">
              Loading doctors from database...
            </div>
          ) : filteredDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    doctor.available
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {doctor.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-blue-500 font-semibold mb-3">{doctor.specialty}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(doctor.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-700 font-medium">
                    {doctor.rating} ({doctor.reviews})
                  </span>
                </div>

                {/* Info */}
                <div className="text-gray-600 space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" /> {doctor.experience} experience
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" /> {doctor.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" /> Next: {doctor.nextAvailable}
                  </div>
                </div>

                {/* Button */}
                <Link to={doctor.available ? `/appointments?doctorId=${doctor.id}` : "#"}>
                  <button
                    disabled={!doctor.available}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      doctor.available
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Calendar className="h-5 w-5" /> {doctor.available ? "Book Appointment" : "Not Available"}
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {!loading && filteredDoctors.length === 0 && (
            <p className="text-center text-2xl text-gray-600 py-20 animate-fade-in col-span-full">
              No doctors found matching your search.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-400 text-sm">
          © 2025 MediCare+. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Doctors;
