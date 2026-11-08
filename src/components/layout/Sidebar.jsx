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
        background: "rgba(62,107,82,.2)",
        border: "1px solid rgba(62,107,82,.4)",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Database size={11} color="#4ade80" />
          <span style={{ color: "#F3F1E9", fontWeight: 600 }}>PostgreSQL 17</span>
        </div>
        <span style={{ 
          fontSize: 9, 
          padding: "1px 5px", 
          borderRadius: 3, 
          background: "#15803d", 
          color: "#fff", 
          fontWeight: 700 
        }}>
          LIVE
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
        </div>
      </div>
    </aside>
  );
}
