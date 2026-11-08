import { useState, useMemo } from "react";
import { Sliders, RotateCcw, ArrowRight, Sparkles, TrendingDown, DollarSign, Check, Percent } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import SignalDial from "../components/ui/SignalDial";

export default function WhatIfSimulatorSection({ customers = [], onOpenCustomer }) {
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "AC-40217");
  
  // Interactive Simulation Controls
  const [discountPct, setDiscountPct] = useState(20);
  const [prioritySupport, setPrioritySupport] = useState(true);
  const [loyaltyBonusPts, setLoyaltyBonusPts] = useState(2500);
  const [feeWaiver, setFeeWaiver] = useState(true);

  const selectedCust = useMemo(() => {
    return customers.find(c => c.id === selectedCustId) || customers[0];
  }, [customers, selectedCustId]);

  // Dynamic simulation calculus
  const simulationResults = useMemo(() => {
    if (!selectedCust) return {};
    const baseChurn = selectedCust.risk;
    const bal = parseFloat(selectedCust.balance || 100000);

    let riskReduction = 0;
    riskReduction += Math.min(32, discountPct * 1.6);
    if (prioritySupport) riskReduction += 15;
    if (loyaltyBonusPts > 0) riskReduction += Math.min(16, (loyaltyBonusPts / 1000) * 3.2);
    if (feeWaiver) riskReduction += 12;

    const afterChurn = Math.max(8, Math.round(baseChurn - riskReduction));
    const churnDropDelta = baseChurn - afterChurn;
    const estSavedRevenue = Math.round((bal * churnDropDelta) / 100);
    const campaignCost = Math.round(
      bal * (discountPct / 100) * 0.12 + 
      (prioritySupport ? 2200 : 0) + 
      (loyaltyBonusPts * 0.4) + 
      (feeWaiver ? 1500 : 0)
    );
    const netRoi = campaignCost > 0 ? Math.round(((estSavedRevenue - campaignCost) / campaignCost) * 100) : 520;

    return {
      beforeChurn: baseChurn,
      afterChurn,
      churnDropDelta,
      estSavedRevenue,
      campaignCost,
      netRoi
    };
  }, [selectedCust, discountPct, prioritySupport, loyaltyBonusPts, feeWaiver]);

  const applyPreset = (preset) => {
    if (preset === "standard") {
      setDiscountPct(10);
      setPrioritySupport(false);
      setLoyaltyBonusPts(1000);
      setFeeWaiver(false);
    } else if (preset === "aggressive") {
      setDiscountPct(20);
      setPrioritySupport(true);
      setLoyaltyBonusPts(5000);
      setFeeWaiver(true);
    } else if (preset === "service") {
      setDiscountPct(0);
      setPrioritySupport(true);
      setLoyaltyBonusPts(2500);
      setFeeWaiver(true);
    }
  };

  const resetSimulation = () => {
    setDiscountPct(20);
    setPrioritySupport(true);
    setLoyaltyBonusPts(2500);
    setFeeWaiver(true);
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          What-If Retention Simulator & Policy Sandbox
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Simulate the impact of proposed pricing discounts, priority support escalations, and fee waivers on customer retention probability.
        </div>
      </div>

      {/* Simulator Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 20 }}>
        {/* Controls Column */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, display: "flex", alignItems: "center", gap: 6 }}>
              <Sliders size={16} color={COLOR.brass} /> Intervention Levers
            </div>
            <button
              onClick={resetSimulation}
              style={{ fontSize: 11, color: COLOR.inkSoft, background: "transparent", border: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Account Selector */}
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 6 }}>
              Select Account to Simulate:
            </label>
            <select
              value={selectedCustId}
              onChange={e => setSelectedCustId(e.target.value)}
              style={{ width: "100%", fontSize: 12, padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", fontWeight: 600, outline: "none" }}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id}) — {c.tier} (Baseline Churn: {c.risk}%)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Presets */}
          <div>
            <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 600, marginBottom: 6 }}>Quick Strategy Presets:</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => applyPreset("standard")} style={{ flex: 1, padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: COLOR.paperRaised, cursor: "pointer", fontWeight: 500 }}>
                10% Concession
              </button>
              <button onClick={() => applyPreset("aggressive")} style={{ flex: 1, padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "rgba(169,124,63,.1)", color: COLOR.brass, cursor: "pointer", fontWeight: 600 }}>
                20% High-Risk Rescue
              </button>
              <button onClick={() => applyPreset("service")} style={{ flex: 1, padding: "6px 8px", fontSize: 11, borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: COLOR.paperRaised, cursor: "pointer", fontWeight: 500 }}>
                Priority Service Desk
              </button>
            </div>
          </div>

          {/* Slider 1: Discount % */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <span style={{ color: COLOR.ink }}>Personalized Discount / Fee Cut</span>
              <span style={{ color: COLOR.brass, fontWeight: 700 }}>{discountPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={discountPct}
              onChange={e => setDiscountPct(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: COLOR.brass, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLOR.inkSoft }}>
              <span>0% (No discount)</span>
              <span>10%</span>
              <span>20%</span>
              <span>35% (Max authorized)</span>
            </div>
          </div>

          {/* Slider 2: Loyalty Bonus Points */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <span style={{ color: COLOR.ink }}>Loyalty Reward Points Bonus</span>
              <span style={{ color: COLOR.ink, fontWeight: 700 }}>{loyaltyBonusPts.toLocaleString()} pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={loyaltyBonusPts}
              onChange={e => setLoyaltyBonusPts(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: COLOR.ink, cursor: "pointer" }}
            />
          </div>

          {/* Toggle 1: Priority Support */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: COLOR.paperRaised, borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>Priority RM Dedicated Concierge</div>
              <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>Bypass standard queues; 30-min SLA response</div>
            </div>
            <input
              type="checkbox"
              checked={prioritySupport}
              onChange={e => setPrioritySupport(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: COLOR.brass, cursor: "pointer" }}
            />
          </div>

          {/* Toggle 2: Annual Fee Waiver */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: COLOR.paperRaised, borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>100% Annual Card / Maintenance Fee Waiver</div>
              <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>Discretionary retention credit line</div>
            </div>
            <input
              type="checkbox"
              checked={feeWaiver}
              onChange={e => setFeeWaiver(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: COLOR.brass, cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Results Column */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: COLOR.ink, marginBottom: 16 }}>
              Simulated Retention Impact for {selectedCust?.name}
            </div>

            {/* Before vs After Visual Comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", alignItems: "center", gap: 14, background: COLOR.paperRaised, padding: 18, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
              {/* Before */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.inkSoft, textTransform: "uppercase" }}>
                  Before Intervention
                </div>
                <div style={{ fontFamily: "Fraunces", fontSize: 32, fontWeight: 700, color: COLOR.risk, marginTop: 4 }}>
                  {simulationResults.beforeChurn}%
                </div>
                <div style={{ fontSize: 11, color: COLOR.risk, fontWeight: 600, marginTop: 2 }}>
                  High Churn Risk
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "grid", placeItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLOR.paper, display: "grid", placeItems: "center" }}>
                  <ArrowRight size={16} color={COLOR.ink} />
                </div>
              </div>

              {/* After */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.inkSoft, textTransform: "uppercase" }}>
                  After Intervention
                </div>
                <div style={{ fontFamily: "Fraunces", fontSize: 32, fontWeight: 700, color: COLOR.stable, marginTop: 4 }}>
                  {simulationResults.afterChurn}%
                </div>
                <div style={{ fontSize: 11, color: COLOR.stable, fontWeight: 600, marginTop: 2 }}>
                  -{simulationResults.churnDropDelta}% Churn Drop
                </div>
              </div>
            </div>

            {/* Financial ROI Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
              <div style={{ padding: "12px 14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>ESTIMATED REVENUE SAVED</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLOR.brass, marginTop: 4 }}>
                  {fmtINR(simulationResults.estSavedRevenue)}
                </div>
                <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>Preserved portfolio funds</div>
              </div>

              <div style={{ padding: "12px 14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>CAMPAIGN CONCESSION COST</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLOR.ink, marginTop: 4 }}>
                  {fmtINR(simulationResults.campaignCost)}
                </div>
                <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>Discounts + points cost</div>
              </div>

              <div style={{ padding: "12px 14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>PROJECTED NET ROI</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLOR.stable, marginTop: 4 }}>
                  {simulationResults.netRoi}%
                </div>
                <div style={{ fontSize: 10, color: COLOR.stable, fontWeight: 600, marginTop: 2 }}>High financial viability</div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${COLOR.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
              Simulation parameters conform to <b>Meridian Policy #RET-2026-v2</b>.
            </div>
            <button
              onClick={() => onOpenCustomer(selectedCust)}
              style={{
                padding: "8px 16px",
                background: COLOR.ink,
                color: "#fff",
                border: 0,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Deploy Simulated Package to RM Queue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

