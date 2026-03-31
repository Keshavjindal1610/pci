# ✈️ TravelDesk — Travel Business Management Platform

A modern, mobile-first SaaS application for Indian travel agents to manage trips, leads, groups, and payments — replacing Excel + WhatsApp chaos.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# 1. Clone / download the project
cd travel-platform

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open http://localhost:3000

### Demo Login
- Email: `demo@travel.in`
- Password: `demo123`
- Or click **"Try Demo Account"** on the login screen

---

## 📁 Project Structure

```
travel-platform/
├── src/
│   ├── App.jsx          # Main application (all components)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles (Tailwind)
├── index.html           # HTML entry point (Google Fonts loaded here)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🌐 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — it auto-detects Vite + React
# Your app will be live at https://your-app.vercel.app
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 🚂 Deploy to Railway

1. Push code to GitHub
2. Create new project on https://railway.app
3. Connect GitHub repo
4. Add environment variable: `NODE_ENV=production`
5. Railway auto-builds and deploys

## 🎨 Deploy to Render

1. Push to GitHub
2. New Static Site on https://render.com
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## ✨ Features

| Module | Features |
|--------|----------|
| 🔐 Auth | Email/password signup & login, demo account |
| 📊 Dashboard | Stats overview, recent leads, trip fill rates |
| 🗺️ Trips | Create/manage trips, image gallery, shareable public page |
| 🌐 Public Trip Page | Beautiful landing page with lead capture form |
| 👥 Leads (CRM) | Add/search/filter leads, status tracking, WhatsApp integration |
| 👨‍👩‍👧 Groups | Batch management, seat tracking, auto-FULL detection |
| 💰 Payments | Manual payment recording, UPI/cash/bank, status: Paid/Partial/Pending |
| 📋 Itinerary | Day-wise builder, export as text, public page integration |
| 💬 WhatsApp | Pre-filled message links on every lead and trip page |
| 📱 Mobile-First | Fully responsive, optimized sidebar for all screen sizes |

---

## 🏗️ Architecture

**Frontend-only SaaS** (current):
- React 18 + Vite
- Tailwind CSS (DM Sans + Fraunces fonts)
- LocalStorage for data persistence
- lucide-react for icons

**Scaling to Full-Stack** (next step):
```
Frontend → Vercel (React + Next.js)
Backend  → Railway or Render (Node.js + Express)
Database → Supabase (PostgreSQL) or MongoDB Atlas
Auth     → Supabase Auth or Firebase Auth
Storage  → Cloudinary (trip images)
Payments → Razorpay (Indian payment gateway)
SMS/OTP  → MSG91 or Twilio
```

---

## 🔌 Backend API (Coming Soon / Extend Yourself)

```js
// Suggested REST endpoints:
POST   /api/auth/register
POST   /api/auth/login
GET    /api/trips
POST   /api/trips
GET    /api/trips/:id
POST   /api/leads
GET    /api/leads
PATCH  /api/leads/:id
GET    /api/groups
POST   /api/groups
PATCH  /api/groups/:id/assign
GET    /api/payments
POST   /api/payments
```

---

## 📱 WhatsApp Integration

The app generates WhatsApp deep links automatically:
```
https://wa.me/91XXXXXXXXXX?text=Hi, I'm interested in Manali Trip...
```
- On every Lead card (agent-to-lead message)
- On every Public Trip Page (traveller-to-agent inquiry)

For automation: Integrate **WhatsApp Business API** via Interakt, AiSensy, or WATI.

---

## 💡 Roadmap

- [ ] Supabase backend integration
- [ ] Razorpay payment links
- [ ] WhatsApp Business API (auto-messages on new lead)
- [ ] Email notifications (Resend/SendGrid)
- [ ] PDF itinerary export (React-PDF)
- [ ] Multi-user / team roles
- [ ] Analytics dashboard (revenue charts)
- [ ] Dark mode
- [ ] PWA / installable app

---

## 🇮🇳 Built for Indian Travel Agents

- Indian Rupee (₹) formatting throughout
- WhatsApp-first communication flow
- Works on low-end devices (mobile-first, lightweight)
- Replaces: Excel sheets + WhatsApp + paper bookings

---

## 📄 License

MIT — Free to use, modify, and deploy for your travel business.
