import { Link, useNavigate } from "react-router-dom";
import { Activity, Users, Calendar, DollarSign, TrendingUp, User, Loader2, Search, X, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Invoices & Billing States
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [searchInvoiceTerm, setSearchInvoiceTerm] = useState("");
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  // Form states for creating invoice
  const [invoicePatientId, setInvoicePatientId] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([{ description: "", amount: "" }]);
  const [invoiceTax, setInvoiceTax] = useState("0");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // Advanced Invoice states & actions
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetailsModal, setShowInvoiceDetailsModal] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState(null);

  const handleMarkPaid = async (invoiceId) => {
    try {
      setMarkingPaidId(invoiceId);
      const res = await api.patch(`/billing/invoices/${invoiceId}/pay`);
      if (res.data && res.data.success) {
        toast.success("Invoice marked as Paid!");
        fetchInvoices();
        if (selectedInvoice && selectedInvoice._id === invoiceId) {
          setSelectedInvoice(prev => ({ ...prev, status: "paid", paidAt: new Date() }));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark invoice as paid");
    } finally {
      setMarkingPaidId(null);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const res = await api.get("/billing/invoices?limit=100");
      if (res.data && res.data.success) {
        setInvoices(res.data.data || []);
      }
    } catch (e) {
      toast.error("Failed to load invoices");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoicePatientId) {
      toast.error("Please select a patient");
      return;
    }
    try {
      setCreatingInvoice(true);
      const payload = {
        patientId: invoicePatientId,
        items: invoiceItems.map(item => ({
          description: item.description,
          amount: parseFloat(item.amount) || 0
        })),
        tax: parseFloat(invoiceTax) || 0,
        dueDate: invoiceDueDate || undefined,
        notes: invoiceNotes || undefined
      };
      const res = await api.post("/billing/invoices", payload);
      if (res.data && res.data.success) {
        toast.success("Invoice created successfully!");
        setShowCreateInvoiceModal(false);
        // Reset form
        setInvoicePatientId("");
        setInvoiceItems([{ description: "", amount: "" }]);
        setInvoiceTax("0");
        setInvoiceDueDate("");
        setInvoiceNotes("");
        // Reload invoices list
        fetchInvoices();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setCreatingInvoice(false);
    }
  };

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please login to access the admin dashboard.");
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      toast.error("Access denied. You are not authorized to view this page.");
      navigate("/");
      return;
    }
    setAdminUser(parsedUser);

    // Stats
    setLoading(true);
    api.get("/admin/stats").then(res => {
      setStats(res.data.data);
      setLoading(false);
    }).catch((e) => {
      setError("Failed to load statistics");
      toast.error("Failed to load statistics");
      setStats(null);
      setLoading(false);
    });
    // Users
    setLoadingUsers(true);
    api.get("/admin/users").then(res => {
      setUsers(res.data.data || []);
      setLoadingUsers(false);
    }).catch((e) => {
      setError("Failed to load users");
      toast.error("Failed to load users");
      setLoadingUsers(false);
    });
    // Appointments
    setLoadingAppointments(true);
    api.get("/appointments?page=1&limit=10").then(res => {
      setAppointments(res.data.data || []);
      setLoadingAppointments(false);
    }).catch((e) => {
      setError("Failed to load appointments");
      toast.error("Failed to load appointments");
      setLoadingAppointments(false);
    });
    // Invoices
    fetchInvoices();
  }, []);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      const res = await api.patch(`/appointments/${apptId}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Appointment marked as ${newStatus}`);
        setAppointments(prev => prev.map(appt => 
          appt._id === apptId ? { ...appt, status: newStatus } : appt
        ));
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // KPI definitions
  const kpiCards = stats
    ? [
        { title: "Total Users", value: stats.userCount, icon: Users, change: `+${stats.newUsersLast7d} this week`, changeColor: "text-green-600" },
        { title: "Appointments", value: stats.appointmentCount, icon: Calendar, change: `+${stats.newAppointmentsLast7d} new this week`, changeColor: "text-blue-600" },
        { title: "Doctors", value: stats.doctorCount, icon: User, change: "Licensed", changeColor: "text-green-600" },
        { title: "Medical Records", value: stats.recordCount, icon: DollarSign, change: "--", changeColor: "text-gray-600" },
      ]
    : [];

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
            {adminUser && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {adminUser.fullName.charAt(0).toUpperCase()}
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
                        <p className="text-sm font-medium text-gray-900">{adminUser.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{adminUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Admin</span>
                      </div>
                      <Link
                        to="/"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <UserCircle className="h-5 w-5 text-gray-500" />
                        <span>View Main Site</span>
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

      {/* Dashboard Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
          Admin <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-gray-600 mb-8">Hospital management and analytics</p>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-6 font-semibold text-sm border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview & Users
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`py-4 px-6 font-semibold text-sm border-b-2 transition-all ${
              activeTab === "billing"
                ? "border-blue-500 text-blue-600 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Invoices & Billing
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <div className="col-span-4 flex items-center justify-center h-32">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : (
            kpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition animate-scale-in">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                    <Icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className={`text-xs flex items-center gap-1 ${card.changeColor}`}>
                    {card.change.includes("%") && <TrendingUp className="h-3 w-3" />}
                    {card.change}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Users table */}
        <div className="bg-white shadow-xl rounded-xl p-6 animate-slide-up mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
          {loadingUsers ? (
            <p className="text-gray-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-left text-sm">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Phone</th>
                    <th className="py-2 px-4">Role</th>
                    <th className="py-2 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map(user => (
                    <tr key={user._id} className="border-b">
                      <td className="py-2 px-4">{user.fullName}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.phone}</td>
                      <td className="py-2 px-4 capitalize">{user.role}</td>
                      <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Appointments table */}
        <div className="bg-white shadow-xl rounded-xl p-6 animate-slide-up mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Appointments</h2>
          {loadingAppointments ? (
            <p className="text-gray-500">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-left text-sm">
                    <th className="py-2 px-4">Patient</th>
                    <th className="py-2 px-4">Doctor</th>
                    <th className="py-2 px-4">Specialization</th>
                    <th className="py-2 px-4">When</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt._id} className="border-b">
                      <td className="py-2 px-4">{appt.patientId?.fullName || 'Unknown'}</td>
                      <td className="py-2 px-4">{appt.doctorId?.name || 'Unknown'}</td>
                      <td className="py-2 px-4">{appt.doctorId?.specialization || 'N/A'}</td>
                      <td className="py-2 px-4">{new Date(appt.scheduledAt).toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          appt.status === "approved" ? "bg-green-100 text-green-800" :
                          appt.status === "cancelled" ? "bg-red-100 text-red-800" :
                          appt.status === "completed" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {appt.status === "requested" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, "approved")}
                              className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-semibold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appt.status === "approved" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, "completed")}
                              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, "cancelled")}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {(appt.status === "completed" || appt.status === "cancelled") && (
                          <span className="text-gray-400 text-xs">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
      )}

        {/* Billing Tab Content */}
        {activeTab === "billing" && (
          <div className="bg-white shadow-xl rounded-xl p-6 animate-slide-up mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hospital Invoices</h2>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    placeholder="Search invoices by patient or item..."
                    value={searchInvoiceTerm}
                    onChange={(e) => setSearchInvoiceTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <button
                  onClick={() => setShowCreateInvoiceModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm"
                >
                  Create Invoice
                </button>
              </div>
            </div>

            {loadingInvoices ? (
              <p className="text-gray-500 text-center py-8">Loading invoices...</p>
            ) : invoices.filter(inv => {
              const displayId = `INV-${inv._id.substring(18).toUpperCase()}`;
              const patientName = inv.patientId?.fullName?.toLowerCase() || "";
              const patientEmail = inv.patientId?.email?.toLowerCase() || "";
              const description = inv.items?.[0]?.description?.toLowerCase() || "";
              const term = searchInvoiceTerm.toLowerCase();
              return patientName.includes(term) || patientEmail.includes(term) || description.includes(term) || displayId.toLowerCase().includes(term);
            }).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-left text-sm font-semibold">
                      <th className="py-2 px-4">Invoice ID</th>
                      <th className="py-2 px-4">Patient</th>
                      <th className="py-2 px-4">Description</th>
                      <th className="py-2 px-4">Amount</th>
                      <th className="py-2 px-4">Created Date</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.filter(inv => {
                      const displayId = `INV-${inv._id.substring(18).toUpperCase()}`;
                      const patientName = inv.patientId?.fullName?.toLowerCase() || "";
                      const patientEmail = inv.patientId?.email?.toLowerCase() || "";
                      const description = inv.items?.[0]?.description?.toLowerCase() || "";
                      const term = searchInvoiceTerm.toLowerCase();
                      return patientName.includes(term) || patientEmail.includes(term) || description.includes(term) || displayId.toLowerCase().includes(term);
                    }).map(inv => (
                      <tr key={inv._id} className="border-b text-sm">
                        <td className="py-3 px-4 font-mono font-semibold">
                          {`INV-${inv._id.substring(18).toUpperCase()}`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{inv.patientId?.fullName || "Unknown"}</div>
                          <div className="text-xs text-gray-500">{inv.patientId?.email}</div>
                        </td>
                        <td className="py-3 px-4 truncate max-w-[200px]">
                          {inv.items?.[0]?.description || "Medical Service"}
                          {inv.items?.length > 1 && ` (+${inv.items.length - 1} more)`}
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">
                          ${inv.total}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            inv.status === "paid" ? "bg-green-100 text-green-800" :
                            inv.status === "refunded" ? "bg-gray-100 text-gray-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowInvoiceDetailsModal(true);
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                          >
                            View Details
                          </button>
                          {inv.status !== "paid" && (
                            <button
                              onClick={() => handleMarkPaid(inv._id)}
                              disabled={markingPaidId === inv._id}
                              className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              {markingPaidId === inv._id ? "Processing..." : "Mark Paid"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Invoice Modal */}
        {showCreateInvoiceModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Patient Invoice</h3>
                <button
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Select Patient
                  </label>
                  <select
                    value={invoicePatientId}
                    onChange={(e) => setInvoicePatientId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Patient --</option>
                    {users
                      .filter((u) => u.role === "patient")
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.fullName} ({u.email})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Invoice Items */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Billing Items (e.g. Room Charges, Discharge Fee)
                  </label>
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Description (e.g. Discharge Chargers)"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...invoiceItems];
                          updated[idx].description = e.target.value;
                          setInvoiceItems(updated);
                        }}
                        required
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Price ($)"
                        value={item.amount}
                        onChange={(e) => {
                          const updated = [...invoiceItems];
                          updated[idx].amount = e.target.value;
                          setInvoiceItems(updated);
                        }}
                        required
                        min="0"
                        className="w-24 px-3 py-2 border rounded-lg focus:outline-none text-sm"
                      />
                      {invoiceItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold p-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setInvoiceItems([...invoiceItems, { description: "", amount: "" }])
                    }
                    className="text-blue-500 hover:underline text-xs font-bold"
                  >
                    + Add Item
                  </button>
                </div>

                {/* Tax & Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tax Amount ($)
                    </label>
                    <input
                      type="number"
                      value={invoiceTax}
                      onChange={(e) => setInvoiceTax(e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoiceDueDate}
                      onChange={(e) => setInvoiceDueDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Invoice Notes
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Optional notes or payment instructions..."
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateInvoiceModal(false)}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingInvoice}
                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold text-sm hover:opacity-95 disabled:opacity-50"
                  >
                    {creatingInvoice ? "Creating..." : "Create Invoice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Details Modal */}
        {showInvoiceDetailsModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                  <p className="text-sm font-mono text-gray-500 mt-1">
                    {`INV-${selectedInvoice._id.substring(18).toUpperCase()}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowInvoiceDetailsModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient details */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Patient Information</h4>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{selectedInvoice.patientId?.fullName || "Unknown"}</p>
                    <p className="text-gray-600 mt-0.5">{selectedInvoice.patientId?.email || "No email provided"}</p>
                    <p className="text-gray-600 mt-0.5">{selectedInvoice.patientId?.phone || "No phone provided"}</p>
                  </div>
                </div>

                {/* Items details */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Billing Items</h4>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                        <tr>
                          <th className="py-2.5 px-4">Description</th>
                          <th className="py-2.5 px-4 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-gray-700">
                        {selectedInvoice.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-4 font-medium">{item.description}</td>
                            <td className="py-2.5 px-4 text-right">${item.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calculations */}
                <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${selectedInvoice.subtotal}</span>
                  </div>
                  {selectedInvoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax / Other Fees</span>
                      <span className="font-semibold text-gray-900">${selectedInvoice.tax}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2 mt-2">
                    <span>Total Amount</span>
                    <span>${selectedInvoice.total}</span>
                  </div>
                </div>

                {/* Invoice Status Info */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-gray-600">
                  <div>
                    <span className="block font-bold text-gray-500 uppercase tracking-wider mb-1">Due Date</span>
                    <span className="font-semibold text-gray-900">
                      {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-gray-500 uppercase tracking-wider mb-1">Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${
                      selectedInvoice.status === "paid" ? "bg-green-100 text-green-800" :
                      selectedInvoice.status === "refunded" ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                  {selectedInvoice.paidAt && (
                    <div className="col-span-2">
                      <span className="block font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Completed On</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(selectedInvoice.paidAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="border-t pt-4">
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice Notes</span>
                    <p className="text-sm bg-gray-50 rounded-xl p-3 text-gray-700 italic border">
                      "{selectedInvoice.notes}"
                    </p>
                  </div>
                )}

                {/* Actions inside modal */}
                <div className="flex gap-3 justify-end pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceDetailsModal(false)}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Close
                  </button>
                  {selectedInvoice.status !== "paid" && (
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(selectedInvoice._id)}
                      disabled={markingPaidId === selectedInvoice._id}
                      className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
                    >
                      {markingPaidId === selectedInvoice._id ? "Processing..." : "Mark Paid"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
