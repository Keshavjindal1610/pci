// TravelDesk artifact version - uses React state (no localStorage)
// For production: swap to the App.jsx from the download which uses localStorage

import { useState, useCallback } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const SEED_TRIPS = [
  { id: "t1", title: "Manali Group Trip – May 2026", destination: "Manali, Himachal Pradesh", price: 12500, startDate: "2026-05-15", endDate: "2026-05-21", maxSeats: 30, description: "Experience the breathtaking beauty of Manali with our curated 7-day group adventure. Snow-capped mountains, adventure sports, and bonfire nights await!", images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"], status: "active", itinerary: [{ day: 1, title: "Delhi → Manali (Overnight Bus)", activities: ["Board Volvo AC bus from Kashmere Gate ISBT", "Scenic overnight journey through hills"] }, { day: 2, title: "Arrival + Local Sightseeing", activities: ["Hotel check-in & breakfast", "Hadimba Devi Temple", "Manu Temple & Old Manali", "Mall Road evening stroll"] }, { day: 3, title: "Rohtang Pass / Sissu", activities: ["Early departure for Rohtang (permit based)", "Snow activities – snowball fights, sledging", "Sissu Lake & waterfall visit"] }, { day: 4, title: "Solang Valley Adventure", activities: ["Zorbing & snowtubing", "Paragliding (optional)", "ATV rides & cable car"] }, { day: 5, title: "Kasol Day Trip", activities: ["Drive through Parvati Valley", "Riverside lunch at Kasol", "Kheerganga trek option for adventurous folks"] }, { day: 6, title: "Leisure Day", activities: ["Morning at leisure", "Mall Road shopping for souvenirs", "Evening departure by bus"] }, { day: 7, title: "Back in Delhi", activities: ["Morning arrival at Delhi", "Trip ends – memories for life!"] }], createdAt: new Date().toISOString() },
  { id: "t2", title: "Kerala Backwaters – June 2026", destination: "Alleppey, Kerala", price: 18000, startDate: "2026-06-10", endDate: "2026-06-15", maxSeats: 20, description: "Drift through the tranquil backwaters of God's Own Country on a luxury houseboat. Spice gardens, temples, and beaches await.", images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"], status: "active", itinerary: [{ day: 1, title: "Arrival in Kochi", activities: ["Airport pickup", "Fort Kochi sightseeing", "Chinese fishing nets & Kathakali show"] }, { day: 2, title: "Munnar Hill Station", activities: ["Tea garden & factory visit", "Eravikulam National Park", "Mattupetty Dam"] }, { day: 3, title: "Houseboat Check-in", activities: ["Drive to Alleppey", "Houseboat check-in at noon", "Backwater sunset cruise"] }, { day: 4, title: "Backwaters & Villages", activities: ["Village life experience", "Coir making demo", "Traditional Kerala lunch on boat"] }, { day: 5, title: "Kovalam Beach", activities: ["Drive to Kovalam", "Lighthouse Beach leisure", "Ayurvedic massage"] }, { day: 6, title: "Departure", activities: ["TVM airport drop", "Flights back home"] }], createdAt: new Date().toISOString() },
  { id: "t3", title: "Rajasthan Royal Tour – Oct 2026", destination: "Jaipur – Jodhpur – Jaisalmer", price: 22000, startDate: "2026-10-01", endDate: "2026-10-08", maxSeats: 25, description: "Royal palaces, golden deserts, and vibrant culture. A 7-night journey through the Land of Kings.", images: ["https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=800"], status: "active", itinerary: [{ day: 1, title: "Arrival Jaipur", activities: ["Pink City welcome", "Hawa Mahal & City Palace"] }, { day: 2, title: "Amber Fort & Jaipur", activities: ["Elephant ride to Amber Fort", "Jantar Mantar", "Bazaar shopping"] }, { day: 3, title: "Jaipur → Jodhpur", activities: ["Drive to Blue City", "Mehrangarh Fort", "Jaswant Thada"] }, { day: 4, title: "Jodhpur → Jaisalmer", activities: ["Drive through desert landscape", "Jaisalmer Fort arrival"] }, { day: 5, title: "Golden City", activities: ["Patwon Ki Haveli", "Sam Sand Dunes", "Camel Safari & cultural show"] }, { day: 6, title: "Desert Camp Night", activities: ["Overnight desert camp", "Stargazing", "Folk music & bonfire"] }, { day: 7, title: "Departure", activities: ["Drive to Jaisalmer airport", "Flights back home"] }], createdAt: new Date().toISOString() },
];

const SEED_LEADS = [
  { id: "l1", name: "Priya Sharma", phone: "9876543210", email: "priya@gmail.com", tripId: "t1", travelType: "duo", status: "new", notes: "Wants window seat in volvo bus. Very interested!", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "l2", name: "Rahul Verma", phone: "9812345678", email: "rahul.v@outlook.com", tripId: "t1", travelType: "solo", status: "contacted", notes: "Called on 28 Mar – interested, checking with office for leave.", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "l3", name: "Anjali & Rohit Mehta", phone: "9988776655", email: "anjali.m@gmail.com", tripId: "t1", travelType: "honeymoon", status: "converted", notes: "Paid advance ₹5000 via GPay. Honeymoon package requested.", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "l4", name: "Sunita Patel", phone: "9123456789", email: "sunita.p@yahoo.com", tripId: "t2", travelType: "group", status: "new", notes: "Group of 6 friends planning Kerala trip. Very excited!", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "l5", name: "Dev Kumar", phone: "9654321098", email: "dev.k@gmail.com", tripId: "t3", travelType: "solo", status: "contacted", notes: "Budget traveller. Looking for best price.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "l6", name: "Meera Joshi", phone: "9871234567", email: "meera.j@gmail.com", tripId: "t2", travelType: "duo", status: "converted", notes: "Booked for Kerala. Paid full amount.", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const SEED_GROUPS = [
  { id: "g1", tripId: "t1", name: "Manali Batch A – May 15", totalSeats: 15, leadIds: ["l3"], createdAt: new Date().toISOString() },
  { id: "g2", tripId: "t1", name: "Manali Batch B – May 15", totalSeats: 15, leadIds: [], createdAt: new Date().toISOString() },
  { id: "g3", tripId: "t2", name: "Kerala Houseboat Group", totalSeats: 20, leadIds: ["l4", "l6"], createdAt: new Date().toISOString() },
];

const SEED_PAYMENTS = [
  { id: "p1", leadId: "l3", tripId: "t1", totalAmount: 25000, paidAmount: 5000, method: "UPI", status: "partial", date: new Date(Date.now() - 86400000 * 8).toISOString(), note: "Advance – honeymoon package" },
  { id: "p2", leadId: "l6", tripId: "t2", totalAmount: 36000, paidAmount: 36000, method: "Bank Transfer", status: "paid", date: new Date(Date.now() - 86400000 * 10).toISOString(), note: "Full payment for couple" },
];

// ── TINY UI PRIMITIVES ──────────────────────────────────────────────────────
function Badge({ children, v = "default" }) {
  const map = { default: "#e2e8f0:#475569", new: "#dbeafe:#1d4ed8", contacted: "#fef3c7:#b45309", converted: "#dcfce7:#15803d", active: "#dcfce7:#15803d", full: "#fee2e2:#dc2626", paid: "#dcfce7:#15803d", partial: "#fef3c7:#b45309", pending: "#fee2e2:#dc2626", solo: "#ede9fe:#6d28d9", duo: "#fce7f3:#be185d", group: "#dbeafe:#1d4ed8", honeymoon: "#ffe4e6:#e11d48" };
  const [bg, color] = (map[v] || map.default).split(":");
  return <span style={{ background: bg, color, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const styles = {
    primary: { background: "linear-gradient(135deg,#059669,#0d9488)", color: "#fff", border: "none", boxShadow: "0 2px 8px rgba(5,150,105,.3)" },
    secondary: { background: "#f1f5f9", color: "#334155", border: "none" },
    outline: { background: "transparent", color: "#334155", border: "1px solid #e2e8f0" },
    danger: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
    whatsapp: { background: "#25D366", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#64748b", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1, transition: "all .15s", ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,.05)", padding: 20, ...style }}>{children}</div>;
}

function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{label}</label>}
      <input style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", width: "100%", boxSizing: "border-box" }} {...props} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{label}</label>}
      <textarea style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", outline: "none", width: "100%", boxSizing: "border-box", resize: "none" }} rows={3} {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{label}</label>}
      <select style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", background: "#fff", outline: "none", width: "100%" }} {...props}>{children}</select>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,.2)", width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{title}</span>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, color: "#64748b" }}>✕</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
      </div>
    </div>
  );
}

function Avatar({ name, size = 36, color = "#059669" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.36, flexShrink: 0 }}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}

function ProgressBar({ pct, color = "#059669" }) {
  return (
    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? "#ef4444" : `linear-gradient(to right, ${color}, ${color}cc)`, borderRadius: 99, transition: "width .5s ease" }} />
    </div>
  );
}

// ── AUTH ────────────────────────────────────────────────────────────────────
function Auth({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", business: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (tab === "login" && !(form.email && form.password)) { setError("Please enter email and password."); setLoading(false); return; }
    const user = { id: uid(), name: form.name || form.email.split("@")[0], email: form.email, business: form.business || "My Travel Co.", avatar: (form.name || form.email)[0].toUpperCase() };
    onAuth(user); setLoading(false);
  };

  const demo = () => onAuth({ id: "demo", name: "Amit Sharma", email: "demo@travel.in", business: "Amit Adventures", avatar: "A" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 12, padding: "8px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>✈️</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>TravelDesk</span>
          </div>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 800, lineHeight: 1.3 }}>Your Travel Business,<br /><span style={{ color: "#34d399" }}>Organized.</span></div>
          <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 8 }}>Manage trips, leads & bookings — all in one place</div>
        </div>
        <div style={{ background: "rgba(255,255,255,.97)", borderRadius: 24, padding: 28, boxShadow: "0 24px 64px rgba(0,0,0,.3)" }}>
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {["login", "signup"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1e293b" : "#64748b", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,.1)" : "none", transition: "all .2s" }}>
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "signup" && <><Input label="Your Name" placeholder="Amit Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><Input label="Business Name" placeholder="Amit Adventures" value={form.business} onChange={e => setForm({ ...form, business: e.target.value })} /></>}
            <Input label="Email" type="email" placeholder="amit@travel.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>{error}</div>}
            <Btn variant="primary" disabled={loading} style={{ justifyContent: "center", padding: "12px 20px", fontSize: 14 }}>
              {loading ? "⟳ Processing..." : tab === "login" ? "Sign In →" : "Create Account →"}
            </Btn>
          </form>
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, margin: "16px 0" }}>— or —</div>
          <Btn variant="outline" onClick={demo} style={{ width: "100%", justifyContent: "center", padding: "11px 20px", fontSize: 13 }}>
            ⚡ Try Demo Account (Instant Access)
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "◉", label: "Dashboard" },
  { id: "trips", icon: "🗺", label: "Trips" },
  { id: "leads", icon: "👥", label: "Leads (CRM)" },
  { id: "groups", icon: "🏕", label: "Groups" },
  { id: "payments", icon: "₹", label: "Payments" },
  { id: "itinerary", icon: "📋", label: "Itinerary" },
];

