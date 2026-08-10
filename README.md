# Serene Salon — Customer Reminder & Revenue WebApp

A clean, mobile-first, 3-page salon management web application designed for salon owners to streamline customer record keeping, monthly repeat visit reminders, and real-time revenue analytics.

---

## 🌟 Key Features & 3-Page Navigation

The application strictly adheres to a **3-Page Information Architecture**:

1. **Dashboard (Daily Command Center)**
   - **Today's Alerts**: Shows customers due for their 30-day monthly visit today (`nextReminderDate === today`).
   - **One-Click Reminders**: Directly launch WhatsApp Web or SMS with pre-filled monthly reminder messages.
   - **Quick Stats**: Real-time counter for **Today's Visits** and total **Today's Revenue (₹)**.
   - **Quick Actions**: Rapid entry modals for **+ Add Visit** and **+ Add Client**.

2. **Clients (Customer Database)**
   - **Instant Search**: Search clients by name or 10-digit phone number.
   - **Unique Phone Index**: Phone numbers are normalized and unique. Adding an existing phone number automatically opens and updates the existing client instead of creating duplicates.
   - **Client Profile Drawer/Modal**: Shows last visit date, next monthly reminder date, total visits, total spent, notes, and full chronological visit history.

3. **Reports (Business Insights)**
   - **Insight Cards**: Monthly Revenue (₹), New Clients count, Total Visits, Average Bill amount.
   - **Interactive Recharts**: Visual revenue breakdown with **Weekly** (Mon–Sun) and **Monthly** toggle views. Tooltips show exact dates and daily revenue.
   - **Payment Summary**: Real-time breakdown of **Cash Total** vs **Online UPI Total** with percentage progress bars.

---

## 📐 Technology Stack

- **Frontend**: React.js (Vite) + Tailwind CSS (v4) + Recharts + Lucide Icons + Google Fonts (Manrope).
- **Backend**: Node.js + Express.js REST API + JWT Authentication + Bcrypt.js.
- **Database**: MongoDB Atlas (via Mongoose) with automatic local in-memory fallback store when running without an external MongoDB string.

---

## 📁 Project File Structure

```text
the_salon_app/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow (Node 20/22)
├── client/                        # Frontend (Vite + React + Tailwind CSS v4)
│   ├── public/                    # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── clients/           # ClientList, ClientCard, ClientProfileModal, ClientForm, VisitForm
│   │   │   ├── common/            # Button, Input, Modal, EmptyState, LoadingState
│   │   │   ├── dashboard/         # QuickStats, QuickActions, AlertList
│   │   │   ├── layout/            # AppShell, TopBar, BottomNav
│   │   │   └── reports/           # InsightCards, RevenueChart, PaymentSummary
│   │   ├── pages/
│   │   │   ├── Clients.jsx        # Customer database & search page
│   │   │   ├── Dashboard.jsx      # Daily command center & alerts page
│   │   │   └── Reports.jsx        # Revenue analytics & charts page
│   │   ├── services/
│   │   │   └── api.js             # Fetch API service wrapper for REST endpoints
│   │   ├── utils/
│   │   │   ├── currency.js        # Indian Rupee (₹) formatting helper
│   │   │   ├── date.js            # Display date & ISO string helpers
│   │   │   └── phone.js           # Phone normalization & WhatsApp link generator
│   │   ├── App.jsx                # Main application component & state manager
│   │   ├── index.css              # Tailwind v4 configuration & Google Fonts
│   │   └── main.jsx               # React DOM entry point
│   ├── index.html                 # App HTML entry document
│   ├── package.json               # Client dependencies & scripts
│   └── vite.config.js             # Vite configuration & Rollup code-splitting
├── server/                        # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── __tests__/             # Business rules & reminder logic unit tests
│   │   ├── config/                # Database connection & in-memory fallback store
│   │   ├── controllers/           # Auth, Client, Dashboard, Report, Service controllers
│   │   ├── middleware/            # JWT authentication & error handling middleware
│   │   ├── models/                # User, Customer, Visit, Service Mongoose models
│   │   ├── routes/                # Express API routes
│   │   ├── services/              # Customer, Reminder, Revenue business services
│   │   ├── utils/                 # Server date calculations & phone normalization
│   │   ├── app.js                 # Express application setup & middleware configuration
│   │   └── server.js              # HTTP server entry point
│   ├── .env.example               # Backend environment variables template
│   └── package.json               # Server dependencies & scripts
├── documentation/                 # Original project PRD & specifications
├── .editorconfig                  # Code style configuration
├── .gitignore                     # Git ignored files & directories
├── LICENSE                        # MIT License
├── package.json                   # Root scripts for running client & server concurrently
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher (required for Vite 8 / Tailwind v4)
- **npm**: v9.0.0 or higher

### Installation

Clone the repository and install all dependencies:

```bash
# Install root, client, and server dependencies
npm run install:all
```

### Running Locally in Development Mode

You can launch both the **Express REST Server** and **Vite React Frontend** concurrently with a single command:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend Express API**: `http://localhost:5000`

---

## ⚙️ Environment Variables

### Server (`server/.env`)

Create a `server/.env` file based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/salon_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_salon_key_2026
NODE_ENV=development
```

> **Note**: If `MONGODB_URI` is omitted, the backend automatically operates using an in-memory seed store so you can test all features immediately without setting up a remote database first.

---

## 📊 Business Logic Rules

1. **Phone Normalization & Uniqueness**:
   - Phone numbers are stripped of non-digit characters and country prefixes (e.g. `+91 98765 43210` -> `9876543210`).
   - Phone numbers are enforced unique at database and application levels.
2. **Monthly Reminder Calculation**:
   - `nextReminderDate` = exact same calendar day in the following month after completed visit.
   - Month-end overflows (e.g. Jan 31 -> Feb 28) clamp to the last valid day of the target month.
   - An early visit recorded before the reminder date supersedes the old reminder anchor and sets a new `nextReminderDate`.
3. **Revenue Aggregation**:
   - Today's, weekly, and monthly totals are derived dynamically from `Visit` records (`SUM(amount)`).
   - Cash and Online totals are calculated per period directly from recorded payment modes.

---

## 📡 REST API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Salon owner authentication |
| `GET` | `/api/auth/me` | Fetch logged in owner details |
| `GET` | `/api/dashboard` | Returns today's alerts & summary metrics |
| `GET` | `/api/clients` | Search & list clients (`?query=...`) |
| `POST` | `/api/clients` | Create new client or return existing by phone |
| `GET` | `/api/clients/:id` | Client profile + chronological visit history |
| `PUT` | `/api/clients/:id` | Update client details |
| `POST` | `/api/clients/:id/visits` | Record visit & recalculate next reminder |
| `GET` | `/api/reports/revenue` | Aggregate revenue & charts (`?period=weekly\|monthly`) |
| `GET` | `/api/services` | List active salon service catalog |
| `POST` | `/api/services` | Add new service to catalog |

---

## 🧪 Testing & Production Build

### Unit Tests

Run business logic tests for reminder calculations, phone normalization, and revenue aggregation:

```bash
node server/src/__tests__/business.test.js
```

### Production Build

```bash
cd client
npm run build
```

---

## 🚢 Deployment Instructions

- **Frontend**: Deploy `client/` to **Vercel** or **Netlify**. Set build command to `npm run build` and output directory to `dist`.
- **Backend**: Deploy `server/` to **Render** or **Railway**. Supply `MONGODB_URI` and `JWT_SECRET` in service environment settings.

---

## 📄 License

MIT License — Serene Salon & Studio.
