import { LayoutGrid, Users, ShieldAlert, Sparkles, Landmark, Bot } from "lucide-react";
import { COLOR } from "../../constants/theme";

export default function Sidebar({ queuedCount, activeSection, onSectionChange, onOpenCopilot, highRiskCount = 0 }) {
  const items = [
    { icon: LayoutGrid, label: "Overview" },
    { icon: ShieldAlert, label: "Risk Ledger", badge: highRiskCount > 0 ? highRiskCount : null, tone: "risk" },
    { icon: Users, label: "Segments" },
    { icon: Sparkles, label: "AI Playbooks", badge: "5", tone: "brass" },
    { icon: Landmark, label: "Portfolios" }
  ];

  return (
    <aside className="sidebar" style={{ background: COLOR.panel, color: "#C9CFDA", width: 220, flexShrink: 0, display: "flex", flexDirection: "column", padding: "22px 16px" }}>
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(155deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center" }}>
          <Landmark size={18} color={COLOR.panel} />
        </div>
        <div style={{ fontFamily: "Fraunces", fontSize: 16, color: "#F3F1E9" }}>
          Meridian<br />
          <span style={{ fontSize: 10, letterSpacing: ".14em", color: COLOR.brassLight, fontFamily: "IBM Plex Sans", fontWeight: 600 }}>RETENTION INTELLIGENCE</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {items.map(it => {
          const active = activeSection === it.label;
          return (
            <div
              key={it.label}
              onClick={() => onSectionChange(it.label)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 13.5,
                cursor: "pointer",
                background: active ? COLOR.panelSoft : "transparent",
                color: active ? "#F3F1E9" : "#9AA6B8",
                borderLeft: active ? `3px solid ${COLOR.brassLight}` : "3px solid transparent",
                transition: "all .15s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <it.icon size={16} />
                <span>{it.label}</span>
              </div>
              {it.badge && (
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: it.tone === "risk" ? COLOR.risk : COLOR.brass, color: "#fff", fontWeight: 600 }}>
                  {it.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Copilot Assistant Trigger Box */}
      <div
        onClick={() => onOpenCopilot()}
        style={{
          marginTop: 24,
          padding: 12,
          background: COLOR.panelSoft,
          borderRadius: 8,
          border: `1px solid ${COLOR.hairDark}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center" }}>
          <Bot size={16} color={COLOR.panel} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#F3F1E9" }}>Meridian Copilot</div>
          <div style={{ fontSize: 10.5, color: COLOR.brassLight }}>Ask AI Assistant</div>
        </div>
      </div>

      {/* Footer Status */}
      <div style={{ marginTop: "auto", paddingTop: 18, borderTop: `1px solid ${COLOR.hairDark}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: COLOR.panelSoft, borderRadius: 6, fontSize: 11.5 }}>
          <span>Queued this session</span>
          <span style={{ color: COLOR.brassLight, fontWeight: 600 }}>{queuedCount}</span>
        </div>
        <div style={{ fontSize: 10.5, color: "#75839A", lineHeight: 1.5, marginTop: 10 }}>
          Model last retrained<br />
          <span style={{ color: "#C9CFDA" }}>Aug 3, 2026 · v4.2</span>
        </div>
      </div>
    </aside>
  );
}
