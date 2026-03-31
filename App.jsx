import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Map, Users, CreditCard, FileText, Plus, Search,
  Menu, X, TrendingUp, Phone, Mail, MessageCircle, Edit, Trash2,
  Eye, Share2, LogOut, ArrowLeft, Check, Clock, User, Calendar,
  MapPin, ChevronDown, BarChart2, Settings, Bell, Star, Download,
  Briefcase, Filter, Tag, Globe, Zap, AlertTriangle, ChevronRight,
  Image, Link, Copy, CheckCircle, IndianRupee, UsersRound, Plane,
  Home, RefreshCw, MoreVertical, Upload, PlusCircle, Layers
} from "lucide-react";

// ─── UTILS ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const storage = { get: (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const SEED = {
  trips: [
    { id: "t1", title: "Manali Group Trip – May 2026", destination: "Manali, Himachal Pradesh", price: 12500, startDate: "2026-05-15", endDate: "2026-05-21", maxSeats: 30, description: "Experience the breathtaking beauty of Manali with our curated 7-day group adventure. Snow-capped mountains, adventure sports, and bonfire nights await!", images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"], status: "active", itinerary: [{ day: 1, title: "Delhi → Manali", activities: ["Overnight volvo bus from Delhi", "Scenic highway drive through Kullu valley"] }, { day: 2, title: "Arrival & Rohtang Permit", activities: ["Check-in at hotel", "Local sightseeing – Hadimba Temple, Mall Road", "Bonfire & group dinner"] }, { day: 3, title: "Rohtang Pass / Sissu", activities: ["Early morning departure for Rohtang", "Snow activities – snowball fight, sledging", "Return by evening"] }, { day: 4, title: "Solang Valley", activities: ["Zorbing, paragliding, ATVs", "Free time for shopping on Mall Road"] }, { day: 5, title: "Kasol Day Trip", activities: ["Parvati Valley drive", "Riverside lunch", "Kheerganga trek option"] }, { day: 6, title: "Leisure & Departure", activities: ["Late checkout", "Shopping for souvenirs", "Evening bus back to Delhi"] }, { day: 7, title: "Back in Delhi", activities: ["Morning arrival in Delhi", "Trip ends with memories for life!"] }], createdAt: new Date().toISOString() },
    { id: "t2", title: "Kerala Backwaters – June 2026", destination: "Alleppey, Kerala", price: 18000, startDate: "2026-06-10", endDate: "2026-06-15", maxSeats: 20, description: "Drift through the tranquil backwaters of God's Own Country on a luxury houseboat.", images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"], status: "active", itinerary: [{ day: 1, title: "Arrival in Kochi", activities: ["Airport pickup", "Fort Kochi sightseeing", "Kathakali show"] }, { day: 2, title: "Munnar Hill Station", activities: ["Tea garden visit", "Eravikulam National Park", "Spice market shopping"] }, { day: 3, title: "Houseboat Check-in", activities: ["Drive to Alleppey", "Houseboat check-in", "Backwater cruise at sunset"] }, { day: 4, title: "Backwaters & Villages", activities: ["Village life experience", "Fishing with locals", "Coir making demonstration"] }, { day: 5, title: "Kovalam Beach", activities: ["Drive to Kovalam", "Lighthouse Beach leisure", "Ayurvedic massage"] }, { day: 6, title: "Departure", activities: ["Thiruvananthapuram airport drop", "Journey back home"] }], createdAt: new Date().toISOString() },
  ],
  leads: [
    { id: "l1", name: "Priya Sharma", phone: "9876543210", email: "priya@gmail.com", tripId: "t1", travelType: "duo", status: "new", notes: "Wants window seat in bus", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "l2", name: "Rahul Verma", phone: "9812345678", email: "rahul.v@outlook.com", tripId: "t1", travelType: "solo", status: "contacted", notes: "Called – interested, needs EMI option", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: "l3", name: "Anjali & Rohit Mehta", phone: "9988776655", email: "anjali.m@gmail.com", tripId: "t1", travelType: "honeymoon", status: "converted", notes: "Paid advance ₹5000", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    { id: "l4", name: "Sunita Patel", phone: "9123456789", email: "sunita.p@yahoo.com", tripId: "t2", travelType: "group", status: "new", notes: "Group of 6 friends", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "l5", name: "Dev Kumar", phone: "9654321098", email: "dev.k@gmail.com", tripId: "t2", travelType: "solo", status: "contacted", notes: "Budget-conscious, looking for discount", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  groups: [
    { id: "g1", tripId: "t1", name: "Manali Batch A – May 15", totalSeats: 15, leadIds: ["l3"], createdAt: new Date().toISOString() },
    { id: "g2", tripId: "t1", name: "Manali Batch B – May 15", totalSeats: 15, leadIds: [], createdAt: new Date().toISOString() },
  ],
  payments: [
    { id: "p1", leadId: "l3", tripId: "t1", totalAmount: 25000, paidAmount: 5000, method: "UPI", status: "partial", date: new Date(Date.now() - 86400000 * 8).toISOString(), note: "Advance payment" },
  ],
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    new: "bg-blue-50 text-blue-700 border border-blue-200",
    contacted: "bg-amber-50 text-amber-700 border border-amber-200",
    converted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    full: "bg-red-50 text-red-600 border border-red-200",
    paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    partial: "bg-amber-50 text-amber-700 border border-amber-200",
    pending: "bg-red-50 text-red-600 border border-red-200",
    solo: "bg-purple-50 text-purple-700 border border-purple-200",
    duo: "bg-pink-50 text-pink-700 border border-pink-200",
    group: "bg-blue-50 text-blue-700 border border-blue-200",
    honeymoon: "bg-rose-50 text-rose-700 border border-rose-200",
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>{children}</span>;
}

function StatCard({ icon: Icon, label, value, sub, color = "emerald" }) {
  const colors = {
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-500",
    blue: "from-blue-500 to-indigo-600",
    rose: "from-rose-500 to-pink-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-slate-800 font-display">{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-emerald-600 mt-1 font-medium">{sub}</div>}
    </div>
  );
}

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 font-display">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm placeholder:text-slate-400 transition-all" {...props} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm placeholder:text-slate-400 transition-all resize-none" rows={3} {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-700 bg-white transition-all" {...props}>{children}</select>
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-sm hover:shadow-emerald-200 hover:shadow-lg",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    ghost: "text-slate-600 hover:bg-slate-100",
    amber: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20b558] shadow-sm",
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>{children}</button>;
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-4 max-w-xs">{desc}</p>
      {action}
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", business: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (mode === "login") {
      const saved = storage.get("travelapp_user");
      if (saved && saved.email === form.email && saved.password === form.password) {
        onAuth(saved); storage.set("travelapp_auth", saved);
      } else setError("Invalid credentials. Try demo@travel.in / demo123");
    } else {
      const user = { id: uid(), name: form.name, email: form.email, password: form.password, business: form.business || "My Travel Co.", avatar: form.name[0]?.toUpperCase() };
      storage.set("travelapp_user", user); storage.set("travelapp_auth", user); onAuth(user);
    }
    setLoading(false);
  };

  const demo = () => {
    const demoUser = { id: "demo", name: "Amit Travels", email: "demo@travel.in", password: "demo123", business: "Amit Adventures", avatar: "A" };
    storage.set("travelapp_user", demoUser); storage.set("travelapp_auth", demoUser); onAuth(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-10" style={{ width: `${80 + i * 40}px`, height: `${80 + i * 40}px`, background: "radial-gradient(circle, #34d399, transparent)", left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 25}%`, animation: `float ${3 + i}s ease-in-out infinite alternate` }} />
        ))}
      </div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 mb-4">
            <Plane size={18} className="text-emerald-400" />
            <span className="text-white font-bold text-sm tracking-wide">TravelDesk</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-display">Your Travel Business,<br /><span className="text-emerald-400">Organized.</span></h1>
          <p className="text-slate-400 mt-2 text-sm">Manage trips, leads & bookings — all in one place</p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
          <form onSubmit={handle} className="space-y-4">
            {mode === "signup" && <><Input label="Your Name" placeholder="Amit Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /><Input label="Business Name" placeholder="Amit Adventures" value={form.business} onChange={e => setForm({ ...form, business: e.target.value })} /></>}
            <Input label="Email" type="email" placeholder="amit@travel.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
            <Btn type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
              {loading ? <><RefreshCw size={16} className="animate-spin" /> Processing...</> : mode === "login" ? "Sign In" : "Create Account"}
            </Btn>
          </form>
          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or</span></div></div>
          <Btn variant="outline" size="lg" className="w-full justify-center" onClick={demo}>
            <Zap size={16} className="text-amber-500" /> Try Demo Account
          </Btn>
        </div>
      </div>
      <style>{`@keyframes float { to { transform: translateY(-20px) scale(1.1); } }`}</style>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "trips", label: "Trips", icon: Map },
  { id: "leads", label: "Leads", icon: Users },
  { id: "groups", label: "Groups", icon: UsersRound },
  { id: "payments", label: "Payments", icon: IndianRupee },
  { id: "itinerary", label: "Itinerary", icon: FileText },
];

function Sidebar({ page, setPage, user, onLogout, open, setOpen }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <Plane size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">TravelDesk</div>
              <div className="text-slate-400 text-xs truncate max-w-[130px]">{user.business}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setPage(id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${page === id ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}>
              <Icon size={17} />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">{user.avatar}</div>
            <div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-200 truncate">{user.name}</div><div className="text-xs text-slate-500 truncate">{user.email}</div></div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"><LogOut size={16} />Sign Out</button>
        </div>
      </aside>
    </>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ title, sub, actions, onMenu, notifCount }) {
  return (
    <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center gap-4">
      <button onClick={onMenu} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"><Menu size={20} /></button>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-slate-800 font-display truncate">{title}</h2>
        {sub && <p className="text-xs text-slate-400 hidden sm:block">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <div className="relative">
          <button className="p-2 hover:bg-slate-100 rounded-xl relative"><Bell size={18} className="text-slate-500" />
            {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ data, setPage, user }) {
  const { trips, leads, groups, payments } = data;
  const totalRevenue = payments.reduce((s, p) => s + p.paidAmount, 0);
  const activeTrips = trips.filter(t => t.status === "active").length;
  const totalLeads = leads.length;
  const filledSeats = groups.reduce((s, g) => s + g.leadIds.length, 0);
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Leads" value={totalLeads} sub={`+${leads.filter(l => l.status === "new").length} new`} color="blue" />
        <StatCard icon={Map} label="Active Trips" value={activeTrips} color="emerald" />
        <StatCard icon={UsersRound} label="Seats Filled" value={filledSeats} sub="across all trips" color="amber" />
        <StatCard icon={IndianRupee} label="Revenue" value={fmt(totalRevenue)} color="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Leads</h3>
            <Btn variant="ghost" size="sm" onClick={() => setPage("leads")}><ChevronRight size={14} />View All</Btn>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads.length === 0 ? (
              <EmptyState icon={Users} title="No leads yet" desc="Share your trip page to capture leads." />
            ) : recentLeads.map(lead => {
              const trip = trips.find(t => t.id === lead.tripId);
              return (
                <div key={lead.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{lead.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{lead.name}</div>
                    <div className="text-xs text-slate-400 truncate">{trip?.title}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant={lead.status}>{lead.status}</Badge>
                    <Badge variant={lead.travelType}>{lead.travelType}</Badge>
                  </div>
                  <a href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, this is ${user.business}. We noticed your interest in ${trip?.title || "our trip"}. Are you still interested? Let us know!`)}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-green-50 rounded-xl text-green-500 transition-colors shrink-0"><MessageCircle size={16} /></a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Active Trips</h3>
            <div className="space-y-3">
              {trips.filter(t => t.status === "active").slice(0, 3).map(trip => {
                const tripGroups = groups.filter(g => g.tripId === trip.id);
                const totalSeats = tripGroups.reduce((s, g) => s + g.totalSeats, 0);
                const filledSeats = tripGroups.reduce((s, g) => s + g.leadIds.length, 0);
                const pct = totalSeats > 0 ? (filledSeats / totalSeats) * 100 : 0;
                return (
                  <div key={trip.id} className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div><div className="text-sm font-medium text-slate-700 leading-snug">{trip.title}</div><div className="text-xs text-slate-400">{fmtDate(trip.startDate)}</div></div>
                      <div className="text-xs text-slate-500 shrink-0">{filledSeats}/{totalSeats}</div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
              {trips.filter(t => t.status === "active").length === 0 && <p className="text-sm text-slate-400 text-center py-4">No active trips</p>}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
            <Zap size={20} className="mb-3 opacity-80" />
            <div className="text-sm font-semibold mb-1">Quick Actions</div>
            <div className="space-y-2 mt-3">
              <button onClick={() => setPage("trips")} className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 transition-colors">+ Create New Trip</button>
              <button onClick={() => setPage("leads")} className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 transition-colors">View All Leads</button>
              <button onClick={() => setPage("payments")} className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 transition-colors">Track Payments</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRIPS PAGE ───────────────────────────────────────────────────────────────
function TripsPage({ data, setData, user, setPublicTrip }) {
  const { trips, groups, leads } = data;
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", destination: "", price: "", startDate: "", endDate: "", maxSeats: "", description: "", images: [] });
  const [imgUrl, setImgUrl] = useState("");

  const createTrip = () => {
    const t = { id: uid(), ...form, price: +form.price, maxSeats: +form.maxSeats, status: "active", itinerary: [], createdAt: new Date().toISOString() };
    setData(d => ({ ...d, trips: [t, ...d.trips] }));
    setShowCreate(false); setForm({ title: "", destination: "", price: "", startDate: "", endDate: "", maxSeats: "", description: "", images: [] });
  };

  const addImg = () => { if (imgUrl) { setForm(f => ({ ...f, images: [...f.images, imgUrl] })); setImgUrl(""); } };

  return (
    <div className="p-4 md:p-8">
      <Header title="Trips" sub="Create and manage your group trips" actions={<Btn variant="primary" onClick={() => setShowCreate(true)}><Plus size={16} />New Trip</Btn>} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {trips.map(trip => {
          const tripGroups = groups.filter(g => g.tripId === trip.id);
          const filledSeats = tripGroups.reduce((s, g) => s + g.leadIds.length, 0);
          const totalSeats = tripGroups.reduce((s, g) => s + g.totalSeats, 0);
          const tripLeads = leads.filter(l => l.tripId === trip.id).length;
          return (
            <div key={trip.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-teal-50 overflow-hidden">
                {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><MapPin size={32} className="text-emerald-200" /></div>}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant={trip.status}>{trip.status}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1">{trip.title}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3"><MapPin size={11} />{trip.destination}</div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={11} />{fmtDate(trip.startDate)}</span>
                  <span className="font-semibold text-emerald-600">{fmt(trip.price)}/person</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span>{tripLeads} leads</span><span>•</span><span>{filledSeats}/{totalSeats > 0 ? totalSeats : trip.maxSeats} seats</span>
                </div>
                <div className="flex gap-2">
                  <Btn variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setPublicTrip(trip)}>
                    <Globe size={13} />Public Page
                  </Btn>
                  <Btn variant="secondary" size="sm" onClick={() => { const url = `${window.location.href}#trip/${trip.id}`; navigator.clipboard?.writeText(url); alert("Link copied!"); }}>
                    <Copy size={13} />
                  </Btn>
                </div>
              </div>
            </div>
          );
        })}
        {trips.length === 0 && <div className="col-span-3"><EmptyState icon={Map} title="No trips yet" desc="Create your first trip and share it with travellers." action={<Btn variant="primary" onClick={() => setShowCreate(true)}><Plus size={14} />Create Trip</Btn>} /></div>}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Trip" wide>
        <div className="space-y-4">
          <Input label="Trip Title" placeholder="Manali Group Trip – May 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input label="Destination" placeholder="Manali, Himachal Pradesh" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
          <Textarea label="Description" placeholder="Tell travellers what makes this trip special..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹ per person)" type="number" placeholder="12500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <Input label="Max Group Size" type="number" placeholder="30" value={form.maxSeats} onChange={e => setForm({ ...form, maxSeats: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Trip Images</label>
            <div className="flex gap-2"><input className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Paste image URL..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} /><Btn variant="secondary" size="md" onClick={addImg}>Add</Btn></div>
            {form.images.length > 0 && <div className="flex gap-2 mt-2 flex-wrap">{form.images.map((img, i) => <img key={i} src={img} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />)}</div>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="outline" onClick={() => setShowCreate(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={createTrip} disabled={!form.title || !form.destination || !form.price}>Create Trip</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── PUBLIC TRIP PAGE ─────────────────────────────────────────────────────────
function PublicTripPage({ trip, onBack, onLeadSubmit, user }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", travelType: "solo" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLeadSubmit({ ...form, tripId: trip.id });
    setSubmitted(true);
  };

  const waLink = `https://wa.me/${user?.phone || ""}?text=${encodeURIComponent(`Hi! I'm interested in joining the ${trip.title}. Please share more details.`)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"><ArrowLeft size={16} />Back to Dashboard</button>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Link copied!"); }}><Copy size={13} />Copy Link</Btn>
          <a href={waLink} target="_blank" rel="noreferrer"><Btn variant="whatsapp" size="sm"><MessageCircle size={13} />WhatsApp</Btn></a>
        </div>
      </div>

      <div className="relative h-64 md:h-96 bg-gradient-to-br from-emerald-600 to-teal-700 overflow-hidden">
        {trip.images?.[0] ? <img src={trip.images[0]} alt={trip.title} className="w-full h-full object-cover opacity-70" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <Badge variant="active">🟢 Open for Booking</Badge>
            <h1 className="text-2xl md:text-4xl font-bold text-white mt-2 font-display">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin size={14} />{trip.destination}</span>
              <span className="flex items-center gap-1"><Calendar size={14} />{fmtDate(trip.startDate)} – {fmtDate(trip.endDate)}</span>
              <span className="flex items-center gap-1"><UsersRound size={14} />Max {trip.maxSeats} people</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 font-display">About This Trip</h2>
            <p className="text-slate-600 leading-relaxed">{trip.description}</p>
          </div>

          {trip.itinerary?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 font-display">Day-wise Itinerary</h2>
              <div className="space-y-4">
                {trip.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">D{day.day}</div>
                      {i < trip.itinerary.length - 1 && <div className="w-0.5 h-full bg-emerald-100 my-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-semibold text-slate-800 text-sm mb-2">{day.title}</div>
                      <ul className="space-y-1">{day.activities.map((a, j) => <li key={j} className="text-sm text-slate-500 flex items-start gap-2"><Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />{a}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-3xl font-bold text-slate-800 font-display">{fmt(trip.price)}<span className="text-base font-normal text-slate-400"> /person</span></div>
              <div className="text-sm text-slate-500 mt-1 mb-4">{fmtDate(trip.startDate)} – {fmtDate(trip.endDate)}</div>
              <a href="#join"><Btn variant="primary" size="lg" className="w-full justify-center">Reserve My Spot →</Btn></a>
              <a href={waLink} target="_blank" rel="noreferrer"><Btn variant="whatsapp" size="md" className="w-full justify-center mt-2"><MessageCircle size={15} />Chat on WhatsApp</Btn></a>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />Instant confirmation</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />EMI options available</div>
                <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" />Expert trip coordinator</div>
              </div>
            </div>

            {!submitted ? (
              <div id="join" className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-semibold text-slate-800 mb-4">🎒 Join This Trip</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <Input placeholder="WhatsApp Number *" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                  <Input placeholder="Email Address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <Select value={form.travelType} onChange={e => setForm({ ...form, travelType: e.target.value })}>
                    <option value="solo">Solo Traveller</option>
                    <option value="duo">Duo / Couple</option>
                    <option value="group">Group</option>
                    <option value="honeymoon">Honeymoon</option>
                  </Select>
                  <Btn type="submit" variant="primary" size="md" className="w-full justify-center" disabled={!form.name || !form.phone}>Submit Interest</Btn>
                </form>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
                <div className="font-semibold text-emerald-800">You're on the list!</div>
                <div className="text-sm text-emerald-600 mt-1">We'll contact you on WhatsApp shortly.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LEADS PAGE ───────────────────────────────────────────────────────────────
function LeadsPage({ data, setData, user }) {
  const { leads, trips } = data;
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTrip, setFilterTrip] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", tripId: trips[0]?.id || "", travelType: "solo", status: "new", notes: "" });

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    const matchTrip = filterTrip === "all" || l.tripId === filterTrip;
    return matchSearch && matchStatus && matchTrip;
  });

  const updateStatus = (id, status) => setData(d => ({ ...d, leads: d.leads.map(l => l.id === id ? { ...l, status } : l) }));
  const deleteLead = (id) => { setData(d => ({ ...d, leads: d.leads.filter(l => l.id !== id) })); setSelected(null); };
  const addLead = () => {
    setData(d => ({ ...d, leads: [{ id: uid(), ...form, createdAt: new Date().toISOString() }, ...d.leads] }));
    setShowAdd(false); setForm({ name: "", phone: "", email: "", tripId: trips[0]?.id || "", travelType: "solo", status: "new", notes: "" });
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : "flex"}`}>
        <div className="p-4 md:p-6 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 font-display">Leads <span className="text-slate-400 font-normal text-base">({filtered.length})</span></h2>
            <Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}><Plus size={14} />Add Lead</Btn>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <select className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option><option value="new">New</option><option value="contacted">Contacted</option><option value="converted">Converted</option>
            </select>
            <select className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none" value={filterTrip} onChange={e => setFilterTrip(e.target.value)}>
              <option value="all">All Trips</option>{trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filtered.length === 0 ? <EmptyState icon={Users} title="No leads found" desc="Try adjusting your filters or add a new lead." action={<Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}><Plus size={14} />Add Lead</Btn>} /> :
            filtered.map(lead => {
              const trip = trips.find(t => t.id === lead.tripId);
              const waMsg = encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, this is ${user.business}! We noticed your interest in ${trip?.title}. Are you still interested? Reply to confirm your booking 🚀`);
              return (
                <div key={lead.id} onClick={() => setSelected(lead)} className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selected?.id === lead.id ? "bg-emerald-50 border-l-2 border-emerald-500" : ""}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{lead.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{lead.name}</div>
                    <div className="text-xs text-slate-400 truncate">{trip?.title || "No trip"}</div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <Badge variant={lead.status}>{lead.status}</Badge>
                    <span className="text-xs text-slate-400">{fmtDate(lead.createdAt)}</span>
                  </div>
                  <a href={`https://wa.me/${lead.phone}?text=${waMsg}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-2 hover:bg-green-50 rounded-xl text-green-500 shrink-0"><MessageCircle size={15} /></a>
                </div>
              );
            })}
        </div>
      </div>

      {selected && (
        <div className="w-full lg:w-96 border-l border-slate-100 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-slate-100 rounded-xl" onClick={() => setSelected(null)}><ArrowLeft size={16} /></button>
            <h3 className="font-semibold text-slate-800 flex-1">Lead Profile</h3>
            <button onClick={() => deleteLead(selected.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-xl"><Trash2 size={15} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">{selected.name[0]}</div>
              <div className="font-semibold text-slate-800 text-lg">{selected.name}</div>
              <Badge variant={selected.travelType}>{selected.travelType}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-slate-600"><Phone size={14} className="text-slate-400" />{selected.phone}</div>
              <div className="flex items-center gap-3 text-slate-600"><Mail size={14} className="text-slate-400" />{selected.email || "No email"}</div>
              <div className="flex items-center gap-3 text-slate-600"><Map size={14} className="text-slate-400" />{trips.find(t => t.id === selected.tripId)?.title || "No trip"}</div>
              <div className="flex items-center gap-3 text-slate-600"><Calendar size={14} className="text-slate-400" />{fmtDate(selected.createdAt)}</div>
            </div>
            {selected.notes && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">{selected.notes}</div>}
            <div>
              <div className="text-xs font-medium text-slate-500 mb-2">STATUS</div>
              <div className="flex gap-2">
                {["new", "contacted", "converted"].map(s => (
                  <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }} className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${selected.status === s ? "bg-emerald-500 text-white border-emerald-500" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{s}</button>
                ))}
              </div>
            </div>
            <a href={`https://wa.me/${selected.phone}?text=${encodeURIComponent(`Hi ${selected.name.split(" ")[0]}, this is ${user.business}! We noticed your interest in our trip. Are you still interested? Reply to confirm! 🚀`)}`} target="_blank" rel="noreferrer">
              <Btn variant="whatsapp" className="w-full justify-center"><MessageCircle size={15} />Send WhatsApp</Btn>
            </a>
          </div>
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Lead">
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="WhatsApp Number" type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Select label="Trip" value={form.tripId} onChange={e => setForm({ ...form, tripId: e.target.value })}>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </Select>
          <Select label="Travel Type" value={form.travelType} onChange={e => setForm({ ...form, travelType: e.target.value })}>
            <option value="solo">Solo</option><option value="duo">Duo / Couple</option><option value="group">Group</option><option value="honeymoon">Honeymoon</option>
          </Select>
          <Textarea label="Notes" placeholder="Any additional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3"><Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn><Btn variant="primary" onClick={addLead} disabled={!form.name || !form.phone}>Add Lead</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── GROUPS PAGE ──────────────────────────────────────────────────────────────
function GroupsPage({ data, setData }) {
  const { groups, trips, leads } = data;
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", tripId: trips[0]?.id || "", totalSeats: "" });
  const [addingToGroup, setAddingToGroup] = useState(null);
  const [selectedLead, setSelectedLead] = useState("");

  const createGroup = () => {
    setData(d => ({ ...d, groups: [...d.groups, { id: uid(), ...form, totalSeats: +form.totalSeats, leadIds: [], createdAt: new Date().toISOString() }] }));
    setShowCreate(false); setForm({ name: "", tripId: trips[0]?.id || "", totalSeats: "" });
  };

  const assignLead = (groupId) => {
    if (!selectedLead) return;
    setData(d => ({ ...d, groups: d.groups.map(g => g.id === groupId && !g.leadIds.includes(selectedLead) ? { ...g, leadIds: [...g.leadIds, selectedLead] } : g) }));
    setAddingToGroup(null); setSelectedLead("");
  };

  const removeFromGroup = (groupId, leadId) => setData(d => ({ ...d, groups: d.groups.map(g => g.id === groupId ? { ...g, leadIds: g.leadIds.filter(id => id !== leadId) } : g) }));

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-slate-800 font-display">Groups</h2><p className="text-sm text-slate-400">Organize leads into trip batches</p></div>
        <Btn variant="primary" onClick={() => setShowCreate(true)}><Plus size={16} />New Group</Btn>
      </div>

      <div className="space-y-4">
        {groups.map(group => {
          const trip = trips.find(t => t.id === group.tripId);
          const filled = group.leadIds.length;
          const pct = (filled / group.totalSeats) * 100;
          const isFull = filled >= group.totalSeats;
          const groupLeads = leads.filter(l => group.leadIds.includes(l.id));
          const availableLeads = leads.filter(l => l.tripId === group.tripId && !group.leadIds.includes(l.id));

          return (
            <div key={group.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{group.name}</h3>
                      {isFull && <Badge variant="full">FULL</Badge>}
                    </div>
                    <div className="text-xs text-slate-400">{trip?.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 font-display">{filled}<span className="text-slate-300 font-normal">/{group.totalSeats}</span></div>
                    <div className="text-xs text-slate-400">seats filled</div>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: isFull ? "#ef4444" : "linear-gradient(to right, #10b981, #14b8a6)" }} />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {groupLeads.map(lead => (
                    <div key={lead.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 text-xs">
                      <span className="font-medium text-slate-700">{lead.name}</span>
                      <button onClick={() => removeFromGroup(group.id, lead.id)} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                    </div>
                  ))}
                  {groupLeads.length === 0 && <span className="text-xs text-slate-400">No travellers assigned yet</span>}
                </div>
                {!isFull && (
                  addingToGroup === group.id ? (
                    <div className="flex gap-2">
                      <select className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" value={selectedLead} onChange={e => setSelectedLead(e.target.value)}>
                        <option value="">Select lead to add...</option>
                        {availableLeads.map(l => <option key={l.id} value={l.id}>{l.name} – {l.travelType}</option>)}
                      </select>
                      <Btn variant="primary" size="sm" onClick={() => assignLead(group.id)}>Add</Btn>
                      <Btn variant="ghost" size="sm" onClick={() => setAddingToGroup(null)}>Cancel</Btn>
                    </div>
                  ) : (
                    <Btn variant="outline" size="sm" onClick={() => setAddingToGroup(group.id)}><PlusCircle size={13} />Add Traveller</Btn>
                  )
                )}
              </div>
            </div>
          );
        })}
        {groups.length === 0 && <EmptyState icon={UsersRound} title="No groups yet" desc="Create a batch/group to organize your leads for each trip." action={<Btn variant="primary" onClick={() => setShowCreate(true)}><Plus size={14} />Create Group</Btn>} />}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Trip Group">
        <div className="space-y-4">
          <Input label="Group Name" placeholder="Manali Batch A – May 15" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Select label="Trip" value={form.tripId} onChange={e => setForm({ ...form, tripId: e.target.value })}>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </Select>
          <Input label="Total Seats in This Batch" type="number" placeholder="15" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })} />
          <div className="flex justify-end gap-3"><Btn variant="outline" onClick={() => setShowCreate(false)}>Cancel</Btn><Btn variant="primary" onClick={createGroup} disabled={!form.name || !form.totalSeats}>Create Group</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
function PaymentsPage({ data, setData }) {
  const { payments, leads, trips } = data;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ leadId: leads[0]?.id || "", tripId: "", totalAmount: "", paidAmount: "", method: "UPI", note: "" });

  const totalCollected = payments.reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = payments.reduce((s, p) => s + (p.totalAmount - p.paidAmount), 0);

  const addPayment = () => {
    const total = +form.totalAmount, paid = +form.paidAmount;
    const status = paid >= total ? "paid" : paid > 0 ? "partial" : "pending";
    const lead = leads.find(l => l.id === form.leadId);
    setData(d => ({ ...d, payments: [{ id: uid(), ...form, totalAmount: total, paidAmount: paid, status, tripId: lead?.tripId || "", date: new Date().toISOString() }, ...d.payments] }));
    setShowAdd(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-slate-800 font-display">Payments</h2><p className="text-sm text-slate-400">Track advance and full payments</p></div>
        <Btn variant="primary" onClick={() => setShowAdd(true)}><Plus size={16} />Record Payment</Btn>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={IndianRupee} label="Total Collected" value={fmt(totalCollected)} color="emerald" />
        <StatCard icon={Clock} label="Pending Amount" value={fmt(totalPending)} color="amber" />
        <StatCard icon={CheckCircle} label="Transactions" value={payments.length} color="blue" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">All Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{["Traveller", "Trip", "Total", "Paid", "Pending", "Method", "Status", "Date"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map(p => {
                const lead = leads.find(l => l.id === p.leadId);
                const trip = trips.find(t => t.id === (p.tripId || lead?.tripId));
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><div className="text-sm font-medium text-slate-800">{lead?.name || "Unknown"}</div><div className="text-xs text-slate-400">{lead?.phone}</div></td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-32 truncate">{trip?.title || "-"}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{fmt(p.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-600">{fmt(p.paidAmount)}</td>
                    <td className="px-4 py-3 text-sm text-red-500">{fmt(p.totalAmount - p.paidAmount)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.method}</td>
                    <td className="px-4 py-3"><Badge variant={p.status}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{fmtDate(p.date)}</td>
                  </tr>
                );
              })}
              {payments.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">No payments recorded yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Record Payment">
        <div className="space-y-4">
          <Select label="Traveller / Lead" value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}>
            {leads.map(l => <option key={l.id} value={l.id}>{l.name} – {l.phone}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Trip Amount (₹)" type="number" placeholder="25000" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} />
            <Input label="Amount Paid (₹)" type="number" placeholder="5000" value={form.paidAmount} onChange={e => setForm({ ...form, paidAmount: e.target.value })} />
          </div>
          <Select label="Payment Method" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
            <option value="UPI">UPI (GPay / PhonePe)</option><option value="Cash">Cash</option><option value="Bank Transfer">Bank Transfer</option><option value="Card">Debit / Credit Card</option><option value="Cheque">Cheque</option>
          </Select>
          <Textarea label="Note (optional)" placeholder="Advance payment for Manali trip..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <div className="flex justify-end gap-3"><Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn><Btn variant="primary" onClick={addPayment} disabled={!form.totalAmount || !form.paidAmount}>Save Payment</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── ITINERARY BUILDER ────────────────────────────────────────────────────────
function ItineraryPage({ data, setData }) {
  const { trips } = data;
  const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || "");
  const [newDay, setNewDay] = useState({ title: "", activities: "" });
  const [showAdd, setShowAdd] = useState(false);

  const trip = trips.find(t => t.id === selectedTrip);

  const addDay = () => {
    const day = { day: (trip?.itinerary?.length || 0) + 1, title: newDay.title, activities: newDay.activities.split("\n").filter(Boolean) };
    setData(d => ({ ...d, trips: d.trips.map(t => t.id === selectedTrip ? { ...t, itinerary: [...(t.itinerary || []), day] } : t) }));
    setNewDay({ title: "", activities: "" }); setShowAdd(false);
  };

  const removeDay = (dayNum) => setData(d => ({ ...d, trips: d.trips.map(t => t.id === selectedTrip ? { ...t, itinerary: t.itinerary.filter(d => d.day !== dayNum).map((d, i) => ({ ...d, day: i + 1 })) } : t) }));

  const exportPDF = () => {
    const content = trip.itinerary.map(d => `Day ${d.day}: ${d.title}\n${d.activities.map(a => `  • ${a}`).join("\n")}`).join("\n\n");
    const blob = new Blob([`${trip.title}\n\nITINERARY\n\n${content}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${trip.title}-itinerary.txt`; a.click();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div><h2 className="text-lg font-bold text-slate-800 font-display">Itinerary Builder</h2><p className="text-sm text-slate-400">Build day-wise trip itineraries</p></div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none" value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          {trip?.itinerary?.length > 0 && <Btn variant="secondary" size="sm" onClick={exportPDF}><Download size={13} />Export</Btn>}
          <Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}><Plus size={14} />Add Day</Btn>
        </div>
      </div>

      {!trip ? <EmptyState icon={FileText} title="No trips found" desc="Create a trip first to build its itinerary." /> : (
        <div className="space-y-4">
          {trip.itinerary?.length === 0 && <EmptyState icon={FileText} title="No itinerary yet" desc="Start adding days to build your trip itinerary." action={<Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}><Plus size={13} />Add Day 1</Btn>} />}
          {trip.itinerary?.map((day, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">D{day.day}</div>
                  <div><div className="font-semibold text-slate-800">{day.title}</div><div className="text-xs text-slate-400">{day.activities.length} activities</div></div>
                </div>
                <button onClick={() => removeDay(day.day)} className="p-2 hover:bg-red-50 text-red-400 rounded-xl"><Trash2 size={14} /></button>
              </div>
              <ul className="space-y-2 ml-13">
                {day.activities.map((a, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5"><Check size={10} className="text-emerald-600" /></div>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add Day ${(trip?.itinerary?.length || 0) + 1}`}>
        <div className="space-y-4">
          <Input label="Day Title" placeholder="Arrival & Rohtang Pass" value={newDay.title} onChange={e => setNewDay({ ...newDay, title: e.target.value })} />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Activities <span className="text-slate-400 font-normal">(one per line)</span></label>
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none" rows={6} placeholder={"Check-in at hotel\nHadimba Temple visit\nMall Road shopping\nBonfire & dinner"} value={newDay.activities} onChange={e => setNewDay({ ...newDay, activities: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3"><Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn><Btn variant="primary" onClick={addDay} disabled={!newDay.title}>Add Day</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => storage.get("travelapp_auth"));
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publicTrip, setPublicTrip] = useState(null);
  const [data, setDataRaw] = useState(() => {
    const saved = storage.get("travelapp_data");
    return saved || SEED;
  });

  const setData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      storage.set("travelapp_data", next);
      return next;
    });
  }, []);

  const handleLeadSubmit = (formData) => {
    const newLead = { id: uid(), ...formData, status: "new", createdAt: new Date().toISOString() };
    setData(d => ({ ...d, leads: [newLead, ...d.leads] }));
  };

  if (!user) return <AuthScreen onAuth={setUser} />;

  if (publicTrip) return <PublicTripPage trip={publicTrip} onBack={() => setPublicTrip(null)} onLeadSubmit={handleLeadSubmit} user={user} />;

  const notifCount = data.leads.filter(l => l.status === "new").length;

  const PAGE_PROPS = { data, setData, user, setPage };
  const pages = {
    dashboard: <Dashboard {...PAGE_PROPS} />,
    trips: <TripsPage {...PAGE_PROPS} setPublicTrip={setPublicTrip} />,
    leads: <LeadsPage {...PAGE_PROPS} />,
    groups: <GroupsPage {...PAGE_PROPS} />,
    payments: <PaymentsPage {...PAGE_PROPS} />,
    itinerary: <ItineraryPage {...PAGE_PROPS} />,
  };

  const pageTitles = { dashboard: ["Dashboard", `Welcome back, ${user.name?.split(" ")[0] || "there"} 👋`], trips: ["Trips", "Manage your group trips"], leads: ["Leads", "CRM – track and convert"], groups: ["Groups", "Batch management"], payments: ["Payments", "Track collections"], itinerary: ["Itinerary", "Day-wise planning"] };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={() => { localStorage.removeItem("travelapp_auth"); setUser(null); }} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header title={pageTitles[page]?.[0]} sub={pageTitles[page]?.[1]} onMenu={() => setSidebarOpen(true)} notifCount={notifCount} />
        <main className="flex-1 overflow-y-auto">{pages[page]}</main>
      </div>
    </div>
  );
}
