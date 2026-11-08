import { useState, useEffect } from "react";
import { Activity, Play, Zap, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { COLOR } from "../constants/theme";
import { simulateRealtimeEvent, fetchRealtimeEvents } from "../api/client";

export default function RealtimeStreamSection({ customers = [], onCustomerRiskUpdated, showToast }) {
  const [events, setEvents] = useState([
    { id: 1, customer_id: "AC-40217", customer_name: "Priya Kulkarni", event: "Visited competitor fixed deposit comparison page (3x in 24h)", impact: "+14%", risk_before: 74, risk_after: 88, action: "Trigger Rate Matcher Playbook", time: "2 mins ago" },
    { id: 2, customer_id: "AC-40220", customer_name: "Vikram Nair", event: "Payment Gateway Failure on ₹45,000 corporate vendor payout", impact: "+18%", risk_before: 51, risk_after: 69, action: "Notify Business RM & Waive FX Markup", time: "8 mins ago" },
    { id: 3, customer_id: "AC-40224", customer_name: "Arjun Singhania", event: "Successful portfolio rebalance review completed with Senior RM", impact: "-8%", risk_before: 36, risk_after: 28, action: "Send Anniversary Appreciation Note", time: "22 mins ago" }
  ]);

  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "AC-40217");
  const [eventType, setEventType] = useState("rate_shopping");
  const [isSimulating, setIsSimulating] = useState(false);

  const eventPresets = [
    { type: "rate_shopping", label: "Competitor Rate Shopping Signal", desc: "Customer visited competitor FD comparison calculator 3 times", impact: 14, action: "Automate Relationship Pricing Review" },
    { type: "payment_failure", label: "Payment Gateway Auto-Debit Failure", desc: "Recurring mandate bounced due to payment switch timeout", impact: 18, action: "Proactive Support Outreach & Waive Late Fee" },
    { type: "support_escalation", label: "NPS Rating Dropped (Score: 2/10)", desc: "Customer logged low satisfaction ticket regarding billing fee", impact: 12, action: "Dispatch Senior RM Priority Concierge" },
    { type: "rm_meeting", label: "Quarterly Portfolio Review Completed", desc: "Client aligned on high-yield fixed return wealth allocation", impact: -15, action: "Reinforce VIP Status & Send Relationship Memo" }
  ];

  const handleTriggerSimulatedEvent = async () => {
    setIsSimulating(true);
    const preset = eventPresets.find(p => p.type === eventType) || eventPresets[0];
    const targetCust = customers.find(c => c.id === selectedCustId) || customers[0];

    try {
      // Call backend API if running
      await simulateRealtimeEvent({
        customer_id: targetCust.id,
        event_type: preset.type,
        description: preset.desc,
        impact_delta: preset.impact
      });
    } catch (e) {
      // client fallback handles locally
    }

    const currentRisk = targetCust.risk;
    const nextRisk = Math.max(5, Math.min(99, currentRisk + preset.impact));

    const newEv = {
      id: Date.now(),
      customer_id: targetCust.id,
      customer_name: targetCust.name,
      event: preset.desc,
      impact: `${preset.impact > 0 ? '+' : ''}${preset.impact}%`,
      risk_before: currentRisk,
      risk_after: nextRisk,
      action: preset.action,
      time: "Just now"
    };

    setEvents(prev => [newEv, ...prev]);
    if (onCustomerRiskUpdated) {
      onCustomerRiskUpdated(targetCust.id, nextRisk);
    }
    showToast(`⚡ Real-Time Pipeline: Processed ${preset.label} for ${targetCust.name}`);
    setIsSimulating(false);
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Real-Time Streaming Prediction Engine
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Live event-driven architecture: Ingests digital actions, updates feature vectors, runs ML models, and triggers immediate retention playbooks in milliseconds.
        </div>
      </div>

      {/* Real-Time Architecture Pipeline Visualizer */}
      <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: "20px 24px" }}>
        <div style={{ fontSize: 11, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
          Streaming Data & ML Pipeline Architecture
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, alignItems: "center" }}>
          {/* Step 1 */}
          <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>1. EVENT CAPTURE</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F3F1E9", marginTop: 4 }}>Telemetry Stream</div>
            <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>Kafka / Webhooks</div>
          </div>

          {/* Step 2 */}
          <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>2. FEATURE STORE</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F3F1E9", marginTop: 4 }}>Dynamic Vectors</div>
            <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>PostgreSQL + Redis</div>
          </div>

          {/* Step 3 */}
          <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.brass}` }}>
            <div style={{ fontSize: 10, color: COLOR.brassLight, fontWeight: 700 }}>3. ML INFERENCE</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F3F1E9", marginTop: 4 }}>Model v4.2 Scoring</div>
            <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>Latency &lt; 28ms</div>
          </div>

          {/* Step 4 */}
          <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>4. UPLIFT ENGINE</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F3F1E9", marginTop: 4 }}>Next Best Action</div>
            <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>Treatment Selection</div>
          </div>

          {/* Step 5 */}
          <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>5. AUTO DISPATCH</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F3F1E9", marginTop: 4 }}>RM Concierge Queue</div>
            <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>WhatsApp / SMS / RM</div>
          </div>
        </div>
      </div>

      {/* Simulator Control & Trigger Bar */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} color={COLOR.brass} />
          Interactive Real-Time Event Injection Sandbox
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr auto", gap: 12, alignItems: "center" }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 4 }}>Target Account:</label>
            <select
              value={selectedCustId}
              onChange={e => setSelectedCustId(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none", background: "#fff" }}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id}) — Current Churn: {c.risk}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 4 }}>Select Real-Time Telemetry Event:</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none", background: "#fff" }}
            >
              {eventPresets.map(p => (
                <option key={p.type} value={p.type}>
                  {p.label} ({p.impact > 0 ? '+' : ''}{p.impact}% Risk Impact)
                </option>
              ))}
            </select>
          </div>

          <div style={{ paddingTop: 18 }}>
            <button
              onClick={handleTriggerSimulatedEvent}
              disabled={isSimulating}
              style={{
                padding: "9px 18px",
                background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`,
                color: "#fff",
                border: 0,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Play size={13} fill="#fff" />
              {isSimulating ? "Processing..." : "Fire Event"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Event Stream Feed */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink }}>
            Live Prediction Activity Stream ({events.length} Events Logged)
          </div>
          <span style={{ fontSize: 11, color: COLOR.inkSoft }}>
            Auto-refreshed via PostgreSQL CDC
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map(ev => (
            <div
              key={ev.id}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr 140px 180px 80px",
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
                <div style={{ fontWeight: 700, color: COLOR.ink }}>{ev.customer_name}</div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{ev.customer_id}</div>
              </div>

              <div style={{ fontSize: 11.5, color: COLOR.ink }}>
                {ev.event}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: COLOR.inkSoft }}>{ev.risk_before}%</span>
                <ArrowRight size={12} color={COLOR.inkSoft} />
                <span style={{ 
                  fontWeight: 700, 
                  color: ev.risk_after > ev.risk_before ? COLOR.risk : COLOR.stable 
                }}>
                  {ev.risk_after}% ({ev.impact})
                </span>
              </div>

              <div style={{ fontSize: 11, color: COLOR.brass, fontWeight: 600 }}>
                ⚡ {ev.action}
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

