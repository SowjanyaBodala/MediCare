import { Link } from "react-router-dom";
import {
  Activity,
  Users,
  Award,
  Heart,
  Shield,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

const About = () => {
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

  const stats = [
    { icon: Users, label: "Expert Doctors", value: "500+" },
    { icon: Heart, label: "Happy Patients", value: "50,000+" },
    { icon: Award, label: "Awards Won", value: "100+" },
    { icon: TrendingUp, label: "Success Rate", value: "98%" },
  ];

  const features = [
    "State-of-the-art medical facilities",
    "Highly qualified and experienced doctors",
    "24/7 emergency services",
    "Advanced diagnostic equipment",
    "Personalized patient care",
    "Affordable healthcare packages",
    "Comprehensive health records",
    "Telemedicine consultations",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* 🌐 Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              MediCare+
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition">
              Home
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-blue-500 transition">
              Doctors
            </Link>
            <Link to="/appointments" className="text-gray-700 hover:text-blue-500 transition">
              Appointments
            </Link>
            <Link to="/about" className="text-blue-500 font-semibold">
              About
            </Link>
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

      {/* 🏥 Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          About{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            MediCare+
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          We are committed to redefining healthcare through compassion,
          innovation, and excellence. Your health is our mission, and we’re
          dedicated to providing world-class medical care you can trust.
        </p>
      </section>

      {/* 📊 Stats Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ❤️ Mission & Vision */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid md:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="bg-white shadow-xl rounded-2xl p-10 hover:shadow-2xl transition">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl w-fit mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To deliver accessible, high-quality healthcare services with
              compassion and innovation. We aim to enhance the wellbeing of
              every individual through dedicated care, modern technology, and a
              holistic approach to health.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white shadow-xl rounded-2xl p-10 hover:shadow-2xl transition">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl w-fit mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To be a global leader in healthcare innovation, recognized for
              patient-centered excellence, advanced research, and a commitment
              to building healthier communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* 🌟 Why Choose Us */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose MediCare+
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Because we believe in healthcare that’s personal, professional, and
            progressive.
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💙 CTA Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Healthcare Family
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Become part of a trusted network that puts your health and
              happiness first — every step of the way.
            </p>
            <Link to="/register">
              <button className="px-10 py-4 bg-white text-blue-500 rounded-lg text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
