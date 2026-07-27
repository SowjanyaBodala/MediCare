import { Link, useNavigate } from "react-router-dom";
import { Activity, DollarSign, Clock, CheckCircle, Download, User, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "sonner";

const Billing = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/billing/invoices/mine");
      if (res.data && res.data.success) {
        const mapped = res.data.data.map((inv) => {
          let formattedStatus = "Pending";
          if (inv.status === "paid") formattedStatus = "Paid";
          else if (inv.dueDate && new Date(inv.dueDate) < new Date()) formattedStatus = "Overdue";
          else formattedStatus = "Pending";

          return {
            id: inv._id,
            displayId: `INV-${inv._id.substring(18).toUpperCase()}`,
            date: new Date(inv.createdAt).toISOString().split("T")[0],
            description: inv.items?.[0]?.description || "Medical Service",
            amount: inv.total || 0,
            status: formattedStatus,
            doctor: inv.appointmentId?.doctorId?.name ? `Dr. ${inv.appointmentId.doctorId.name}` : "MediCare Care Center",
          };
        });
        setInvoices(mapped);
      }
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.role === "admin") {
      toast.info("Redirected to Admin Dashboard");
      navigate("/admin");
      return;
    }
    if (!userData || !userData.token) {
      toast.error("Please login to access billing.");
      navigate("/login");
      return;
    }
    setCurrentUser(userData);
    fetchInvoices();
  }, []);

  const handlePay = async (invoiceId) => {
    try {
      const res = await api.patch(`/billing/invoices/${invoiceId}/pay`);
      if (res.data && res.data.success) {
        toast.success("Payment successful!");
        fetchInvoices();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process payment");
    }
  };

  const totalPaid = invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === "Pending").reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === "Overdue").reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusBadge = (status) => {
    const variants = { Paid: "bg-green-500 text-white", Pending: "bg-yellow-100 text-yellow-800", Overdue: "bg-red-100 text-red-800" };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${variants[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
  };

  const getStatusIcon = (status) => {
    return status === "Paid" ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-600" />;
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

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
          Billing & <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Payments</span>
        </h1>
        <p className="text-gray-600 mb-8">Manage your medical bills and payment history</p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalPaid}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalPending}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalOverdue}</p>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white shadow-xl rounded-3xl p-6 animate-slide-up space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg animate-pulse">
              Loading invoices from database...
            </div>
          ) : invoices.length > 0 ? (
            invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-[280px]">
                  {getStatusIcon(inv.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{inv.description}</h4>
                      {getStatusBadge(inv.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{inv.date}</span>•<span>{inv.doctor}</span>•<span>Invoice: {inv.displayId}</span>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-2xl font-bold text-gray-900">${inv.amount}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {inv.status !== "Paid" && (
                    <button
                      onClick={() => handlePay(inv.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    onClick={() => toast.info(`Downloading invoice ${inv.displayId}...`)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No invoices found in your account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
