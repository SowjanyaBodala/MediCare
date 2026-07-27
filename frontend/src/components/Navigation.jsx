//import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-hospital.jpg";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Health,{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience world-class healthcare with our comprehensive hospital management system. 
              Book appointments, consult with top doctors, and manage your health records seamlessly.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/appointments">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90 transition-opacity shadow-medium">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline" className="shadow-soft">
                  View Our Doctors
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Expert Doctors</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-sm text-muted-foreground">Appointments</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-2xl rounded-3xl" />
            <img 
              src={heroImage}
              alt="Modern healthcare facility with medical professionals"
              className="relative rounded-2xl shadow-strong w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