function Sidebar({ page, setPage, user, onLogout, open, setOpen }) {
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 29 }} />}
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 240, background: "#0f172a", display: "flex", flexDirection: "column", zIndex: 30, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .25s ease", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#059669,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈️</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>TravelDesk</div>
            <div style={{ color: "#64748b", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{user.business}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV.map(({ id, icon, label }) => (
            <button key={id} onClick={() => { setPage(id); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", background: page === id ? "rgba(5,150,105,.2)" : "transparent", color: page === id ? "#34d399" : "#94a3b8", transition: "all .15s" }}>
              <span style={{ fontSize: 15 }}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>{user.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ color: "#475569", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", width: "100%", border: "none", background: "transparent", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ── TOPBAR ───────────────────────────────────────────────────────────────────
function TopBar({ title, onMenu, badge }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onMenu} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>☰</button>
      <span style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", flex: 1 }}>{title}</span>
      {badge > 0 && <div style={{ background: "#ef4444", color: "#fff", borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{badge} new</div>}
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ data, setPage, user }) {
  const { trips, leads, groups, payments } = data;
  const revenue = payments.reduce((s, p) => s + p.paidAmount, 0);
  const newLeads = leads.filter(l => l.status === "new").length;
  const recent = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg,#059669,#0d9488)", borderRadius: 16, padding: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Good day,</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>{user.name?.split(" ")[0]} 👋</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Total Leads", leads.length, "👥"], ["Active Trips", trips.filter(t => t.status === "active").length, "🗺"], ["Seats Booked", groups.reduce((s, g) => s + g.leadIds.length, 0), "🪑"], ["Revenue", fmt(revenue), "💰"]].map(([label, val, ic]) => (
            <div key={label} style={{ background: "rgba(255,255,255,.15)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 20 }}>{ic}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {newLeads > 0 && (
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13 }}>{newLeads} new lead{newLeads > 1 ? "s" : ""} waiting!</div>
            <div style={{ fontSize: 12, color: "#b45309" }}>Reach out via WhatsApp before they go cold.</div>
          </div>
          <Btn variant="primary" onClick={() => setPage("leads")} style={{ padding: "6px 12px", fontSize: 12 }}>View →</Btn>
        </div>
      )}

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Recent Leads</span>
          <Btn variant="ghost" onClick={() => setPage("leads")} style={{ fontSize: 12, padding: "4px 8px" }}>View all →</Btn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recent.map(lead => {
            const trip = trips.find(t => t.id === lead.tripId);
            return (
              <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                <Avatar name={lead.name} size={36} color={lead.status === "converted" ? "#059669" : lead.status === "contacted" ? "#d97706" : "#3b82f6"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trip?.destination || "—"}</div>
                </div>
                <Badge v={lead.status}>{lead.status}</Badge>
                <a href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, this is ${user.business}! Are you still interested in ${trip?.title || "our trip"}? Let us know 🚀`)}`} target="_blank" rel="noreferrer" style={{ fontSize: 18, textDecoration: "none" }}>💬</a>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 16 }}>Trip Fill Rate</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {trips.slice(0, 3).map(trip => {
            const tg = groups.filter(g => g.tripId === trip.id);
            const total = tg.reduce((s, g) => s + g.totalSeats, 0) || trip.maxSeats;
            const filled = tg.reduce((s, g) => s + g.leadIds.length, 0);
            const pct = Math.round((filled / total) * 100);
            return (
              <div key={trip.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{trip.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", flexShrink: 0 }}>{filled}/{total} seats</div>
                </div>
                <ProgressBar pct={pct} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── TRIPS ────────────────────────────────────────────────────────────────────
function Trips({ data, setData, user, setPublicTrip }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", destination: "", price: "", startDate: "", endDate: "", maxSeats: "", description: "", images: [] });
  const [imgUrl, setImgUrl] = useState("");

  const save = () => {
    setData(d => ({ ...d, trips: [{ id: uid(), ...form, price: +form.price, maxSeats: +form.maxSeats, status: "active", itinerary: [], createdAt: new Date().toISOString() }, ...d.trips] }));
    setShowCreate(false); setForm({ title: "", destination: "", price: "", startDate: "", endDate: "", maxSeats: "", description: "", images: [] });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn variant="primary" onClick={() => setShowCreate(true)}>+ New Trip</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.trips.map(trip => {
          const tg = data.groups.filter(g => g.tripId === trip.id);
          const filled = tg.reduce((s, g) => s + g.leadIds.length, 0);
          const total = tg.reduce((s, g) => s + g.totalSeats, 0) || trip.maxSeats;
          return (
            <Card key={trip.id} style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ position: "relative", height: 140, background: "#e2e8f0", overflow: "hidden" }}>
                {trip.images?.[0] && <img src={trip.images[0]} alt={trip.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.6), transparent)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16 }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{trip.title}</div>
                  <div style={{ color: "rgba(255,255,255,.8)", fontSize: 12, marginTop: 2 }}>📍 {trip.destination}</div>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12 }}><Badge v="active">active</Badge></div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>📅 {fmtDate(trip.startDate)}</span>
                  <span style={{ fontWeight: 700, color: "#059669" }}>{fmt(trip.price)}/person</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                    <span>Seats filled</span><span>{filled}/{total}</span>
                  </div>
                  <ProgressBar pct={(filled / total) * 100} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="outline" onClick={() => setPublicTrip(trip)} style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>🌐 Public Page</Btn>
                  <Btn variant="secondary" onClick={() => { const url = `https://traveldesk.app/trip/${trip.id}`; alert(`Link copied!\n\n${url}\n\n(In production, share this link on Instagram & WhatsApp to capture leads automatically)`); }} style={{ fontSize: 12 }}>📋 Copy Link</Btn>
                </div>
              </div>
            </Card>
          );
        })}
        {data.trips.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗺</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569", marginBottom: 8 }}>No trips yet</div>
            <div style={{ fontSize: 13, marginBottom: 16 }}>Create your first trip to start accepting leads</div>
            <Btn variant="primary" onClick={() => setShowCreate(true)}>+ Create Trip</Btn>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="✈️ Create New Trip">
        <Input label="Trip Title" placeholder="Manali Group Trip – May 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input label="Destination" placeholder="Manali, Himachal Pradesh" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
        <Textarea label="Description" placeholder="What makes this trip special?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Price (₹/person)" type="number" placeholder="12500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <Input label="Max Group Size" type="number" placeholder="30" value={form.maxSeats} onChange={e => setForm({ ...form, maxSeats: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End Date" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Cover Image URL</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none" }} placeholder="https://unsplash.com/..." value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
            <Btn variant="secondary" onClick={() => { if (imgUrl) { setForm(f => ({ ...f, images: [imgUrl] })); setImgUrl(""); } }}>Add</Btn>
          </div>
          {form.images[0] && <img src={form.images[0]} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginTop: 8 }} />}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn variant="outline" onClick={() => setShowCreate(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={!form.title || !form.price}>Create Trip 🚀</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── PUBLIC TRIP PAGE ─────────────────────────────────────────────────────────
function PublicPage({ trip, onBack, onLead, user }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", travelType: "solo" });
  const [done, setDone] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`Hi! I'm interested in ${trip.title}. Please share details.`)}`;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid #f1f5f9", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <a href={wa} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><Btn variant="whatsapp" style={{ fontSize: 12, padding: "7px 14px" }}>💬 WhatsApp Us</Btn></a>
      </div>
      <div style={{ position: "relative", height: 220, background: "#064e3b", overflow: "hidden" }}>
        {trip.images?.[0] && <img src={trip.images[0]} alt={trip.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 24px" }}>
          <Badge v="active">🟢 Open for Booking</Badge>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginTop: 8, lineHeight: 1.3 }}>{trip.title}</div>
          <div style={{ color: "rgba(255,255,255,.75)", fontSize: 13, marginTop: 6, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <span>📍 {trip.destination}</span>
            <span>📅 {fmtDate(trip.startDate)} – {fmtDate(trip.endDate)}</span>
            <span>👥 Max {trip.maxSeats} people</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>{fmt(trip.price)} <span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8" }}>per person</span></div>
          <div style={{ fontSize: 13, color: "#64748b", margin: "8px 0 12px" }}>{fmtDate(trip.startDate)} → {fmtDate(trip.endDate)}</div>
          {["Instant confirmation on enquiry", "EMI options available (UPI / credit card)", "Dedicated trip coordinator on WhatsApp"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", marginBottom: 6 }}><span style={{ color: "#059669", fontWeight: 700 }}>✓</span>{t}</div>
          ))}
        </Card>

        {trip.description && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 10 }}>About This Trip</div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{trip.description}</div>
          </Card>
        )}

        {trip.itinerary?.length > 0 && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 16 }}>🗓 Day-wise Itinerary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {trip.itinerary.map((day, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#059669,#0d9488)", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>D{day.day}</div>
                    {i < trip.itinerary.length - 1 && <div style={{ width: 1, flex: 1, background: "#e2e8f0", margin: "4px 0" }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 6 }}>{day.title}</div>
                    {day.activities.map((a, j) => <div key={j} style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 6 }}><span style={{ color: "#059669", marginTop: 1, flexShrink: 0 }}>•</span>{a}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!done ? (
          <Card style={{ background: "#f8fafc" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 16 }}>🎒 Join This Trip</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="WhatsApp Number *" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Select value={form.travelType} onChange={e => setForm({ ...form, travelType: e.target.value })}>
                <option value="solo">Solo Traveller</option>
                <option value="duo">Duo / Couple</option>
                <option value="group">Group</option>
                <option value="honeymoon">Honeymoon Package</option>
              </Select>
              <Btn variant="primary" onClick={() => { if (form.name && form.phone) { onLead({ ...form, tripId: trip.id }); setDone(true); } }} disabled={!form.name || !form.phone} style={{ justifyContent: "center", padding: "12px", fontSize: 14 }}>
                Reserve My Spot 🚀
              </Btn>
            </div>
          </Card>
        ) : (
          <Card style={{ textAlign: "center", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#15803d" }}>You're on the list!</div>
            <div style={{ fontSize: 13, color: "#16a34a", marginTop: 4 }}>We'll contact you on WhatsApp within 24 hours.</div>
            <a href={wa} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Btn variant="whatsapp" style={{ marginTop: 14, justifyContent: "center", width: "100%" }}>💬 Chat on WhatsApp directly</Btn>
            </a>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── LEADS ────────────────────────────────────────────────────────────────────
function Leads({ data, setData, user }) {
  const [search, setSearch] = useState("");
  const [sf, setSf] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", tripId: data.trips[0]?.id || "", travelType: "solo", status: "new", notes: "" });

  const filtered = data.leads.filter(l =>
    (sf === "all" || l.status === sf) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
  );

  const updateStatus = (id, status) => {
    setData(d => ({ ...d, leads: d.leads.map(l => l.id === id ? { ...l, status } : l) }));
    setSelected(s => s?.id === id ? { ...s, status } : s);
  };

  const addLead = () => {
    setData(d => ({ ...d, leads: [{ id: uid(), ...form, createdAt: new Date().toISOString() }, ...d.leads] }));
    setShowAdd(false);
    setForm({ name: "", phone: "", email: "", tripId: data.trips[0]?.id || "", travelType: "solo", status: "new", notes: "" });
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 57px)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", ...(selected ? { display: "none" } : {}) }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Leads ({filtered.length})</span>
            <Btn variant="primary" onClick={() => setShowAdd(true)} style={{ fontSize: 12, padding: "7px 14px" }}>+ Add Lead</Btn>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ flex: 1, padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none" }} placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, background: "#fff" }} value={sf} onChange={e => setSf(e.target.value)}>
              <option value="all">All</option><option value="new">New</option><option value="contacted">Contacted</option><option value="converted">Converted</option>
            </select>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(lead => {
            const trip = data.trips.find(t => t.id === lead.tripId);
            const wa = `https://wa.me/${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, this is ${user.business}! Following up on your interest in ${trip?.title || "our trip"}. Are you still interested? 🚀`)}`;
            return (
              <div key={lead.id} onClick={() => setSelected(lead)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #f8fafc", cursor: "pointer", background: selected?.id === lead.id ? "#f0fdf4" : "transparent", transition: "background .1s" }}>
                <Avatar name={lead.name} size={38} color={lead.status === "converted" ? "#059669" : lead.status === "contacted" ? "#d97706" : "#3b82f6"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trip?.title || "—"}</div>
                </div>
                <Badge v={lead.status}>{lead.status}</Badge>
                <a href={wa} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 18, textDecoration: "none" }}>💬</a>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}><div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>No leads found</div>}
        </div>
      </div>

      {selected && (
        <div style={{ width: "100%", borderLeft: "1px solid #f1f5f9", background: "#fff", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#64748b" }}>←</button>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", flex: 1 }}>Lead Profile</span>
            <button onClick={() => { setData(d => ({ ...d, leads: d.leads.filter(l => l.id !== selected.id) })); setSelected(null); }} style={{ background: "#fef2f2", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8, fontSize: 13 }}>🗑 Delete</button>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <Avatar name={selected.name} size={56} color="#059669" />
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1e293b", marginTop: 10 }}>{selected.name}</div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 8 }}>
                <Badge v={selected.travelType}>{selected.travelType}</Badge>
                <Badge v={selected.status}>{selected.status}</Badge>
              </div>
            </div>
            <Card>
              {[["📞", selected.phone], ["✉️", selected.email || "No email"], ["🗺", data.trips.find(t => t.id === selected.tripId)?.title || "—"], ["📅", fmtDate(selected.createdAt)]].map(([ic, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid #f8fafc" : "none", fontSize: 13, color: "#334155" }}>
                  <span>{ic}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                </div>
              ))}
            </Card>
            {selected.notes && <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: 14, fontSize: 13, color: "#92400e" }}>📝 {selected.notes}</div>}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Update Status</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["new", "contacted", "converted"].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `2px solid ${selected.status === s ? "#059669" : "#e2e8f0"}`, background: selected.status === s ? "#059669" : "#fff", color: selected.status === s ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", transition: "all .15s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <a href={`https://wa.me/${selected.phone}?text=${encodeURIComponent(`Hi ${selected.name.split(" ")[0]}, this is ${user.business}! Following up on your trip enquiry. Are you still interested? 🚀`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Btn variant="whatsapp" style={{ width: "100%", justifyContent: "center", padding: 12 }}>💬 Send WhatsApp Message</Btn>
            </a>
          </div>
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="➕ Add New Lead">
        <Input label="Full Name" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input label="WhatsApp Number" type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <Input label="Email (optional)" type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Select label="Interested Trip" value={form.tripId} onChange={e => setForm({ ...form, tripId: e.target.value })}>
          {data.trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </Select>
        <Select label="Travel Type" value={form.travelType} onChange={e => setForm({ ...form, travelType: e.target.value })}>
          <option value="solo">Solo</option><option value="duo">Duo/Couple</option><option value="group">Group</option><option value="honeymoon">Honeymoon</option>
        </Select>
        <Textarea label="Notes" placeholder="Any special requirements..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={addLead} disabled={!form.name || !form.phone}>Add Lead</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── GROUPS ────────────────────────────────────────────────────────────────────
function Groups({ data, setData }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", tripId: data.trips[0]?.id || "", totalSeats: "" });
  const [addTo, setAddTo] = useState(null);
  const [pick, setPick] = useState("");

  const save = () => {
    setData(d => ({ ...d, groups: [...d.groups, { id: uid(), ...form, totalSeats: +form.totalSeats, leadIds: [], createdAt: new Date().toISOString() }] }));
    setShowCreate(false); setForm({ name: "", tripId: data.trips[0]?.id || "", totalSeats: "" });
  };

  const assign = (gid) => {
    if (!pick) return;
    setData(d => ({ ...d, groups: d.groups.map(g => g.id === gid && !g.leadIds.includes(pick) ? { ...g, leadIds: [...g.leadIds, pick] } : g) }));
    setAddTo(null); setPick("");
  };

  const remove = (gid, lid) => setData(d => ({ ...d, groups: d.groups.map(g => g.id === gid ? { ...g, leadIds: g.leadIds.filter(id => id !== lid) } : g) }));

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn variant="primary" onClick={() => setShowCreate(true)}>+ New Group</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.groups.map(g => {
          const trip = data.trips.find(t => t.id === g.tripId);
          const filled = g.leadIds.length;
          const isFull = filled >= g.totalSeats;
          const gLeads = data.leads.filter(l => g.leadIds.includes(l.id));
          const avail = data.leads.filter(l => l.tripId === g.tripId && !g.leadIds.includes(l.id));
          return (
            <Card key={g.id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{g.name}</span>
                    {isFull && <Badge v="full">FULL</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{trip?.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: isFull ? "#dc2626" : "#059669" }}>{filled}<span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8" }}>/{g.totalSeats}</span></div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>seats</div>
                </div>
              </div>
              <ProgressBar pct={(filled / g.totalSeats) * 100} />
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {gLeads.map(l => (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", borderRadius: 99, padding: "4px 10px 4px 6px", fontSize: 12 }}>
                    <Avatar name={l.name} size={20} color="#059669" />
                    <span style={{ fontWeight: 600, color: "#334155" }}>{l.name.split(" ")[0]}</span>
                    <button onClick={() => remove(g.id, l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 13, padding: "0 0 0 2px", lineHeight: 1 }}>✕</button>
                  </div>
                ))}
                {gLeads.length === 0 && <span style={{ fontSize: 12, color: "#94a3b8" }}>No travellers assigned yet</span>}
              </div>
              {!isFull && (
                addTo === g.id ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <select style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, background: "#fff" }} value={pick} onChange={e => setPick(e.target.value)}>
                      <option value="">Select lead...</option>
                      {avail.map(l => <option key={l.id} value={l.id}>{l.name} ({l.travelType})</option>)}
                    </select>
                    <Btn variant="primary" onClick={() => assign(g.id)} style={{ fontSize: 12, padding: "7px 14px" }}>Add</Btn>
                    <Btn variant="ghost" onClick={() => setAddTo(null)} style={{ fontSize: 12 }}>✕</Btn>
                  </div>
                ) : (
                  <Btn variant="outline" onClick={() => { setAddTo(g.id); setPick(""); }} style={{ marginTop: 12, fontSize: 12 }}>+ Add Traveller</Btn>
                )
              )}
            </Card>
          );
        })}
        {data.groups.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏕</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569", marginBottom: 8 }}>No groups yet</div>
            <Btn variant="primary" onClick={() => setShowCreate(true)}>+ Create Group</Btn>
          </div>
        )}
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="🏕 Create Group / Batch">
        <Input label="Group Name" placeholder="Manali Batch A – May 15" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Select label="Trip" value={form.tripId} onChange={e => setForm({ ...form, tripId: e.target.value })}>
          {data.trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </Select>
        <Input label="Total Seats in This Batch" type="number" placeholder="15" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={() => setShowCreate(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={!form.name || !form.totalSeats}>Create Group</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
function Payments({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ leadId: data.leads[0]?.id || "", totalAmount: "", paidAmount: "", method: "UPI", note: "" });
  const collected = data.payments.reduce((s, p) => s + p.paidAmount, 0);
  const pending = data.payments.reduce((s, p) => s + (p.totalAmount - p.paidAmount), 0);

  const save = () => {
    const total = +form.totalAmount, paid = +form.paidAmount;
    const status = paid >= total ? "paid" : paid > 0 ? "partial" : "pending";
    const lead = data.leads.find(l => l.id === form.leadId);
    setData(d => ({ ...d, payments: [{ id: uid(), ...form, totalAmount: total, paidAmount: paid, status, tripId: lead?.tripId || "", date: new Date().toISOString() }, ...d.payments] }));
    setShowAdd(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Collected</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{fmt(collected)}</div>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Pending</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#dc2626" }}>{fmt(pending)}</div>
        </Card>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn variant="primary" onClick={() => setShowAdd(true)}>+ Record Payment</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.payments.map(p => {
          const lead = data.leads.find(l => l.id === p.leadId);
          const trip = data.trips.find(t => t.id === (p.tripId || lead?.tripId));
          return (
            <Card key={p.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={lead?.name || "?"} size={38} color="#059669" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead?.name || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trip?.title || "—"}</div>
                </div>
                <Badge v={p.status}>{p.status}</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, textAlign: "center" }}>
                {[["Total", fmt(p.totalAmount), "#334155"], ["Paid", fmt(p.paidAmount), "#059669"], ["Pending", fmt(p.totalAmount - p.paidAmount), "#dc2626"]].map(([label, val, color]) => (
                  <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 4px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
              <ProgressBar pct={(p.paidAmount / p.totalAmount) * 100} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
                <span>via {p.method}</span><span>{fmtDate(p.date)}</span>
              </div>
              {p.note && <div style={{ marginTop: 8, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>"{p.note}"</div>}
            </Card>
          );
        })}
        {data.payments.length === 0 && <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}><div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>No payments recorded yet</div>}
      </div>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="💰 Record Payment">
        <Select label="Traveller" value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}>
          {data.leads.map(l => <option key={l.id} value={l.id}>{l.name} – {l.phone}</option>)}
        </Select>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Total Amount (₹)" type="number" placeholder="25000" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} />
          <Input label="Paid Amount (₹)" type="number" placeholder="5000" value={form.paidAmount} onChange={e => setForm({ ...form, paidAmount: e.target.value })} />
        </div>
        <Select label="Payment Method" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
          <option value="UPI">UPI (GPay / PhonePe)</option><option value="Cash">Cash</option><option value="Bank Transfer">Bank Transfer</option><option value="Card">Card</option><option value="Cheque">Cheque</option>
        </Select>
        <Textarea label="Note" placeholder="Advance payment for Manali trip..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={!form.totalAmount || !form.paidAmount}>Save Payment</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── ITINERARY ─────────────────────────────────────────────────────────────────
function Itinerary({ data, setData }) {
  const [sel, setSel] = useState(data.trips[0]?.id || "");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", activities: "" });
  const trip = data.trips.find(t => t.id === sel);

  const addDay = () => {
    const day = { day: (trip?.itinerary?.length || 0) + 1, title: form.title, activities: form.activities.split("\n").filter(Boolean) };
    setData(d => ({ ...d, trips: d.trips.map(t => t.id === sel ? { ...t, itinerary: [...(t.itinerary || []), day] } : t) }));
    setForm({ title: "", activities: "" }); setShowAdd(false);
  };

  const delDay = (dayNum) => setData(d => ({ ...d, trips: d.trips.map(t => t.id === sel ? { ...t, itinerary: t.itinerary.filter(d => d.day !== dayNum).map((d, i) => ({ ...d, day: i + 1 })) } : t) }));

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select style={{ flex: 1, minWidth: 180, padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, background: "#fff" }} value={sel} onChange={e => setSel(e.target.value)}>
          {data.trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <Btn variant="primary" onClick={() => setShowAdd(true)}>+ Add Day</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {trip?.itinerary?.map((day, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#059669,#0d9488)", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>D{day.day}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 8 }}>{day.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {day.activities.map((a, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#64748b" }}>
                      <span style={{ color: "#059669", flexShrink: 0 }}>✓</span>{a}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => delDay(day.day)} style={{ background: "#fef2f2", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8, fontSize: 12, color: "#dc2626" }}>🗑</button>
            </div>
          </Card>
        ))}
        {(!trip?.itinerary?.length) && (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#475569", marginBottom: 8 }}>No itinerary yet</div>
            <Btn variant="primary" onClick={() => setShowAdd(true)}>+ Add Day 1</Btn>
          </div>
        )}
      </div>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`📅 Add Day ${(trip?.itinerary?.length || 0) + 1}`}>
        <Input label="Day Title" placeholder="Arrival & Rohtang Pass" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Activities <span style={{ fontWeight: 400, color: "#94a3b8" }}>(one per line)</span></label>
          <textarea style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }}
            rows={6} placeholder={"Check-in at hotel\nHadimba Temple visit\nMall Road shopping\nBonfire & group dinner"} value={form.activities} onChange={e => setForm({ ...form, activities: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="outline" onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={addDay} disabled={!form.title}>Add Day</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publicTrip, setPublicTrip] = useState(null);
  const [data, setDataRaw] = useState({ trips: SEED_TRIPS, leads: SEED_LEADS, groups: SEED_GROUPS, payments: SEED_PAYMENTS });
  const setData = useCallback(updater => setDataRaw(prev => typeof updater === "function" ? updater(prev) : updater), []);

  const handleLead = (formData) => setData(d => ({ ...d, leads: [{ id: uid(), ...formData, status: "new", createdAt: new Date().toISOString() }, ...d.leads] }));

  if (!user) return <Auth onAuth={setUser} />;
  if (publicTrip) return <PublicPage trip={publicTrip} onBack={() => setPublicTrip(null)} onLead={handleLead} user={user} />;

  const newLeads = data.leads.filter(l => l.status === "new").length;
  const titles = { dashboard: "Dashboard", trips: "Trips", leads: "Leads (CRM)", groups: "Groups", payments: "Payments", itinerary: "Itinerary Builder" };
  const pages = { dashboard: <Dashboard data={data} setPage={setPage} user={user} />, trips: <Trips data={data} setData={setData} user={user} setPublicTrip={setPublicTrip} />, leads: <Leads data={data} setData={setData} user={user} />, groups: <Groups data={data} setData={setData} />, payments: <Payments data={data} setData={setData} />, itinerary: <Itinerary data={data} setData={setData} /> };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", position: "relative" }}>
      <Sidebar page={page} setPage={setPage} user={user} onLogout={() => setUser(null)} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={titles[page]} onMenu={() => setSidebarOpen(true)} badge={page !== "leads" ? newLeads : 0} />
        <div style={{ flex: 1, overflowY: "auto" }}>{pages[page]}</div>
      </div>
    </div>
  );
}
