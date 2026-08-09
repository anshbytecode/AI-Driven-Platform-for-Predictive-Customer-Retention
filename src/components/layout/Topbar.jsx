import { useState } from "react";
import { Search, Bell, Plus, Bot, LogOut, User } from "lucide-react";
import { COLOR, SECTIONS } from "../../constants/theme";
import Button from "../ui/Button";

export default function Topbar({
  query,
  setQuery,
  alerts,
  onPick,
  activeSection,
  onSectionChange,
  user,
  onLogout,
  onOpenAddAccount,
  onOpenCopilot
}) {
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: `1px solid ${COLOR.hair}`, background: COLOR.paperRaised, gap: 16, flexWrap: "wrap" }}>
      {/* Title */}
      <div>
        <div style={{ fontSize: 11, letterSpacing: ".08em", color: COLOR.inkSoft, textTransform: "uppercase", fontWeight: 600 }}>
          Q3 FY26 • Retail & Priority Banking
        </div>
        <div style={{ fontFamily: "Fraunces", fontSize: 20, color: COLOR.ink }}>
          {activeSection}
        </div>
      </div>

      {/* Controls Group */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: COLOR.inkSoft }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search customer or ID..."
            style={{ fontSize: 12.5, padding: "8px 12px 8px 30px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, width: 220, outline: "none" }}
          />
        </div>

        {/* Section Navigation Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => onSectionChange(s)}
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                padding: "7px 11px",
                borderRadius: 18,
                border: `1px solid ${activeSection === s ? COLOR.ink : COLOR.hair}`,
                background: activeSection === s ? COLOR.ink : "transparent",
                color: activeSection === s ? "#fff" : COLOR.inkSoft,
                cursor: "pointer"
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <button
          onClick={onOpenAddAccount}
          style={{ padding: "7px 12px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
        >
          <Plus size={14} color={COLOR.brassLight} /> Add
        </button>

        <button
          onClick={() => onOpenCopilot()}
          style={{ padding: "7px 12px", background: COLOR.brass, color: "#fff", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
        >
          <Bot size={14} /> Copilot
        </button>

        {/* Notifications Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpenAlerts(v => !v)}
            style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 6, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <Bell size={15} color={COLOR.ink} />
            <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: COLOR.risk, color: "#fff", fontSize: 9, fontWeight: 700, display: "grid", placeItems: "center" }}>
              {alerts.length}
            </span>
          </button>

          {openAlerts && (
            <div style={{ position: "absolute", top: 42, right: 0, width: 310, background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, boxShadow: "0 10px 24px rgba(0,0,0,.15)", zIndex: 35 }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${COLOR.hair}`, fontWeight: 600, fontSize: 12, color: COLOR.ink }}>
                High Priority Churn Alerts ({alerts.length})
              </div>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {alerts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { onPick(c); setOpenAlerts(false); }}
                    style={{ padding: "10px 14px", borderBottom: `1px solid ${COLOR.hair}`, cursor: "pointer", fontSize: 12 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <b>{c.name}</b>
                      <span style={{ color: COLOR.risk, fontWeight: 600 }}>{c.risk}% Risk</span>
                    </div>
                    <div style={{ color: COLOR.inkSoft, fontSize: 11, marginTop: 2 }}>{c.driver}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpenUserMenu(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 20, cursor: "pointer", fontSize: 12 }}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLOR.ink, color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600 }}>
              {(user?.name || "U")[0]}
            </div>
            <span style={{ fontWeight: 500 }}>{user?.name || "User"}</span>
          </button>

          {openUserMenu && (
            <div style={{ position: "absolute", top: 40, right: 0, width: 200, background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, boxShadow: "0 10px 24px rgba(0,0,0,.15)", zIndex: 35, padding: 8 }}>
              <div style={{ padding: 8, fontSize: 11, color: COLOR.inkSoft, borderBottom: `1px solid ${COLOR.hair}` }}>
                Signed in as <b>{user?.name || "User"}</b>
              </div>
              <button
                onClick={() => { onLogout(); setOpenUserMenu(false); }}
                style={{ width: "100%", padding: "8px 10px", marginTop: 4, border: 0, background: "transparent", color: COLOR.risk, fontWeight: 600, fontSize: 12, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
