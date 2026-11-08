import { useState, useMemo } from "react";
import { Users, AlertTriangle, ArrowRight, Activity, TrendingDown, Clock, ShieldCheck, Filter } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR, fmtLakh } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function SegmentationEarlyWarningSection({ customers = [], onOpenCustomer }) {
  const [activeTab, setActiveTab] = useState("segmentation"); // 'segmentation' or 'early_warning'
  const [selectedSegment, setSelectedSegment] = useState("all");

  // 9 Segment definitions
  const segments = [
    { id: "High-value/high-risk", label: "High-Value / High-Risk", color: "#9C27B0", desc: "Balance > ₹5 Lakhs AND risk > 75% — priority intervention" },
    { id: "VIP", label: "VIP Private Wealth", color: "#6A5ACD", desc: "Top 5% balance, long tenure, private banking anchor clients" },
    { id: "Loyal", label: "Loyal Champions", color: "#2E7D32", desc: "Consistently active, low risk, high NPS scores" },
    { id: "Regular", label: "Regular Retail", color: "#1976D2", desc: "Standard transaction patterns, steady balances" },
    { id: "New", label: "New Onboarding", color: "#00ACC1", desc: "Onboarded within last 12 months, developing habits" },
    { id: "Price-sensitive", label: "Price-Sensitive", color: "#F57C00", desc: "High sensitivity to fees, competitor rate comparisons" },
    { id: "At-risk", label: "At-Risk Escalation", color: "#E65100", desc: "Elevated risk score (65-80%), disengagement signals" },
    { id: "Dormant", label: "Dormant Inactive", color: "#78909C", desc: "No activity in past 30+ days, zero login frequency" },
    { id: "Lost", label: "Lost / Closed", color: "#C62828", desc: "Account closure initiated or critical risk > 85%" },
  ];

  // Early Warning System Pipeline Stages
  const pipelineStages = [
    {
      stage: "Normal",
      count: customers.filter(c => c.early_warning_stage === "Normal" || (!c.early_warning_stage && c.risk < 35)).length,
      color: "#2E7D32",
      signals: ["Login frequency > 12/mo", "Cart checkout > 85%", "Zero unresolved complaints", "Nominal session length (8-14m)"],
      action: "Maintain standard nurturing & relationship cadence"
    },
    {
      stage: "Engagement declining",
      count: customers.filter(c => c.early_warning_stage === "Engagement declining").length,
      color: "#00ACC1",
      signals: ["Login frequency down 30-50%", "Session duration dropped < 3m", "Cart abandonment up 2x", "No app opens in 14 days"],
      action: "Trigger automated in-app re-engagement & welcome cashback"
    },
    {
      stage: "At-risk",
      count: customers.filter(c => c.early_warning_stage === "At-risk" || (!c.early_warning_stage && c.risk >= 65 && c.risk < 80)).length,
      color: "#F57C00",
      signals: ["Competitor card/deposit offers clicked", "Support ticket open > 36 hrs", "1st payment gateway failure", "Transaction velocity down 40%"],
      action: "Proactive RM outreach call & fee waiver concession"
    },
    {
      stage: "Critical",
      count: customers.filter(c => c.early_warning_stage === "Critical" || (!c.early_warning_stage && c.risk >= 80)).length,
      color: "#C62828",
      signals: ["Repeated gateway failures (3+)", "Threatened account closure in support chat", "Large balance withdrawal (>30%)", "3+ unresolved complaints"],
      action: "Emergency Senior RM Personal Intervention + Full Concession"
    },
    {
      stage: "Churn",
      count: customers.filter(c => c.early_warning_stage === "Churn" || c.status === "Pending Cancellation").length,
      color: "#4A148C",
      signals: ["Account closure drafted", "Balance drawn to zero", "Direct debit cancelled by customer"],
      action: "Win-back exit interview & special reactivation package"
    }
  ];

  // Filter customers by selected segment
  const displayCustomers = useMemo(() => {
    if (selectedSegment === "all") return customers;
    return customers.filter(c => c.segment === selectedSegment);
  }, [customers, selectedSegment]);

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header & Mode Switcher */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
            Segmentation & Early Warning Radar
          </div>
          <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
            Multi-dimensional K-Means clustering and predictive behavioral progression tracking before actual churn.
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: "flex", background: COLOR.paper, padding: 3, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
          <button
            onClick={() => setActiveTab("segmentation")}
            style={{
              padding: "7px 14px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: 0,
              background: activeTab === "segmentation" ? "#fff" : "transparent",
              color: activeTab === "segmentation" ? COLOR.ink : COLOR.inkSoft,
              boxShadow: activeTab === "segmentation" ? "0 2px 4px rgba(0,0,0,.08)" : "none"
            }}
          >
            K-Means 9 Customer Segments
          </button>
          <button
            onClick={() => setActiveTab("early_warning")}
            style={{
              padding: "7px 14px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: 0,
              background: activeTab === "early_warning" ? "#fff" : "transparent",
              color: activeTab === "early_warning" ? COLOR.ink : COLOR.inkSoft,
              boxShadow: activeTab === "early_warning" ? "0 2px 4px rgba(0,0,0,.08)" : "none"
            }}
          >
            Early Warning Progression Pipeline
          </button>
        </div>
      </div>

      {/* VIEW 1: SEGMENTATION MATRIX */}
      {activeTab === "segmentation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Segment Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {segments.map(s => {
              const segCusts = customers.filter(c => c.segment === s.id);
              const totalBal = segCusts.reduce((sum, c) => sum + parseFloat(c.balance || 0), 0);
              const avgRisk = segCusts.length ? Math.round(segCusts.reduce((sum, c) => sum + c.risk, 0) / segCusts.length) : 0;
              const isSelected = selectedSegment === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSegment(isSelected ? "all" : s.id)}
                  style={{
                    background: "#fff",
                    border: `1px solid ${isSelected ? s.color : COLOR.hair}`,
                    borderTop: `4px solid ${s.color}`,
                    borderRadius: 8,
                    padding: 16,
                    cursor: "pointer",
                    boxShadow: isSelected ? `0 4px 16px ${s.color}25` : "0 2px 6px rgba(0,0,0,.03)",
                    transition: "all .15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: COLOR.ink }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 4, minHeight: 32 }}>{s.desc}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: `${s.color}18`, color: s.color, padding: "2px 8px", borderRadius: 10 }}>
                      {segCusts.length} accounts
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLOR.hair}`, fontSize: 11.5 }}>
                    <div>
                      <div style={{ color: COLOR.inkSoft }}>Total Balance</div>
                      <div style={{ fontWeight: 700, color: COLOR.ink, marginTop: 1 }}>{fmtLakh(totalBal)}</div>
                    </div>
                    <div>
                      <div style={{ color: COLOR.inkSoft }}>Avg Churn Risk</div>
                      <div style={{ fontWeight: 700, color: avgRisk >= 65 ? COLOR.risk : avgRisk >= 35 ? COLOR.mid : COLOR.stable, marginTop: 1 }}>
                        {avgRisk}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Customer Drill-Down Table */}
          <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink }}>
                Segment Drill-Down: {selectedSegment === "all" ? "All Monitored Accounts" : selectedSegment}
              </div>
              {selectedSegment !== "all" && (
                <button
                  onClick={() => setSelectedSegment("all")}
                  style={{ fontSize: 11, color: COLOR.brass, background: "transparent", border: 0, cursor: "pointer", fontWeight: 600 }}
                >
                  Show All Segments
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {displayCustomers.map(c => (
                <div
                  key={c.id}
                  onClick={() => onOpenCustomer(c)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: COLOR.paperRaised,
                    borderRadius: 6,
                    border: `1px solid ${COLOR.hair}`,
                    cursor: "pointer",
                    fontSize: 12
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: COLOR.ink }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: COLOR.inkSoft, marginLeft: 8 }}>({c.id}) • {c.tier}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontWeight: 600, color: COLOR.ink }}>{fmtINR(c.balance)}</span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: c.risk >= 65 ? COLOR.risk : c.risk >= 35 ? COLOR.mid : COLOR.stable 
                    }}>
                      {c.risk}% Risk
                    </span>
                    <ArrowRight size={14} color={COLOR.inkSoft} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EARLY WARNING PROGRESSION PIPELINE */}
      {activeTab === "early_warning" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Progression Flow Chart */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(5, 1fr)", 
            gap: 12, 
            background: "#fff", 
            border: `1px solid ${COLOR.hair}`, 
            borderRadius: 8, 
            padding: 16 
          }}>
            {pipelineStages.map((ps, idx) => (
              <div
                key={ps.stage}
                style={{
                  background: COLOR.paperRaised,
                  border: `1px solid ${COLOR.hair}`,
                  borderTop: `4px solid ${ps.color}`,
                  borderRadius: 6,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700 }}>STAGE {idx + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: ps.color }}>{ps.count}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: COLOR.ink, marginTop: 4 }}>
                    {ps.stage}
                  </div>

                  <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 10 }}>
                    <b>Key Telemetry Signals:</b>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {ps.signals.map((sig, sIdx) => (
                        <li key={sIdx} style={{ fontSize: 10.5, marginBottom: 2 }}>{sig}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${COLOR.hair}`, fontSize: 10.5, color: COLOR.ink, fontWeight: 600 }}>
                  ⚡ <b>Action:</b> {ps.action}
                </div>
              </div>
            ))}
          </div>

          {/* Active At-Risk & Critical Accounts Warning Feed */}
          <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <AlertTriangle size={18} color={COLOR.risk} />
              <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink }}>
                Active Early Warning Alert Triggers (Requiring Immediate Intervention)
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {customers.filter(c => c.risk >= 65).map(c => (
                <div
                  key={c.id}
                  onClick={() => onOpenCustomer(c)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 140px 1fr 140px 100px",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "rgba(178,58,50,.04)",
                    border: `1px solid rgba(178,58,50,.18)`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: COLOR.ink }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{c.id} • {c.tier}</div>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: COLOR.risk, color: "#fff" }}>
                      Stage: {c.early_warning_stage || "Critical"}
                    </span>
                  </div>

                  <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
                    Primary Signal: <b style={{ color: COLOR.ink }}>{c.driver}</b>
                  </div>

                  <div style={{ fontWeight: 700, color: COLOR.risk, fontSize: 13 }}>
                    {c.risk}% Risk
                  </div>

                  <button
                    style={{
                      padding: "5px 10px",
                      background: COLOR.ink,
                      color: "#fff",
                      border: 0,
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Remediate →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

