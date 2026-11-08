import { useState } from "react";
import { 
  ShieldAlert, Activity, TrendingUp, AlertTriangle, 
  DollarSign, Users, Award, Sliders, CheckCircle2, ArrowRight 
} from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR, fmtLakh } from "../utils/helpers";

export default function CommandCenterSection({ customers = [], onSelectSection, onOpenCustomer }) {
  // Macro Strategy Simulator State (Req 37.15)
  const [macroReductionPct, setMacroReductionPct] = useState(10);

  const totalAccounts = 8420;
  const criticalAccounts = 1248;
  const atRiskAccounts = 4821;
  const portfolioClv = 1420000000; // ₹142 Cr
  const totalRevenueAtRisk = 487000000; // ₹48.7 Cr
  const recoverableRevenue = 213000000; // ₹21.3 Cr

  // Macro Strategy Simulator Calculation (Req 37.15)
  const simCustomersSaved = Math.round(totalAccounts * (macroReductionPct / 100));
  const simRevenueRecovered = Math.round(totalRevenueAtRisk * (macroReductionPct / 100) * 0.78);
  const simCampaignCost = Math.round(simRevenueRecovered * 0.08);
  const simNetProfit = simRevenueRecovered - simCampaignCost;
  const simRoiPct = Math.round((simNetProfit / simCampaignCost) * 100);

  const predictiveAlerts = [
    { id: 1, type: "critical", text: "🔴 1,248 high-risk accounts detected in Q3 cohort (< 14-day churn window)", section: "Customer 360" },
    { id: 2, type: "warning", text: "🟠 4,821 accounts showing declining engagement (> 40% drop in session duration)", section: "Segmentation" },
    { id: 3, type: "revenue", text: "💰 ₹48.7 Cr aggregate revenue at risk across Private Banking & Business accounts", section: "CLV & Next Best Action" },
    { id: 4, type: "escalation", text: "⚠️ Premier customer churn intention increased 18% following ICICI Sapphiro card campaign", section: "NLP Sentiment" }
  ];

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Retention Command Center & Predictive Alerts
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Unified executive control tower monitoring real-time portfolio health, revenue-at-risk exposure, and macro retention simulations.
        </div>
      </div>

      {/* Live Predictive Alerts Banner (Req 30) */}
      <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: "14px 20px" }}>
        <div style={{ fontSize: 10.5, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
          Predictive Risk Alerts (Real-Time Telemetry)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {predictiveAlerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => onSelectSection(alert.section)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: COLOR.panelSoft,
                borderRadius: 6,
                border: `1px solid ${COLOR.hairDark}`,
                cursor: "pointer",
                fontSize: 12
              }}
            >
              <span style={{ color: "#F3F1E9" }}>{alert.text}</span>
              <span style={{ color: COLOR.brassLight, fontWeight: 600, fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                Inspect →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Command Center 10-Metric Grid (Req 31) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {[
          { label: "Total Customers", val: "8,420", desc: "Monitored accounts", color: COLOR.ink },
          { label: "Active Customers", val: "7,172", desc: "Healthy engagement", color: COLOR.stable },
          { label: "At-Risk Customers", val: "4,821", desc: "Score 65–79%", color: COLOR.mid },
          { label: "Critical Customers", val: "1,248", desc: "Window < 14 days", color: COLOR.risk },
          { label: "Predicted Churn", val: "14.2%", desc: "Cohort forecast", color: COLOR.risk },
          { label: "Revenue at Risk", val: "₹48.7 Cr", desc: "Total exposure", color: COLOR.brass },
          { label: "Recoverable Revenue", val: "₹21.3 Cr", desc: "Estimated via playbooks", color: COLOR.stable },
          { label: "Portfolio CLV", val: "₹142.0 Cr", desc: "Predicted 12M value", color: COLOR.ink },
          { label: "Retention Rate", val: "84.2%", desc: "Trailed 90 days", color: COLOR.stable },
          { label: "Campaign ROI", val: "570%", desc: "Average return", color: COLOR.blue }
        ].map(m => (
          <div key={m.label} style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>{m.label}</div>
            <div style={{ fontFamily: "Fraunces", fontSize: 20, fontWeight: 700, color: m.color, marginTop: 4 }}>
              {m.val}
            </div>
            <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Macro Retention Strategy Simulator (Req 37.15) */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sliders size={18} color={COLOR.brass} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLOR.ink }}>
                Macro Retention Strategy Simulator ⭐
              </div>
              <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
                Executive scenario planning: "What if we reduce customer churn by <b>{macroReductionPct}%</b>?"
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>Churn Reduction Target:</span>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={macroReductionPct}
              onChange={e => setMacroReductionPct(parseInt(e.target.value, 10))}
              style={{ width: 140, accentColor: COLOR.brass, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLOR.brass }}>{macroReductionPct}%</span>
          </div>
        </div>

        {/* Calculated Projection Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          <div style={{ padding: "14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
            <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>CUSTOMERS SAVED</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.ink, marginTop: 4 }}>
              {simCustomersSaved.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: COLOR.inkSoft }}>Accounts preserved</div>
          </div>

          <div style={{ padding: "14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
            <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>REVENUE RECOVERED</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.brass, marginTop: 4 }}>
              ₹{(simRevenueRecovered / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: 10, color: COLOR.inkSoft }}>Preserved portfolio funds</div>
          </div>

          <div style={{ padding: "14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
            <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>ESTIMATED CAMPAIGN COST</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.inkSoft, marginTop: 4 }}>
              ₹{(simCampaignCost / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: 10, color: COLOR.inkSoft }}>Incentives & RM time</div>
          </div>

          <div style={{ padding: "14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
            <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>NET FINANCIAL PROFIT</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.stable, marginTop: 4 }}>
              ₹{(simNetProfit / 10000000).toFixed(2)} Cr
            </div>
            <div style={{ fontSize: 10, color: COLOR.stable, fontWeight: 700 }}>Net bottom line increase</div>
          </div>

          <div style={{ padding: "14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
            <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>PROJECTED CAMPAIGN ROI</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.blue, marginTop: 4 }}>
              {simRoiPct}%
            </div>
            <div style={{ fontSize: 10, color: COLOR.blue, fontWeight: 700 }}>Highly viable initiative</div>
          </div>
        </div>
      </div>
    </div>
  );
}

