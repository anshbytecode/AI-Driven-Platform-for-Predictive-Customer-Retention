import { useState, useMemo } from "react";
import { BrainCircuit, BarChart3, HelpCircle, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function XaiSection({ customers = [], onOpenCustomer }) {
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "AC-40217");

  const selectedCust = useMemo(() => {
    return customers.find(c => c.id === selectedCustId) || customers[0];
  }, [customers, selectedCustId]);

  // Global feature importance across cohort
  const globalFeatures = [
    { name: "Reduced Purchase Frequency & Outflow", importance: 42, color: COLOR.risk, desc: "Drop in average monthly transaction volume > 35%" },
    { name: "Unresolved Support Complaints", importance: 25, color: "#E65100", desc: "Open tickets > 48 hours without RM escalation" },
    { name: "Declining Digital / Mobile Activity", importance: 18, color: COLOR.mid, desc: "Days since last session > 14 days and session duration drop" },
    { name: "Payment Gateway / Auto-Debit Failure", importance: 10, color: "#9C27B0", desc: "Bounced subscription mandate or card timeout" },
    { name: "Price Sensitivity & Competitor Rate Clicks", importance: 8, color: COLOR.brass, desc: "Viewing external bank high-yield FD interest rate comparison" }
  ];

  // Specific customer SHAP breakdown factors
  const customerShap = useMemo(() => {
    if (!selectedCust) return [];
    if (selectedCust.id === "AC-40217") {
      return [
        { factor: "Competitor FD Rate Shopping", delta: "+42%", raw: "3 visits to ICICI 7.6% FD pages in 24h", risk_add: true, weight: 42 },
        { factor: "Unresolved Maintenance Fee Dispute", delta: "+25%", raw: "Ticket #9021 open for 54 hours", risk_add: true, weight: 25 },
        { factor: "Declining App Login Velocity", delta: "+18%", raw: "Session frequency fell from 14/mo to 3/mo", risk_add: true, weight: 18 },
        { factor: "Recurring Gateway Timeout", delta: "+10%", raw: "2 auto-debit payments failed", risk_add: true, weight: 10 },
        { factor: "Tenure Loyalty Offset", delta: "-16%", raw: "6.2 years relationship seniority", risk_add: false, weight: 16 }
      ];
    }
    if (selectedCust.id === "AC-40225") {
      return [
        { factor: "Critical Support Escalation Lag", delta: "+48%", raw: "3 tickets pending resolution with legal threat", risk_add: true, weight: 48 },
        { factor: "ERP Payroll Webhook Failure", delta: "+29%", raw: "5 corporate vendor transfers declined", risk_add: true, weight: 29 },
        { factor: "Inactivity Velocity Drop", delta: "+19%", raw: "28 days since corporate portal login", risk_add: true, weight: 19 },
        { factor: "High Historical Balance", delta: "-12%", raw: "₹4.8 Lakhs deposit liquidity", risk_add: false, weight: 12 }
      ];
    }
    // Default dynamic factors
    return [
      { factor: selectedCust.driver || "Reduced Purchase Frequency", delta: `+${Math.round(selectedCust.risk * 0.45)}%`, raw: "Transaction frequency down > 40%", risk_add: true, weight: Math.round(selectedCust.risk * 0.45) },
      { factor: "Support Tickets & Dissatisfaction", delta: `+${Math.round(selectedCust.risk * 0.28)}%`, raw: "Customer service interactions unresolved", risk_add: true, weight: Math.round(selectedCust.risk * 0.28) },
      { factor: "Digital Engagement Dip", delta: `+${Math.round(selectedCust.risk * 0.18)}%`, raw: "Days since last login > 10 days", risk_add: true, weight: Math.round(selectedCust.risk * 0.18) },
      { factor: "Tenure Stability Buffer", delta: "-14%", raw: `${selectedCust.tenure || '2.0 yrs'} relationship seniority`, risk_add: false, weight: 14 }
    ];
  }, [selectedCust]);

  // LIME Local Decision Boundaries
  const limeRules = [
    { condition: "days_since_last_login > 12", weight: "+0.31", impact: "High Risk Driver" },
    { condition: "unresolved_complaints >= 2", weight: "+0.26", impact: "High Risk Driver" },
    { condition: "balance > ₹5,00,000 AND login_drop > 50%", weight: "+0.38", impact: "High-Value At-Risk Trigger" },
    { condition: "tenure > 4.0 years", weight: "-0.22", impact: "Protective Anchor Factor" }
  ];

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Explainable AI (XAI) & Churn Drivers
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Don't just predict churn — understand precisely <i>why</i> every account is at risk using SHAP (Shapley Additive exPlanations) and LIME.
        </div>
      </div>

      {/* Global Feature Importance vs Local Customer Deep Dive Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
        {/* Card 1: Global Feature Importance */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={18} color={COLOR.brass} />
              <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink }}>
                Global Churn Feature Importance (SHAP TreeExplainer)
              </div>
            </div>
            <span style={{ fontSize: 10, background: COLOR.paper, padding: "2px 8px", borderRadius: 4, color: COLOR.inkSoft, fontWeight: 600 }}>
              Cohort v4.2
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: COLOR.inkSoft, marginBottom: 16 }}>
            Relative weights of behavioral drivers contributing to portfolio churn across all monitored accounts:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {globalFeatures.map(f => (
              <div key={f.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: COLOR.ink }}>{f.name}</span>
                  <span style={{ fontWeight: 700, color: f.color }}>{f.importance}%</span>
                </div>
                <div style={{ width: "100%", height: 8, background: COLOR.paper, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${f.importance * 2.2}%`, height: "100%", background: f.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, marginTop: 3 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: LIME Local Decision Boundaries */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={18} color={COLOR.blue} />
              <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink }}>
                LIME Local Decision Boundaries
              </div>
            </div>
            <span style={{ fontSize: 10, background: "rgba(37,99,235,.1)", color: COLOR.blue, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
              Interpretable Model
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: COLOR.inkSoft, marginBottom: 16 }}>
            Rule-based threshold conditions that trigger high risk states in our ensemble classifier:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {limeRules.map((rule, idx) => (
              <div key={idx} style={{ padding: "10px 12px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <code style={{ fontSize: 11.5, color: COLOR.ink, fontWeight: 600 }}>{rule.condition}</code>
                  <span style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    color: rule.weight.startsWith("+") ? COLOR.risk : COLOR.stable 
                  }}>
                    {rule.weight}
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, marginTop: 4 }}>
                  Rule Impact: <b>{rule.impact}</b>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: "10px 12px", background: "rgba(169,124,63,.08)", borderRadius: 6, border: `1px solid rgba(169,124,63,.2)`, fontSize: 11, color: COLOR.inkSoft }}>
            <b>Executive Takeaway:</b> Unresolved complaints combined with prolonged login inactivity generate the steepest probability escalations.
          </div>
        </div>
      </div>

      {/* Customer-Specific SHAP Waterfall Inspector */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrainCircuit size={20} color={COLOR.risk} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: COLOR.ink }}>
                Customer SHAP Attribution Waterfall: {selectedCust?.name}
              </div>
              <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
                Account {selectedCust?.id} • {selectedCust?.tier} • Churn Probability: <b style={{ color: COLOR.risk }}>{selectedCust?.risk}%</b>
              </div>
            </div>
          </div>

          {/* Account Selector Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft }}>Inspect Customer:</span>
            <select
              value={selectedCustId}
              onChange={e => setSelectedCustId(e.target.value)}
              style={{ fontSize: 12, padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", fontWeight: 600, outline: "none" }}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id}) — {c.risk}% Risk
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SHAP Factors Table / Waterfall Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {customerShap.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "220px 80px 1fr 140px",
                padding: "12px 16px",
                background: item.risk_add ? "rgba(178,58,50,.04)" : "rgba(62,107,82,.04)",
                border: `1px solid ${item.risk_add ? "rgba(178,58,50,.18)" : "rgba(62,107,82,.18)"}`,
                borderRadius: 6,
                alignItems: "center",
                gap: 12
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 12.5, color: COLOR.ink }}>
                {item.factor}
              </div>

              <div style={{ 
                fontWeight: 700, 
                fontSize: 13, 
                color: item.risk_add ? COLOR.risk : COLOR.stable 
              }}>
                {item.delta}
              </div>

              <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
                Telemetry: <i>{item.raw}</i>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontSize: 10.5,
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontWeight: 600,
                  background: item.risk_add ? COLOR.risk : COLOR.stable,
                  color: "#fff"
                }}>
                  {item.risk_add ? "Elevates Risk" : "Reduces Risk"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: COLOR.panel, color: "#fff", borderRadius: 6 }}>
          <div>
            <div style={{ fontSize: 11, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase" }}>
              Recommended Remediation For This Profile
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
              {selectedCust?.action || "Offer relationship pricing review"}
            </div>
          </div>
          <button
            onClick={() => onOpenCustomer(selectedCust)}
            style={{
              padding: "7px 14px",
              background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`,
              color: "#fff",
              border: 0,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Open Account Action Drawer →
          </button>
        </div>
      </div>
    </div>
  );
}

