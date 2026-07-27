import { Calendar, Users, FileText, Activity, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Appointment Booking",
    description: "Schedule appointments with your preferred doctors in just a few clicks. Real-time availability updates.",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Expert Medical Team",
    description: "Access a network of highly qualified doctors across multiple specializations and departments.",
    color: "text-green-500",
  },
  {
    icon: FileText,
    title: "Digital Health Records",
    description: "Secure, centralized storage of medical history, prescriptions, and reports accessible anytime.",
    color: "text-cyan-500",
  },
  {
    icon: Activity,
    title: "Health Monitoring",
    description: "Track vital signs, medications, and health metrics with our comprehensive monitoring tools.",
    color: "text-blue-500",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Care",
    description: "Round-the-clock emergency services and immediate medical assistance when you need it most.",
    color: "text-green-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "HIPAA-compliant security ensuring your medical data is protected with enterprise-grade encryption.",
    color: "text-cyan-500",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              MediCare+
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare management designed for modern healthcare delivery
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-md text-center hover:shadow-lg transition"
              >
                <Icon className={`h-12 w-12 mb-4 mx-auto ${feature.color}`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
