# 🏥 MediCare+ - Complete Hospital Management & Authentication System

MediCare+ is a premium, modern web application designed for comprehensive hospital management, including role-based authentication, patient analytics, billing & invoice management, and secure medical records tracking.

## 🚀 Live Deployment Links

- **🌐 Live Frontend App:** [https://medicare-frontend-jrcr.onrender.com](https://medicare-frontend-jrcr.onrender.com)
- **⚙️ Live Backend API:** [https://medicare-backend-ee6n.onrender.com](https://medicare-backend-ee6n.onrender.com)

---

## 🔑 Demo Credentials

To test the role-based functionality, you can log in with the following seeded accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@medicare.local` | `Admin@123456` |
| **Patient** | `john@example.com` | `password123` |
| **Doctor** | `sarah.johnson@medicare.local` | `password123` |

---

## ✨ Features Implemented

### 🛡️ Authentication & Authorization
- Secure JWT-based login and registration.
- Fully-guarded React routes preventing unauthorized URL access.
- Auto-redirection to the appropriate dashboard (Admin panel vs Patient dashboard) on login.

### 💼 Admin Management Panel
- Analytics dashboard featuring live KPIs for users, doctors, appointments, and records.
- **Invoices & Billing Panel:**
  - View full itemized invoice details in a modern modal.
  - Mark unpaid patient invoices as paid directly from the dashboard.
  - Search invoices by Patient Name, Email, or Invoice ID (e.g. `INV-XXXXXX`).

### 🧑 Patient Portal
- Book and track medical appointments.
- Securely view prescriptions and upload laboratory or imaging records.
- Manage invoices and make payments online.

---

## 🛠️ Technology Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons, Axios, React Router, Sonner Toasts
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT authentication
- **Deployment:** Render (using Blueprint monorepo specifications)
