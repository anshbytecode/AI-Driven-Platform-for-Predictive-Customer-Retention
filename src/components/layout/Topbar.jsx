import { useState } from "react";
import { Search, Bell, Plus, Bot, LogOut, User, ShieldCheck, Eye, EyeOff, Database } from "lucide-react";
import { COLOR } from "../../constants/theme";

export default function Topbar({
  query,
  setQuery,
  alerts = [],
  onPick,
  activeSection,
  onSectionChange,
  user,
  onLogout,
  onOpenAddAccount,
  onOpenCopilot,
  piiMasked,
  onTogglePiiMasking,
  dbConnected,
  currentRole,
  onChangeRole
}) {
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const roles = [
    "Head of Retention",
    "Senior RM — Private Banking",
    "Relationship Manager",
    "Auditor / Compliance"
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 24px",
      borderBottom: `1px solid ${COLOR.hair}`,
      background: COLOR.paperRaised,
      gap: 12,
      flexWrap: "wrap",
      position: "sticky",
      top: 0,
      zIndex: 25
    }}>
      {/* Title & Section Breadcrumb */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10.5, letterSpacing: ".08em", color: COLOR.inkSoft, textTransform: "uppercase", fontWeight: 700 }}>
            Meridian Retention Intelligence
          </span>
          <span style={{ fontSize: 10.5, color: COLOR.brassLight }}>•</span>
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 5, 
            fontSize: 10.5, 
            fontWeight: 600, 
            color: dbConnected ? "#15803d" : "#b45309",
            background: dbConnected ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
            padding: "2px 7px",
            borderRadius: 10,
            border: `1px solid ${dbConnected ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`
          }}>
            <span style={{ 
              width: 6, 
              height: 6, 
              borderRadius: "50%", 
              background: dbConnected ? "#22c55e" : "#f59e0b",
              boxShadow: dbConnected ? "0 0 6px #22c55e" : "none" 
            }} />
            {dbConnected ? "PostgreSQL 17.6 Connected" : "Backend Reconnecting..."}
          </span>
        </div>
        <div style={{ fontFamily: "Fraunces", fontSize: 21, color: COLOR.ink, fontWeight: 600 }}>
          {activeSection}
        </div>
      </div>

      {/* Controls & Actions Group */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 9, color: COLOR.inkSoft }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search account, ID, or phone..."
            style={{
              fontSize: 12,
              padding: "7px 12px 7px 30px",
              borderRadius: 6,
              border: `1px solid ${COLOR.hair}`,
              width: 210,
              outline: "none",
              background: "#fff"
            }}
          />
        </div>

        {/* PII Masking Toggle Button */}
        <button
          onClick={onTogglePiiMasking}
          title={piiMasked ? "PII is currently masked (GDPR/DPDP Compliant). Click to reveal." : "PII is visible. Click to mask."}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            background: piiMasked ? "#fff" : "rgba(178,58,50,.1)",
            border: `1px solid ${piiMasked ? COLOR.hair : COLOR.risk}`,
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 600,
            color: piiMasked ? COLOR.inkSoft : COLOR.risk,
            cursor: "pointer"
          }}
        >
          {piiMasked ? <EyeOff size={13} color={COLOR.inkSoft} /> : <Eye size={13} color={COLOR.risk} />}
          <span>{piiMasked ? "PII Masked" : "PII Visible"}</span>
        </button>

        {/* Role Selector (RBAC Demo) */}
        <select
          value={currentRole}
          onChange={(e) => onChangeRole(e.target.value)}
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            padding: "6px 10px",
            borderRadius: 6,
            border: `1px solid ${COLOR.hair}`,
            background: "#fff",
            color: COLOR.ink,
            cursor: "pointer",
            outline: "none"
          }}
        >
          {roles.map(r => (
            <option key={r} value={r}>Role: {r}</option>
          ))}
        </select>

        {/* Add Account Button */}
        <button
          onClick={onOpenAddAccount}
          style={{
            padding: "6px 11px",
            background: COLOR.ink,
            color: "#fff",
            border: 0,
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5
          }}
        >
          <Plus size={13} color={COLOR.brassLight} /> Add Account
        </button>

        {/* Copilot Assistant Trigger */}
        <button
          onClick={() => onOpenCopilot()}
          style={{
            padding: "6px 12px",
            background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`,
            color: "#fff",
            border: 0,
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            boxShadow: "0 2px 6px rgba(169,124,63,.25)"
          }}
        >
          <Bot size={14} /> AI Copilot
        </button>

        {/* Alerts Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpenAlerts(v => !v)}
            style={{
              background: "#fff",
              border: `1px solid ${COLOR.hair}`,
              borderRadius: 6,
              width: 32,
              height: 32,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              position: "relative"
            }}
          >
            <Bell size={14} color={COLOR.ink} />
            {alerts.length > 0 && (
              <span style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: COLOR.risk,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                display: "grid",
                placeItems: "center"
              }}>
                {alerts.length}
              </span>
            )}
          </button>

          {openAlerts && (
            <div style={{
              position: "absolute",
              top: 38,
              right: 0,
              width: 320,
              background: "#fff",
              border: `1px solid ${COLOR.hair}`,
              borderRadius: 8,
              boxShadow: "0 10px 24px rgba(0,0,0,.15)",
              zIndex: 35
            }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${COLOR.hair}`, fontWeight: 600, fontSize: 12, color: COLOR.ink, display: "flex", justifyContent: "space-between" }}>
                <span>High-Risk Churn Alerts</span>
                <span style={{ color: COLOR.risk, fontWeight: 700 }}>{alerts.length} Flagged</span>
              </div>
              <div style={{ maxHeight: 250, overflowY: "auto" }}>
                {alerts.map(a => (
                  <div
                    key={a.id}
                    onClick={() => { onPick(a); setOpenAlerts(false); }}
                    style={{
                      padding: "10px 14px",
                      borderBottom: `1px solid ${COLOR.hair}`,
                      cursor: "pointer",
                      fontSize: 11.5,
                      transition: "background .15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLOR.paperRaised}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: COLOR.ink }}>
                      <span>{a.name}</span>
                      <span style={{ color: COLOR.risk }}>{a.risk}% Risk</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: COLOR.inkSoft, marginTop: 2 }}>{a.driver}</div>
                    <div style={{ fontSize: 9.5, color: COLOR.brass, marginTop: 4, fontWeight: 600 }}>Action: {a.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpenUserMenu(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "#fff",
              border: `1px solid ${COLOR.hair}`,
              padding: "4px 9px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLOR.ink, color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>
              {user?.name ? user.name[0] : "A"}
            </div>
            <div style={{ textAlign: "left", lineHeight: 1.1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.ink }}>{user?.name || "Anshul"}</div>
              <div style={{ fontSize: 9.5, color: COLOR.inkSoft }}>{currentRole}</div>
            </div>
          </button>

          {openUserMenu && (
            <div style={{ position: "absolute", top: 38, right: 0, width: 200, background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,.12)", zIndex: 35, padding: 6 }}>
              <div style={{ padding: "8px 10px", fontSize: 11, color: COLOR.inkSoft, borderBottom: `1px solid ${COLOR.hair}` }}>
                Signed in as<br />
                <b style={{ color: COLOR.ink }}>{user?.email || "anshul@meridian.bank"}</b>
              </div>
              <button
                onClick={onLogout}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "transparent",
                  border: 0,
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11.5,
                  color: COLOR.risk,
                  fontWeight: 600,
                  marginTop: 4
                }}
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
