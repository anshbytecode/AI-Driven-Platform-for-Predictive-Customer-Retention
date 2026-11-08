import { useState } from "react";
import { 
  Target, Award, TrendingUp, DollarSign, AlertCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap 
} from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function RetentionOpportunitySection({ customers = [], onOpenCustomer, showToast }) {
  // Uplift Modeling & Retention Opportunity Profiles (Req 10 & 33)
  const opportunityProfiles = [
    {
      customer_id: "AC-40217",
      name: "Priya Kulkarni",
      tier: "Private Banking",
      balance: 842000,
      churn_risk: 88,
      proposed_treatment: "20% Fee Waiver + 7.45% Deposit Rate Match",
      treatment_cost: "₹3,500",
      uplift_effect: "+35% Retention",
      post_treatment_risk: "53%",
      expected_roi: "810%",
      opportunity_score: 94, // Churn prob * value * effectiveness * ROI
      verdict: "⭐ High-Priority Intervention (Worth Saving)",
      should_treat: true,
      recovery_status: "Offer Accepted",
      recovery_prob: 82
    },
    {
      customer_id: "AC-40218",
      name: "Rohan Mehta",
      tier: "Retail — Premier",
      balance: 118500,
      churn_risk: 81,
      proposed_treatment: "Annual Card Fee Waiver + 15% Dining Points",
      treatment_cost: "₹1,800",
      uplift_effect: "+28% Retention",
      post_treatment_risk: "53%",
      expected_roi: "570%",
      opportunity_score: 86,
      verdict: "⭐ High-Priority Intervention (Worth Saving)",
      should_treat: true,
      recovery_status: "First Re-purchase",
      recovery_prob: 79
    },
    {
      customer_id: "AC-40226",
      name: "Nikhil Bansal",
      tier: "Retail — Standard",
      balance: 18200,
      churn_risk: 84,
      proposed_treatment: "20% Retention Concession",
      treatment_cost: "₹1,500",
      uplift_effect: "+3% Retention (Near Zero Lift)",
      post_treatment_risk: "81%",
      expected_roi: "15%",
      opportunity_score: 18,
      verdict: "❌ DO NOT TREAT: Low Uplift + Suspicious Refunds",
      should_treat: false,
      recovery_status: "Unreached",
      recovery_prob: 32
    }
  ];

  // Campaign ROI Predictor (Req 11)
  const campaignRoiPredictions = [
    {
      name: "Private Wealth High-Yield Parity Sprint",
      cost: "₹5.0 Lakhs",
      expected_customers: "1,200",
      expected_retention_lift: "+14.5%",
      expected_revenue_saved: "₹18.4 Lakhs",
      projected_roi: "268%",
      recommendation: "Top Recommended Campaign"
    },
    {
      name: "Premier Card Annual Fee Waiver Sequence",
      cost: "₹2.5 Lakhs",
      expected_customers: "3,500",
      expected_retention_lift: "+11.2%",
      expected_revenue_saved: "₹7.2 Lakhs",
      projected_roi: "188%",
      recommendation: "Secondary Campaign"
    }
  ];

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Retention Opportunity Score & Uplift Modeling ⭐⭐⭐
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Don't just ask <i>"Who will churn?"</i>. Ask: <b>"Who can actually be saved?"</b> and <b>"Who is worth saving?"</b>.
        </div>
      </div>

      {/* Formula Explanation Card (Req 33) */}
      <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 11, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em" }}>
          Retention Opportunity Score Formula ⭐
        </div>
        <div style={{ fontFamily: "IBM Plex Mono", fontSize: 14, color: "#F3F1E9", marginTop: 6 }}>
          Retention Opportunity = Churn Probability × Customer Value × Intervention Effectiveness × Expected ROI
        </div>
        <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 4 }}>
          Prevents companies from wasting retention money on stubborn churners or accounts with near-zero uplift.
        </div>
      </div>

      {/* Uplift Treatment Comparison Table (Req 10 & 33) */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
          Individual Uplift Modeling & Intervention Eligibility
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {opportunityProfiles.map(p => (
            <div
              key={p.customer_id}
              style={{
                padding: "16px 18px",
                background: p.should_treat ? "rgba(62,107,82,.04)" : "rgba(178,58,50,.04)",
                border: `1.5px solid ${p.should_treat ? "rgba(62,107,82,.25)" : "rgba(178,58,50,.25)"}`,
                borderRadius: 8,
                display: "grid",
                gridTemplateColumns: "180px 1fr 140px 160px",
                alignItems: "center",
                gap: 16
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: COLOR.ink }}>{p.name}</div>
                <div style={{ fontSize: 11, color: COLOR.inkSoft }}>{p.customer_id} • {p.tier}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.ink, marginTop: 4 }}>
                  Balance: {fmtINR(p.balance)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>
                  Treatment: {p.proposed_treatment}
                </div>
                <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 3 }}>
                  Cost: <b>{p.treatment_cost}</b> • Post-Treatment Churn: <b>{p.post_treatment_risk}</b>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.should_treat ? COLOR.stable : COLOR.risk, marginTop: 4 }}>
                  {p.verdict}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>UPLIFT EFFECT</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: p.should_treat ? COLOR.stable : COLOR.risk, marginTop: 2 }}>
                  {p.uplift_effect}
                </div>
                <div style={{ fontSize: 10.5, color: COLOR.brass, fontWeight: 600, marginTop: 2 }}>
                  ROI: {p.expected_roi}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>OPPORTUNITY SCORE</div>
                <div style={{ fontFamily: "Fraunces", fontSize: 24, fontWeight: 700, color: p.opportunity_score >= 80 ? COLOR.stable : COLOR.risk }}>
                  {p.opportunity_score}<span style={{ fontSize: 12, color: COLOR.inkSoft }}>/100</span>
                </div>
                <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>
                  Recovery: <b>{p.recovery_status}</b> ({p.recovery_prob}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Retention ROI Predictor (Req 11) */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
          Pre-Launch Retention Campaign ROI Predictor ⭐ (Req 11)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {campaignRoiPredictions.map(c => (
            <div key={c.name} style={{ background: COLOR.paperRaised, padding: 16, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: COLOR.ink }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: COLOR.brass, fontWeight: 600, marginTop: 2 }}>{c.recommendation}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: "rgba(62,107,82,.1)", color: COLOR.stable }}>
                  ROI {c.projected_roi}
                </span>
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11.5 }}>
                <div>Campaign Cost: <b>{c.cost}</b></div>
                <div>Target Customers: <b>{c.expected_customers}</b></div>
                <div>Expected Retention Lift: <b style={{ color: COLOR.stable }}>{c.expected_retention_lift}</b></div>
                <div>Expected Revenue Saved: <b style={{ color: COLOR.brass }}>{c.expected_revenue_saved}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

