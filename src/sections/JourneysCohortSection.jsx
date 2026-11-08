import { useState } from "react";
import { 
  GitBranch, Users, Calendar, ArrowRight, CheckCircle2, 
  AlertTriangle, Filter, Layers, Zap, ExternalLink 
} from "lucide-react";
import { COLOR } from "../constants/theme";

export default function JourneysCohortSection({ onOpenCustomer }) {
  const [activeTab, setActiveTab] = useState("journey"); // 'journey', 'cohorts', 'clustering'

  // Visual Lifecycle Journey Steps (Req 22)
  const journeyWorkflowSteps = [
    { num: 1, title: "Customer Signup & KYC", desc: "Digital account onboarding sequence", status: "Active (12k enrolled)" },
    { num: 2, title: "Engagement Tracking", desc: "Monitored 24/7 for balance drop & rate shopping", status: "Telemetry Feed" },
    { num: 3, title: "Early Warning Detected", desc: "Purchase freq drop > 35% or session fall", status: "Alert Trigger" },
    { num: 4, title: "Churn Prediction Model", desc: "Ensemble v4.2 predicts 84% churn risk", status: "ML Scoring" },
    { num: 5, title: "Next Best Action Selection", desc: "Uplift model chooses 20% Fee Waiver + Concierge", status: "Treatment Selection" },
    { num: 6, title: "Send-Time Optimized Offer", desc: "Dispatched via WhatsApp at Friday 7:40 PM", status: "Omnichannel Dispatch" },
    { num: 7, title: "Customer Response", desc: "Offer opened and accepted by client", status: "Interaction Logged" },
    { num: 8, title: "Retention Measurement", desc: "Recovery verified; Churn risk drops to 18%", status: "Closed-Loop Feedback" }
  ];

  // Customer Journey Funnel Stages (Req 25)
  const journeyStagesFunnel = [
    { stage: "Acquisition", count: 12000, conversion: "100%", drop_pct: "0%" },
    { stage: "Signup & KYC", count: 9800, conversion: "81.6%", drop_pct: "18.4%" },
    { stage: "Activation / Initial Deposit", count: 7200, conversion: "73.4%", drop_pct: "26.6%" },
    { stage: "First Repeat Transaction", count: 5400, conversion: "75.0%", drop_pct: "25.0%" },
    { stage: "Loyalty & Cross-Sell", count: 3900, conversion: "72.2%", drop_pct: "27.8%" },
    { stage: "Disengagement / Churn Risk", count: 1250, conversion: "32.0%", drop_pct: "68.0%" }
  ];

  // Cohort Analysis Matrix (Req 24)
  const cohortRows = [
    { cohort: "Jan 2026", size: "1,450", d1: "100%", d7: "88.4%", d30: "78.2%", d60: "71.0%", d90: "66.5%" },
    { cohort: "Feb 2026", size: "1,620", d1: "100%", d7: "89.1%", d30: "79.5%", d60: "73.2%", d90: "68.0%" },
    { cohort: "Mar 2026", size: "1,890", d1: "100%", d7: "91.2%", d30: "82.4%", d60: "76.8%", d90: "72.1%" },
    { cohort: "Apr 2026", size: "2,100", d1: "100%", d7: "87.5%", d30: "76.0%", d60: "70.2%", d90: "—" },
    { cohort: "May 2026", size: "2,350", d1: "100%", d7: "92.0%", d30: "84.1%", d60: "—", d90: "—" },
    { cohort: "Jun 2026", size: "2,540", d1: "100%", d7: "93.4%", d30: "—", d60: "—", d90: "—" }
  ];

  // Churn Reason Clusters (Req 26)
  const reasonClusters = [
    { name: "Cluster 1: Price-Sensitive Rate Shoppers", pct: "34%", desc: "Comparing rival FD rates > 7.4% and annual maintenance fees", action: "Deploy automated rate match playbook" },
    { name: "Cluster 2: Poor Support Experience", pct: "26%", desc: "Tickets unresolved > 48h and long wait times on customer service", action: "Route to Priority Dedicated RM Concierge" },
    { name: "Cluster 3: Low Digital Engagement", pct: "22%", desc: "Session length dropped below 2m and no logins in past 14 days", action: "Send personalized onboarding nudge & cashback" },
    { name: "Cluster 4: Product Mismatch / Inactivity", pct: "18%", desc: "No linked salary account and zero investment cross-sell", action: "Schedule portfolio rebalance meeting" }
  ];

  // Competitor Switching Intent (Req 27)
  const switchingIntentPhrases = [
    { phrase: "Competitor ICICI offering 7.6% on 1-year FD", customer: "Priya Kulkarni (AC-40217)", risk_boost: "+18%", channel: "Support Ticket #9021" },
    { phrase: "Applying for ICICI Sapphiro card with lounge access", customer: "Rohan Mehta (AC-40218)", risk_boost: "+14%", channel: "Partner Click Telemetry" },
    { phrase: "Closing corporate banking mandate due to ERP webhook downtime", customer: "Kavita Pillai (AC-40225)", risk_boost: "+24%", channel: "Executive Email Escalation" }
  ];

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
            Automated Retention Journeys, Cohort Analytics & Switching Intent
          </div>
          <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
            Lifecycle workflow orchestration, Day 1–90 cohort retention heatmaps, and NLP competitor switching detection.
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: "flex", background: COLOR.paper, padding: 3, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
          {[
            { id: "journey", label: "Automated Journey Flow" },
            { id: "cohorts", label: "Cohort Retention Matrix" },
            { id: "clustering", label: "Reason Clusters & Switching Intent" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: 0,
                background: activeTab === t.id ? "#fff" : "transparent",
                color: activeTab === t.id ? COLOR.ink : COLOR.inkSoft,
                boxShadow: activeTab === t.id ? "0 2px 4px rgba(0,0,0,.08)" : "none"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: AUTOMATED RETENTION JOURNEY & FUNNEL (Req 22 & 25) */}
      {activeTab === "journey" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Visual Workflow Builder Grid (Req 22) */}
          <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <GitBranch size={18} color={COLOR.brass} />
              Automated Retention Journey: 8-Step Lifecycle Flow ⭐ (Req 22)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {journeyWorkflowSteps.map(step => (
                <div key={step.num} style={{ background: COLOR.paperRaised, padding: 14, borderRadius: 6, border: `1px solid ${COLOR.hair}`, position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: COLOR.brass, textTransform: "uppercase" }}>STEP {step.num}</span>
                    <span style={{ fontSize: 9.5, padding: "1px 6px", borderRadius: 4, background: COLOR.paper, color: COLOR.inkSoft }}>{step.status}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: COLOR.ink, marginTop: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 4 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Journey Funnel Stages (Req 25) */}
          <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
              Customer Journey Funnel & Stage Drop-Off Analysis (Req 25)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
              {journeyStagesFunnel.map((stage, idx) => (
                <div key={stage.stage} style={{ background: COLOR.paperRaised, padding: 12, borderRadius: 6, border: `1px solid ${COLOR.hair}`, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: COLOR.inkSoft, fontWeight: 700 }}>STAGE {idx + 1}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: COLOR.ink, marginTop: 2, minHeight: 32 }}>{stage.stage}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLOR.ink, marginTop: 4 }}>{stage.count.toLocaleString()}</div>
                  <div style={{ fontSize: 10.5, color: COLOR.stable, fontWeight: 600, marginTop: 2 }}>{stage.conversion} conv</div>
                  {idx > 0 && <div style={{ fontSize: 9.5, color: COLOR.risk, marginTop: 1 }}>-{stage.drop_pct} drop</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COHORT ANALYSIS MATRIX (Req 24) */}
      {activeTab === "cohorts" && (
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
            Cohort Retention Matrix (Day 1, 7, 30, 60, 90) ⭐ (Req 24)
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: COLOR.paperRaised, borderBottom: `1px solid ${COLOR.hair}`, textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Cohort</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Size</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Day 1</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Day 7</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Day 30</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Day 60</th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: COLOR.inkSoft }}>Day 90</th>
                </tr>
              </thead>
              <tbody>
                {cohortRows.map(row => (
                  <tr key={row.cohort} style={{ borderBottom: `1px solid ${COLOR.hair}` }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: COLOR.ink }}>{row.cohort}</td>
                    <td style={{ padding: "12px 14px", color: COLOR.inkSoft }}>{row.size}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: COLOR.stable }}>{row.d1}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: COLOR.stable }}>{row.d7}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: COLOR.brass }}>{row.d30}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: COLOR.brass }}>{row.d60}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: COLOR.ink }}>{row.d90}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHURN REASON CLUSTERING & SWITCHING INTENT (Req 26 & 27) */}
      {activeTab === "clustering" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Unsupervised Reason Clusters (Req 26) */}
          <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
              Unsupervised Churn Reason Clustering (ML Discovered Patterns) (Req 26)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {reasonClusters.map(rc => (
                <div key={rc.name} style={{ background: COLOR.paperRaised, padding: 14, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: COLOR.ink }}>{rc.name}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: COLOR.brass }}>{rc.pct} of Churn</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: COLOR.inkSoft, marginTop: 4 }}>{rc.desc}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.stable, marginTop: 8 }}>
                    ⚡ <b>Recommended Policy:</b> {rc.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Switching Intent Detector (Req 27) */}
          <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} color={COLOR.risk} />
                <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink }}>
                  Competitor / Switching Intent Detection ⭐ (Req 27)
                </div>
              </div>
              <span style={{ fontSize: 11, color: COLOR.risk, fontWeight: 700 }}>
                {switchingIntentPhrases.length} Accounts Actively Comparing Competitors
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {switchingIntentPhrases.map((sip, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    background: "rgba(178,58,50,.04)",
                    border: `1px solid rgba(178,58,50,.2)`,
                    borderRadius: 6,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: COLOR.ink }}>
                      "{sip.phrase}"
                    </div>
                    <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 2 }}>
                      Account: <b>{sip.customer}</b> • Channel: <i>{sip.channel}</i>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: COLOR.risk }}>
                      {sip.risk_boost} Immediate Risk Surge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

