import { useState, useEffect } from "react";
import { AlertOctagon, ShieldAlert, CheckCircle2, UserX, AlertTriangle, Eye, Lock } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function FraudSentinelSection({ customers = [], onOpenCustomer, showToast }) {
  const [flaggedCases, setFlaggedCases] = useState([
    {
      id: "FRD-9901",
      customer_id: "AC-40226",
      customer_name: "Nikhil Bansal",
      tier: "Retail — Standard",
      risk: 84,
      anomaly_type: "Abnormal High-Frequency Refund Velocity",
      score: 88,
      severity: "Critical",
      details: "7 chargeback disputes and merchant refund claims filed within 18 days totaling ₹14,200 across distinct merchant terminals. Deviates 4.2x from standard baseline.",
      recommended_action: "Exclude from retention discounts; Route to Financial Crimes Unit",
      is_excluded: true
    },
    {
      id: "FRD-9902",
      customer_id: "AC-40217",
      customer_name: "Priya Kulkarni",
      tier: "Retail — Premier",
      risk: 65,
      anomaly_type: "Multiple Accounts with Identical Device Hash",
      score: 74,
      severity: "Suspicious",
      details: "Same mobile device fingerprint (IMEI / browser fingerprint) used across 3 distinct account IDs with conflicting KYC names.",
      recommended_action: "Enforce biometrics re-verification before retention incentive",
      is_excluded: true
    }
  ]);

  useEffect(() => {
    fetch('/api/fraud/sentinel')
      .then(r => r.json())
      .then(rows => {
        if (rows && Array.isArray(rows) && rows.length > 0) {
          const mapped = rows.map(r => ({
            id: `FRD-${r.id}`,
            db_id: r.id,
            customer_id: r.customer_id,
            customer_name: customers.find(c => c.id === r.customer_id)?.name || `Account ${r.customer_id}`,
            tier: "Retail — Standard",
            risk: 80,
            anomaly_type: r.anomaly_type,
            score: r.anomaly_score,
            severity: r.flag_level,
            details: r.details,
            recommended_action: r.action_taken || "Under Investigation",
            is_excluded: r.action_taken?.includes("Exclu") || false
          }));
          setFlaggedCases(mapped);
        }
      })
      .catch(() => {});
  }, [customers]);

  const toggleExclusion = (caseId) => {
    setFlaggedCases(prev => prev.map(c => {
      if (c.id === caseId || c.db_id === caseId) {
        const nextState = !c.is_excluded;
        showToast(nextState ? `Account ${c.customer_id} excluded (updated in fraud_anomalies)` : `Account ${c.customer_id} reinstated (updated in fraud_anomalies)`);
        
        // Sync with PostgreSQL
        const targetId = c.db_id || 1;
        fetch(`/api/fraud/cases/${targetId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_taken: nextState ? 'Excluded from Retention Discounts' : 'Reinstated for Standard Offers',
            flag_level: nextState ? 'High Risk' : 'Cleared'
          })
        }).catch(e => console.warn('Fraud patch notice:', e));

        return { ...c, is_excluded: nextState, recommended_action: nextState ? 'Excluded from Retention Discounts' : 'Reinstated for Standard Offers' };
      }
      return c;
    }));
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Fraud Sentinel & Abnormal Behavior Detector
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Protects retention budgets by identifying fraudulent chargebacks, multi-account abuse, and abnormal transaction velocities before deploying costly retention incentives.
        </div>
      </div>

      {/* KPI Banners */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>Active Anomaly Flags</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.risk, fontWeight: 700, marginTop: 4 }}>
            {flaggedCases.length} Accounts
          </div>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 2 }}>High confidence anomaly signals</div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>Retention Budget Protected</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.stable, fontWeight: 700, marginTop: 4 }}>
            ₹48,500
          </div>
          <div style={{ fontSize: 11, color: COLOR.stable, marginTop: 2 }}>Incentives withheld from fraudulent requests</div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>Exclusion Policy Status</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.ink, fontWeight: 700, marginTop: 4 }}>
            Enforced
          </div>
          <div style={{ fontSize: 11, color: COLOR.brass, marginTop: 2 }}>Meridian Anti-Abuse Rule #FRD-8</div>
        </div>
      </div>

      {/* Flagged Accounts Ledger */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 16 }}>
          Flagged Accounts & Behavioral Anomalies ({flaggedCases.length})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {flaggedCases.map(fc => (
            <div
              key={fc.id}
              style={{
                padding: "16px",
                background: "rgba(178,58,50,.04)",
                border: `1.5px solid rgba(178,58,50,.2)`,
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertOctagon size={18} color={COLOR.risk} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink }}>{fc.customer_name}</span>
                    <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: COLOR.inkSoft }}>({fc.customer_id})</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: COLOR.risk, color: "#fff" }}>
                      Anomaly Score: {fc.score}/100
                    </span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.risk, marginTop: 4 }}>
                    Pattern: {fc.anomaly_type}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => toggleExclusion(fc.id)}
                    style={{
                      padding: "6px 12px",
                      background: fc.is_excluded ? COLOR.risk : COLOR.paper,
                      color: fc.is_excluded ? "#fff" : COLOR.ink,
                      border: `1px solid ${fc.is_excluded ? COLOR.risk : COLOR.hair}`,
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5
                    }}
                  >
                    <Lock size={12} /> {fc.is_excluded ? "Excluded from Offers" : "Eligible for Offers"}
                  </button>

                  <button
                    onClick={() => {
                      const cust = customers.find(c => c.id === fc.customer_id);
                      if (cust) onOpenCustomer(cust);
                      else showToast(`Opening account ${fc.customer_id}`);
                    }}
                    style={{
                      padding: "6px 12px",
                      background: COLOR.ink,
                      color: "#fff",
                      border: 0,
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Inspect Account →
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 12, color: COLOR.inkSoft, background: "#fff", padding: "10px 14px", borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <b>Sentinel Evidence:</b> {fc.details}
              </div>

              <div style={{ fontSize: 11.5, color: COLOR.ink, display: "flex", justifyContent: "space-between" }}>
                <span>Action Protocol: <b>{fc.recommended_action}</b></span>
                <span style={{ color: COLOR.inkSoft }}>Case ID: {fc.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

