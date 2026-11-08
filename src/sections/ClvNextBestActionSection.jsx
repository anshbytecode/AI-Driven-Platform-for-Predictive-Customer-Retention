import { useState, useMemo } from "react";
import { Target, TrendingUp, Sparkles, Award, ArrowUpRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR, fmtLakh } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function ClvNextBestActionSection({ customers = [], onOpenCustomer }) {
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "AC-40217");

  const selectedCust = useMemo(() => {
    return customers.find(c => c.id === selectedCustId) || customers[0];
  }, [customers, selectedCustId]);

  // Aggregate CLV stats
  const aggregateMetrics = useMemo(() => {
    const totalCurrentClv = customers.reduce((sum, c) => sum + parseFloat(c.current_clv || c.balance * 0.4), 0);
    const totalPredicted12mClv = customers.reduce((sum, c) => sum + parseFloat(c.predicted_12m_clv || c.balance * 0.7), 0);
    const highRiskClvExposure = customers.filter(c => c.risk >= 65).reduce((sum, c) => sum + parseFloat(c.predicted_12m_clv || c.balance * 0.7), 0);

    return {
      current: totalCurrentClv,
      predicted: totalPredicted12mClv,
      growth: totalPredicted12mClv - totalCurrentClv,
      highRiskExposure: highRiskClvExposure
    };
  }, [customers]);

  // Multi-arm uplift treatment comparison for selected customer
  const treatments = useMemo(() => {
    if (!selectedCust) return [];
    const baseRisk = selectedCust.risk;
    const bal = selectedCust.balance;

    return [
      {
        action: "20% Personalized Fee Waiver & Guaranteed Rate Match",
        type: "Direct Financial Concession",
        baseline_churn: `${baseRisk}%`,
        post_treatment_churn: `${Math.max(12, baseRisk - 42)}%`,
        expected_retention: `${Math.min(94, 100 - (baseRisk - 42))}%`,
        expected_revenue_saved: fmtINR(Math.round(bal * 0.08)),
        cost: "₹3,500",
        uplift_prob: "+42% Uplift",
        is_recommended: true,
        channel: "Direct RM Concierge Call"
      },
      {
        action: "Priority RM Support & 24/7 Dedicated Desk",
        type: "Service SLA Upgrade",
        baseline_churn: `${baseRisk}%`,
        post_treatment_churn: `${Math.max(18, baseRisk - 31)}%`,
        expected_retention: `${Math.min(89, 100 - (baseRisk - 31))}%`,
        expected_revenue_saved: fmtINR(Math.round(bal * 0.05)),
        cost: "₹1,800",
        uplift_prob: "+31% Uplift",
        is_recommended: false,
        channel: "Personalized Video Call"
      },
      {
        action: "5,000 Bonus Loyalty Reward Points Booster",
        type: "Loyalty Incentive",
        baseline_churn: `${baseRisk}%`,
        post_treatment_churn: `${Math.max(22, baseRisk - 21)}%`,
        expected_retention: `${Math.min(84, 100 - (baseRisk - 21))}%`,
        expected_revenue_saved: fmtINR(Math.round(bal * 0.03)),
        cost: "₹1,200",
        uplift_prob: "+21% Uplift",
        is_recommended: false,
        channel: "WhatsApp & Mobile App Notification"
      }
    ];
  }, [selectedCust]);

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Customer Lifetime Value (CLV) & Next Best Action
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Uplift treatment-effect modeling: determine which personalized intervention yields the highest retention probability and net saved revenue.
        </div>
      </div>

      {/* Aggregate CLV Banner Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>Current Portfolio CLV</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.ink, fontWeight: 600, marginTop: 4 }}>
            {fmtLakh(aggregateMetrics.current)}
          </div>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 4 }}>Historical realized value</div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>Predicted 12-Month CLV</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.brass, fontWeight: 600, marginTop: 4 }}>
            {fmtLakh(aggregateMetrics.predicted)}
          </div>
          <div style={{ fontSize: 11, color: COLOR.stable, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
            <TrendingUp size={12} /> +{fmtLakh(aggregateMetrics.growth)} expansion potential
          </div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>High-Risk CLV Exposure</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.risk, fontWeight: 600, marginTop: 4 }}>
            {fmtLakh(aggregateMetrics.highRiskExposure)}
          </div>
          <div style={{ fontSize: 11, color: COLOR.risk, marginTop: 4 }}>
            At stake among accounts scoring &gt; 65% risk
          </div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>Uplift Retention Efficiency</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.stable, fontWeight: 600, marginTop: 4 }}>
            78.4%
          </div>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 4 }}>
            Expected recoverable CLV via treatment
          </div>
        </div>
      </div>

      {/* Next Best Action Treatment Engine Deep Dive */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Zap size={20} color={COLOR.brass} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: COLOR.ink }}>
                Next Best Action Recommender for: <b>{selectedCust?.name}</b>
              </div>
              <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
                Current Churn Probability: <b style={{ color: COLOR.risk }}>{selectedCust?.risk}%</b> • Current CLV: {fmtINR(selectedCust?.current_clv || selectedCust?.balance * 0.4)} • Predicted 12M CLV: <b style={{ color: COLOR.brass }}>{fmtINR(selectedCust?.predicted_12m_clv || selectedCust?.balance * 0.7)}</b>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft }}>Select Account:</span>
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

        {/* Treatment Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {treatments.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: t.is_recommended ? "rgba(169,124,63,.06)" : COLOR.paperRaised,
                border: `1.5px solid ${t.is_recommended ? COLOR.brass : COLOR.hair}`,
                borderRadius: 8,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative"
              }}
            >
              {t.is_recommended && (
                <div style={{
                  position: "absolute",
                  top: -10,
                  right: 14,
                  background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 10,
                  boxShadow: "0 2px 6px rgba(169,124,63,.4)"
                }}>
                  ⭐ HIGHEST UPLIFT ACTION
                </div>
              )}

              <div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>
                  {t.type}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: COLOR.ink, marginTop: 4, lineHeight: 1.3 }}>
                  {t.action}
                </div>

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 11.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLOR.inkSoft }}>Baseline Churn:</span>
                    <span style={{ fontWeight: 700, color: COLOR.risk }}>{t.baseline_churn}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLOR.inkSoft }}>Post-Treatment Churn:</span>
                    <span style={{ fontWeight: 700, color: COLOR.stable }}>{t.post_treatment_churn}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLOR.inkSoft }}>Expected Retention:</span>
                    <span style={{ fontWeight: 700, color: COLOR.ink }}>{t.expected_retention}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLOR.inkSoft }}>Expected Revenue Saved:</span>
                    <span style={{ fontWeight: 700, color: COLOR.brass }}>{t.expected_revenue_saved}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLOR.inkSoft }}>Execution Cost:</span>
                    <span style={{ fontWeight: 600, color: COLOR.ink }}>{t.cost}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${COLOR.hair}` }}>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, marginBottom: 8 }}>
                  Channel: <b>{t.channel}</b>
                </div>
                <button
                  onClick={() => onOpenCustomer(selectedCust)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    background: t.is_recommended ? COLOR.ink : "#fff",
                    color: t.is_recommended ? "#fff" : COLOR.ink,
                    border: `1px solid ${t.is_recommended ? COLOR.ink : COLOR.hair}`,
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {t.is_recommended ? "Deploy Recommended Action" : "Deploy Alternative"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

