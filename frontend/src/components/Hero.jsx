import { Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-hospital.jpg"; // Ensure this image exists

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-cyan-100" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Health,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Experience world-class healthcare with our comprehensive hospital management system. 
              Book appointments, consult with top doctors, and manage your health records seamlessly.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/appointments">
                <button className="flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white shadow hover:opacity-90 transition">
                  <Calendar className="mr-2 h-5 w-5" /> Book Appointment
                </button>
              </Link>
              <Link to="/doctors">
                <button className="px-6 py-3 rounded-lg border border-gray-300 shadow hover:bg-gray-100 transition">
                  View Our Doctors
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-white shadow">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-gray-500">Expert Doctors</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white shadow">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-sm text-gray-500">Appointments</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white shadow">
                <Clock className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-gray-500">Support</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative z-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-green-500 opacity-20 blur-2xl rounded-3xl" />
            <img 
              src={heroImage}
              alt="Modern healthcare facility with medical professionals"
              className="relative rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
