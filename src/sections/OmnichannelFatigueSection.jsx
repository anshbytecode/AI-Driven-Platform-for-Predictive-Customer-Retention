import { useState } from "react";
import { 
  MessageSquare, Mail, Bell, Smartphone, Clock, 
  AlertTriangle, ShieldCheck, Zap, Sparkles, Send 
} from "lucide-react";
import { COLOR } from "../constants/theme";
import Tag from "../components/ui/Tag";

export default function OmnichannelFatigueSection({ customers = [], showToast }) {
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || "AC-40217");
  const selectedCust = customers.find(c => c.id === selectedCustId) || customers[0];

  // Channel engagement breakdown
  const channels = [
    { channel: "WhatsApp", opens: "88%", conversion: "28.4%", status: "Primary Recommended Channel", icon: MessageSquare, color: "#25D366" },
    { channel: "In-App Push", opens: "54%", conversion: "14.2%", status: "Active Secondary", icon: Bell, color: COLOR.brass },
    { channel: "Email", opens: "18%", conversion: "4.1%", status: "Ignored / Low Engagement", icon: Mail, color: COLOR.inkSoft },
    { channel: "SMS", opens: "12%", conversion: "2.5%", status: "Ignored", icon: Smartphone, color: COLOR.inkSoft }
  ];

  // Message Fatigue Audit (Req 17)
  const fatigueAlerts = [
    {
      customer_id: "AC-40218",
      name: "Rohan Mehta",
      touchpoints_7d: { emails: 12, push: 8, sms: 5 },
      total_7d: 25,
      fatigue_score: 78,
      status: "High Communication Fatigue",
      action: "Automatically throttled: all non-urgent marketing paused for 10 days"
    },
    {
      customer_id: "AC-40225",
      name: "Kavita Pillai",
      touchpoints_7d: { emails: 14, push: 6, sms: 4 },
      total_7d: 24,
      fatigue_score: 84,
      status: "Severe Communication Fatigue",
      action: "Route strictly through Senior RM Direct Call only"
    }
  ];

  const handleThrottleAction = (custName) => {
    showToast(`✓ Throttling Enforced: Frequency caps lowered for ${custName}`);
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Omnichannel Delivery, Send-Time Optimization & Message Fatigue ⭐
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Send the right retention offer, on the right channel, at the exact minute the customer is active, without triggering communication burnout.
        </div>
      </div>

      {/* Account Selector Bar */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLOR.ink }}>Inspect Profile:</span>
          <select
            value={selectedCustId}
            onChange={e => setSelectedCustId(e.target.value)}
            style={{ fontSize: 12.5, padding: "6px 14px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", fontWeight: 600, outline: "none" }}
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id}) — Preferred: {c.preferred_channel || "WhatsApp"}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <div>Best Day: <b style={{ color: COLOR.ink }}>{selectedCust?.best_day || "Friday"}</b></div>
          <div>Best Time: <b style={{ color: COLOR.brass }}>{selectedCust?.best_time || "7:40 PM"}</b></div>
          <div>Optimal Channel: <b style={{ color: "#25D366" }}>{selectedCust?.preferred_channel || "WhatsApp"}</b></div>
        </div>
      </div>

      {/* Grid: Omnichannel Analytics & Send-Time Prediction */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.1fr", gap: 18 }}>
        {/* Omnichannel Routing (Req 15) */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
            Channel Engagement & Auto-Router for {selectedCust?.name}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {channels.map(ch => (
              <div
                key={ch.channel}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  background: COLOR.paperRaised,
                  borderRadius: 6,
                  border: `1px solid ${COLOR.hair}`
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ch.icon size={16} color={ch.color} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLOR.ink }}>{ch.channel}</div>
                    <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{ch.status}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 14, textAlign: "right", fontSize: 11.5 }}>
                  <div>
                    <div style={{ color: COLOR.inkSoft }}>Open Rate</div>
                    <b style={{ color: COLOR.ink }}>{ch.opens}</b>
                  </div>
                  <div>
                    <div style={{ color: COLOR.inkSoft }}>Conversion</div>
                    <b style={{ color: COLOR.stable }}>{ch.conversion}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, fontSize: 11.5, color: COLOR.inkSoft, background: "rgba(37,211,102,.08)", padding: "10px 12px", borderRadius: 6, border: `1px solid rgba(37,211,102,.2)` }}>
            ✓ <b>Auto-Router Decision:</b> Email and SMS showed repeated non-response. System routed future retention communications to <b>WhatsApp Concierge</b>.
          </div>
        </div>

        {/* Send-Time Optimization Engine (Req 16) */}
        <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 11, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>
            Send-Time Optimization (STO) Model
          </div>

          <div style={{ fontSize: 13.5, color: "#F3F1E9", lineHeight: 1.5, marginBottom: 16 }}>
            ML predictive scheduling trained on historical app sessions, email click times, and UPI transaction timestamps.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
              <div style={{ fontSize: 10.5, color: "#94A3B8" }}>PREDICTED BEST DAY</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F3F1E9", marginTop: 2 }}>
                {selectedCust?.best_day || "Friday"}
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>Peak weekend liquidity planning hours</div>
            </div>

            <div style={{ background: COLOR.panelSoft, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hairDark}` }}>
              <div style={{ fontSize: 10.5, color: "#94A3B8" }}>OPTIMAL WINDOW</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.brassLight, marginTop: 2 }}>
                {selectedCust?.best_time || "7:40 PM"} IST
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>High historical app session velocity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Fatigue Detector & Auto-Throttle (Req 17) */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} color={COLOR.risk} />
            <div style={{ fontWeight: 700, fontSize: 14, color: COLOR.ink }}>
              Message Fatigue Detection & Frequency Throttling ⭐ (Req 17)
            </div>
          </div>
          <span style={{ fontSize: 11, background: "rgba(178,58,50,.1)", color: COLOR.risk, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
            {fatigueAlerts.length} Fatigued Accounts Detected
          </span>
        </div>

        <div style={{ fontSize: 12, color: COLOR.inkSoft, marginBottom: 16 }}>
          Prevents marketing harassment: identifies customers who received excessive communication (e.g. 12 emails, 8 push, 5 SMS in 7 days) and automatically lowers frequency.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {fatigueAlerts.map(fa => (
            <div
              key={fa.customer_id}
              style={{
                padding: "14px 16px",
                background: "rgba(178,58,50,.04)",
                border: `1.5px solid rgba(178,58,50,.2)`,
                borderRadius: 6,
                display: "grid",
                gridTemplateColumns: "180px 140px 1fr 140px",
                alignItems: "center",
                gap: 16
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: COLOR.ink }}>{fa.name}</div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{fa.customer_id}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.risk }}>
                  {fa.total_7d} Touchpoints in 7d
                </div>
                <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 1 }}>
                  {fa.touchpoints_7d.emails} emails, {fa.touchpoints_7d.push} push, {fa.touchpoints_7d.sms} sms
                </div>
              </div>

              <div style={{ fontSize: 11.5, color: COLOR.ink }}>
                <b>Throttling Rule:</b> {fa.action}
              </div>

              <div style={{ textAlign: "right" }}>
                <button
                  onClick={() => handleThrottleAction(fa.name)}
                  style={{
                    padding: "6px 12px",
                    background: COLOR.ink,
                    color: "#fff",
                    border: 0,
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Enforce Throttle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

