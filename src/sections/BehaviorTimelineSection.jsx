import { useState, useMemo } from "react";
import {
  Activity, Play, CheckCircle2, AlertTriangle, Clock,
  Smartphone, Monitor, Globe, ShoppingCart, UserCheck,
  Zap, Heart, ShieldAlert, ArrowRight, ArrowDownRight, RefreshCw
} from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function BehaviorTimelineSection({ customers = [], onOpenCustomer, showToast }) {
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "AC-40217");
  const [activeBehaviorFilter, setActiveBehaviorFilter] = useState("all");

  const selectedCust = useMemo(() => {
    return customers.find(c => c.id === selectedCustId) || customers[0];
  }, [customers, selectedCustId]);

  // Behavior Event Stream (Req 2)
  const [events, setEvents] = useState([
    { id: 1, event: "Product search", category: "Browse", detail: "Searched: 'HDFC vs Meridian FD rate comparison'", time: "4 mins ago", risk_delta: +12, icon: Globe },
    { id: 2, event: "Support request", category: "Service", detail: "Logged Ticket #9021: Disputed ₹2,400 maintenance fee", time: "22 mins ago", risk_delta: +18, icon: AlertTriangle },
    { id: 3, event: "Remove from cart", category: "Commerce", detail: "Abandoned '1-Year Non-Callable Deposit ₹3.0L' checkout", time: "2 hours ago", risk_delta: +8, icon: ShoppingCart },
    { id: 4, event: "Email opened", category: "Marketing", detail: "Opened: 'Q3 Relationship Rate Review'", time: "5 hours ago", risk_delta: -2, icon: Activity },
    { id: 5, event: "Login", category: "Session", detail: "Session on iPhone 15 Pro Max (Duration: 2.1m)", time: "Yesterday", risk_delta: 0, icon: Smartphone }
  ]);

  // Injectable behavior events for simulation
  const behaviorCatalog = [
    { event: "Cancellation", label: "Cancelled Subscription / Deposit Auto-Renewal", delta: 25, category: "High Risk Signal" },
    { event: "Support request", label: "Logged P1 Urgent Complaint Regarding Fees", delta: 18, category: "Service Risk" },
    { event: "Product search", label: "Viewed External Bank Competitor Rates", delta: 12, category: "Rate Shopping" },
    { event: "Remove from cart", label: "Abandoned Investment Checkout", delta: 8, category: "Friction" },
    { event: "Purchase", label: "Renewed Fixed Deposit with Senior RM", delta: -18, category: "Positive Retention" }
  ];

  const handleSimulateBehavior = (item) => {
    const currentRisk = selectedCust.risk;
    const nextRisk = Math.max(5, Math.min(99, currentRisk + item.delta));

    const newEv = {
      id: Date.now(),
      event: item.event,
      category: item.category,
      detail: item.label,
      time: "Just now",
      risk_delta: item.delta,
      icon: item.delta > 0 ? AlertTriangle : CheckCircle2
    };

    setEvents(prev => [newEv, ...prev]);
    showToast(`⚡ Real-Time Behavioral Update: ${selectedCust.name} risk shifted from ${currentRisk}% → ${nextRisk}%!`);

    fetch('/api/behavior/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: selectedCust.id,
        event_name: item.event,
        metadata: { label: item.label, category: item.category },
        impact_delta: item.delta
      })
    }).catch(() => {});
  };

  const getHealthColor = (score) => {
    if (score >= 80) return COLOR.stable;
    if (score >= 60) return COLOR.mid;
    if (score >= 30) return "#E65100";
    return COLOR.risk;
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Customer Behavior Tracking & Real-Time Digital Twin
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Live event-driven stream tracking searches, cart drop-offs, complaints, and digital twin behavioral vectors.
        </div>
      </div>

      {/* Account Selector Bar */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLOR.ink }}>Active Account:</span>
          <select
            value={selectedCustId}
            onChange={e => setSelectedCustId(e.target.value)}
            style={{ fontSize: 12.5, padding: "6px 14px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", fontWeight: 600, outline: "none" }}
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id}) — {c.tier} (Risk: {c.risk}%)
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
          <div>Signup: <b>{selectedCust?.signup_date || "2023-01-15"}</b></div>
          <div>Acquisition: <b style={{ color: COLOR.brass }}>{selectedCust?.acquisition_source || "Executive Referral"}</b></div>
          <div>Device: <b>{selectedCust?.device_type || "iOS / iPhone 15 Pro"}</b></div>
        </div>
      </div>

      {/* Health Score & Digital Twin Banner (Req 32 & 37.14) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.4fr", gap: 18 }}>
        {/* Customer Health Score Card (Req 32) */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Heart size={18} color={getHealthColor(selectedCust?.health_score || 35)} />
              <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink }}>
                Customer Health Score ⭐ (Req 32)
              </div>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
              background: `${getHealthColor(selectedCust?.health_score || 35)}18`,
              color: getHealthColor(selectedCust?.health_score || 35)
            }}>
              {selectedCust?.health_status || "At Risk"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 42, fontWeight: 700, color: getHealthColor(selectedCust?.health_score || 35) }}>
              {selectedCust?.health_score || 35}<span style={{ fontSize: 18, color: COLOR.inkSoft }}>/100</span>
            </div>
            <div style={{ fontSize: 11.5, color: COLOR.inkSoft, lineHeight: 1.4 }}>
              Combined telemetry score across:
              <br /><b>Engagement + Purchase Freq + Recency + Sentiment + Payment Reliability</b>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: COLOR.inkSoft }}>Payment Reliability:</span>
              <span style={{ fontWeight: 600 }}>{selectedCust?.payment_failure_count > 0 ? "⚠️ Bounced Auto-Debits" : "✓ 100% On-Time"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: COLOR.inkSoft }}>Support Sentiment:</span>
              <span style={{ fontWeight: 600, color: selectedCust?.sentiment_score < 0 ? COLOR.risk : COLOR.stable }}>
                {selectedCust?.latest_emotion || "Satisfied"} ({selectedCust?.sentiment_score})
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: COLOR.inkSoft }}>Login Recency:</span>
              <span style={{ fontWeight: 600 }}>{selectedCust?.days_since_last_login || 14} days ago</span>
            </div>
          </div>
        </div>

        {/* Real-Time Customer Digital Twin (Req 37.14) */}
        <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em" }}>
              Real-Time Customer Digital Twin ⭐
            </div>
            <span style={{ fontSize: 10, background: COLOR.panelSoft, padding: "2px 6px", borderRadius: 4, color: "#94A3B8" }}>
              Active Twin Representation
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 11.5 }}>
            <div style={{ background: COLOR.panelSoft, padding: "10px 12px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
              <div style={{ color: "#94A3B8" }}>Price Elasticity</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F3F1E9", marginTop: 2 }}>High Sensitivity (0.84)</div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Sensitive to recurring account fees</div>
            </div>

            <div style={{ background: COLOR.panelSoft, padding: "10px 12px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
              <div style={{ color: "#94A3B8" }}>Churn Velocity</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F87171", marginTop: 2 }}>Accelerating (+14% in 14d)</div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Window: 7–14 days</div>
            </div>

            <div style={{ background: COLOR.panelSoft, padding: "10px 12px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
              <div style={{ color: "#94A3B8" }}>Optimal Retention Channel</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.brassLight, marginTop: 2 }}>
                {selectedCust?.preferred_channel || "WhatsApp"}
              </div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                Best time: {selectedCust?.best_day} {selectedCust?.best_time}
              </div>
            </div>

            <div style={{ background: COLOR.panelSoft, padding: "10px 12px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
              <div style={{ color: "#94A3B8" }}>Retention Opportunity</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80", marginTop: 2 }}>
                {selectedCust?.retention_opportunity_score || 94}/100
              </div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Worth saving (High ROI viability)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Behavioral Simulation Toolbar (Req 2 & 29) */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: COLOR.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={16} color={COLOR.brass} />
          Inject Real-Time Customer Behavioral Event (Instant Risk Re-Scoring):
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {behaviorCatalog.map(b => (
            <button
              key={b.event + b.delta}
              onClick={() => handleSimulateBehavior(b)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${b.delta > 0 ? "rgba(178,58,50,.3)" : "rgba(62,107,82,.3)"}`,
                background: b.delta > 0 ? "rgba(178,58,50,.05)" : "rgba(62,107,82,.05)",
                color: b.delta > 0 ? COLOR.risk : COLOR.stable,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <Play size={10} fill="currentColor" /> {b.label} ({b.delta > 0 ? `+${b.delta}%` : `${b.delta}%`})
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Event Stream Log (Req 1 & 2) */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink }}>
            Real-Time Customer Behavioral Timeline ({events.length} Events Logged)
          </div>
          <span style={{ fontSize: 11, color: COLOR.inkSoft }}>Updated in real-time via telemetry webhooks</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map(ev => (
            <div
              key={ev.id}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 100px 90px",
                padding: "12px 16px",
                background: COLOR.paperRaised,
                borderRadius: 6,
                border: `1px solid ${COLOR.hair}`,
                alignItems: "center",
                fontSize: 12,
                gap: 12
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: COLOR.ink }}>{ev.event}</span>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{ev.category}</div>
              </div>

              <div style={{ fontSize: 12, color: COLOR.ink }}>
                {ev.detail}
              </div>

              <div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: ev.risk_delta > 0 ? COLOR.risk : ev.risk_delta < 0 ? COLOR.stable : COLOR.inkSoft
                }}>
                  {ev.risk_delta > 0 ? `+${ev.risk_delta}% Risk` : ev.risk_delta < 0 ? `${ev.risk_delta}% Risk` : "Neutral"}
                </span>
              </div>

              <div style={{ fontSize: 10.5, color: COLOR.inkSoft, textAlign: "right" }}>
                {ev.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

