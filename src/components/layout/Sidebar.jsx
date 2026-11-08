<<<<<<< HEAD
import { 
  LayoutGrid, Users, ShieldAlert, Sparkles, Landmark, Bot, 
  BrainCircuit, Sliders, Target, MessageSquareHeart, AlertOctagon, 
  Activity, LineChart, Lock, Database, GitBranch, Heart, RefreshCw 
} from "lucide-react";
import { COLOR } from "../../constants/theme";

export default function Sidebar({ 
  queuedCount = 0, 
  activeSection, 
  onSectionChange, 
  onOpenCopilot, 
  highRiskCount = 0,
  dbConnected = true
}) {
  const navGroups = [
    {
      group: "Command & 360",
      items: [
        { icon: LayoutGrid, label: "Command Center", badge: "Live", tone: "brass", desc: "Executive KPIs & Alerts" },
        { icon: Users, label: "Customer 360", badge: highRiskCount > 0 ? highRiskCount : null, tone: "risk", desc: "Profiles & ML Ranking" },
        { icon: Heart, label: "Behavior & Digital Twin", badge: "Twin", tone: "brass", desc: "Health & Live Timeline" },
        { icon: BrainCircuit, label: "Explainable AI", badge: "SHAP", tone: "brass", desc: "Attribution & Intent" },
      ]
    },
    {
      group: "Strategy & Optimization",
      items: [
        { icon: ShieldAlert, label: "Segmentation & RFM", desc: "9 Clusters & RFM Grid" },
        { icon: Target, label: "Opportunity & Uplift", badge: "Uplift", tone: "brass", desc: "Next Best Action & ROI" },
        { icon: Sliders, label: "What-If Simulator", desc: "Concession Sandbox" },
        { icon: MessageSquareHeart, label: "Omnichannel & Fatigue", badge: "Fatigue", tone: "risk", desc: "STO & Frequency Caps" },
      ]
    },
    {
      group: "Lifecycle & Signals",
      items: [
        { icon: GitBranch, label: "Journeys & Cohorts", desc: "Lifecycle & Day 1–90" },
        { icon: Sparkles, label: "Campaigns & A/B", desc: "5-Stage Funnel & Tests" },
        { icon: MessageSquareHeart, label: "NLP Sentiment", desc: "Transcripts & Topics" },
        { icon: AlertOctagon, label: "Fraud Sentinel", badge: "1 Flag", tone: "risk", desc: "Abnormal Refund Defense" },
        { icon: Activity, label: "Real-Time Stream", desc: "Live Pipeline Simulator" },
      ]
    },
    {
      group: "Multi-Agent & Governance",
      items: [
        { icon: RefreshCw, label: "Multi-Agent & Closed Loop", badge: "7 Agents", tone: "brass", desc: "Autonomous Self-Learning" },
        { icon: LineChart, label: "Model Monitoring", desc: "ROC-AUC 0.941 & Drift" },
        { icon: Lock, label: "Privacy & Security", desc: "RBAC & Audit Trail" },
        { icon: Sparkles, label: "AI Playbooks", desc: "Automated RM recipes" },
        { icon: Landmark, label: "Portfolios", desc: "Relationship Manager Desk" }
      ]
    }
  ];

  return (
    <aside 
      className="sidebar" 
      style={{ 
        background: COLOR.panel, 
        color: "#C9CFDA", 
        width: 255, 
        flexShrink: 0, 
        display: "flex", 
        flexDirection: "column", 
        padding: "18px 12px",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        borderRight: `1px solid ${COLOR.hairDark}`
      }}
    >
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingLeft: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(155deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center", boxShadow: "0 4px 12px rgba(169,124,63,.3)" }}>
          <Landmark size={18} color={COLOR.panel} />
        </div>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 16, color: "#F3F1E9", fontWeight: 600, lineHeight: 1.1 }}>
            Meridian
          </div>
          <div style={{ fontSize: 9, letterSpacing: ".14em", color: COLOR.brassLight, fontFamily: "IBM Plex Sans", fontWeight: 700, marginTop: 2 }}>
            RETENTION INTELLIGENCE
          </div>
        </div>
      </div>

      {/* Database Connection Status Pill */}
      <div style={{
        margin: "0 4px 14px",
        padding: "5px 8px",
        background: dbConnected ? "rgba(62,107,82,.2)" : "rgba(178,58,50,.2)",
        border: `1px solid ${dbConnected ? "rgba(62,107,82,.4)" : "rgba(178,58,50,.4)"}`,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Database size={11} color={dbConnected ? "#4ade80" : "#f87171"} />
          <span style={{ color: "#F3F1E9", fontWeight: 600 }}>PostgreSQL 17</span>
        </div>
        <span style={{ 
          fontSize: 9, 
          padding: "1px 5px", 
          borderRadius: 3, 
          background: dbConnected ? "#15803d" : "#b91c1c", 
          color: "#fff", 
          fontWeight: 700 
        }}>
          {dbConnected ? "LIVE" : "FALLBACK"}
        </span>
      </div>

      {/* Navigation Sections */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {navGroups.map(grp => (
          <div key={grp.group}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 8px 4px" }}>
              {grp.group}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {grp.items.map(it => {
                const active = activeSection === it.label;
                return (
                  <div
                    key={it.label}
                    onClick={() => onSectionChange(it.label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 8px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      cursor: "pointer",
                      background: active ? COLOR.panelSoft : "transparent",
                      color: active ? "#F3F1E9" : "#94A3B8",
                      borderLeft: active ? `3px solid ${COLOR.brassLight}` : "3px solid transparent",
                      transition: "all .12s ease",
                      fontWeight: active ? 600 : 500
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <it.icon size={14} color={active ? COLOR.brassLight : "#64748B"} />
                      <span>{it.label}</span>
                    </div>
                    {it.badge && (
                      <span style={{ 
                        fontSize: 9, 
                        padding: "1px 5px", 
                        borderRadius: 6, 
                        background: it.tone === "risk" ? COLOR.risk : COLOR.brass, 
                        color: "#fff", 
                        fontWeight: 700 
                      }}>
                        {it.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Meridian Copilot Quick Action */}
      <div
        onClick={() => onOpenCopilot()}
        style={{
          marginTop: 14,
          padding: 8,
          background: "linear-gradient(135deg, rgba(169,124,63,.15), rgba(27,37,54,.9))",
          borderRadius: 6,
          border: `1px solid rgba(203,164,107,.3)`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <div style={{ width: 24, height: 24, borderRadius: 5, background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Bot size={13} color={COLOR.panel} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#F3F1E9" }}>GenAI Assistant</div>
          <div style={{ fontSize: 9, color: COLOR.brassLight }}>37 Modules Grounded RAG</div>
=======
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
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
        </div>
      </div>
    </aside>
  );
}
