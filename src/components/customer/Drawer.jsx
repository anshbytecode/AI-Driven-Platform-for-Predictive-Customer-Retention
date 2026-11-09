import { useState } from "react";
import {
  Check, X, Sparkles, Copy, Mail, MessageSquare, PhoneCall,
  Clock, FileText, UserCheck, CheckCircle2, ShieldAlert, Zap,
  DollarSign, Activity, AlertTriangle, Eye, EyeOff
} from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR, fmtLakh, segLabel, generateScript, maskEmail, maskPhone } from "../../utils/helpers";
import SignalDial from "../ui/SignalDial";
import Sparkline from "../ui/Sparkline";
import Tag from "../ui/Tag";

export default function Drawer({
  customer,
  onClose,
  queuedIds,
  onToggleQueue,
  onMarkStatus,
  onAddNote,
  onTriggerReassign,
  showToast,
  rms = [],
  piiMasked = true
}) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, 360profile, outreach, timeline, notes
  const [outreachChannel, setOutreachChannel] = useState("email"); // email, sms, script
  const [newNote, setNewNote] = useState("");
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const tone = customer.risk >= 65 ? "risk" : customer.risk >= 35 ? "mid" : "stable";
  const queued = queuedIds?.has(customer.id);
  const rm = rms.find(r => r.id === customer.assigned_rm || r.id === customer.assignedRm) || {
    name: customer.rm_name || "Priya Sharma",
    role: customer.rm_role || "Senior RM — Private Banking",
    phone: customer.rm_phone || "+91 98201 44102"
  };
  const generatedScriptText = generateScript(customer, outreachChannel);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedScriptText);
    setCopied(true);
    showToast(`Copied ${outreachChannel.toUpperCase()} template to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    onAddNote(customer.id, newNote);
    setNewNote("");
    showToast("RM Note added to account history");
  };

  const cardStyle = {
    padding: "10px 12px",
    background: "#fff",
    border: `1px solid ${COLOR.hair}`,
    borderRadius: 6,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12
  };

  const miniStat = {
    padding: "10px 12px",
    background: "#fff",
    border: `1px solid ${COLOR.hair}`,
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    fontSize: 11
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 45 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,24,38,.45)", backdropFilter: "blur(2px)" }} />

      {/* Drawer Panel */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        width: 480,
        maxWidth: "96vw",
        background: COLOR.paperRaised,
        boxShadow: "-8px 0 28px rgba(0,0,0,.2)",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Top Header */}
        <div style={{ padding: "18px 22px 12px", borderBottom: `1px solid ${COLOR.hair}`, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: COLOR.inkSoft, background: COLOR.paper, padding: "1px 6px", borderRadius: 4 }}>
                  {customer.id}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: customer.risk >= 80 ? COLOR.risk : COLOR.brass, color: "#fff" }}>
                  {customer.risk_level || (customer.risk >= 80 ? "Critical" : "High")} Risk
                </span>
              </div>
              <div style={{ fontFamily: "Fraunces", fontSize: 21, color: COLOR.ink, marginTop: 4 }}>
                {customer.name}
              </div>
              <div style={{ fontSize: 11.5, color: COLOR.inkSoft, marginTop: 2 }}>
                {customer.tier} · {customer.tenure} · {fmtINR(customer.balance)}
              </div>
              <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 2 }}>
                {maskEmail(customer.email, piiMasked)} • {maskPhone(customer.phone, piiMasked)}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: 0, cursor: "pointer", color: COLOR.inkSoft }}><X size={20} /></button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 14, overflowX: "auto", paddingBottom: 2 }}>
            {[
              { id: "overview", label: "Overview & Signals" },
              { id: "360profile", label: "360° Data & CLV" },
              { id: "outreach", label: "AI Outreach" },
              { id: "timeline", label: "Timeline" },
              { id: "notes", label: "RM Notes" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 5,
                  border: activeTab === tab.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                  background: activeTab === tab.id ? COLOR.ink : "transparent",
                  color: activeTab === tab.id ? "#fff" : COLOR.inkSoft,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          {/* TAB 1: OVERVIEW & SIGNALS */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Risk Dial & Trajectory */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", background: "#fff", padding: 14, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
                <SignalDial value={customer.risk} size={74} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Tag tone={tone}>{customer.risk}% Churn Probability</Tag>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: COLOR.risk }}>
                      Window: {customer.predicted_churn_window || "< 30 days"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 6, lineHeight: 1.4 }}>
                    6-week risk trajectory:
                    <div style={{ height: 22, marginTop: 4 }}>
                      <Sparkline points={customer.trend || [40, 50, 60, 70, customer.risk]} tone={tone} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Best Action Card ⭐ */}
              <div style={{ background: COLOR.panel, borderRadius: 8, padding: 16, color: "#F3F1E9", border: `1px solid ${COLOR.brass}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: COLOR.brassLight, fontSize: 11, fontWeight: 700 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Zap size={14} color={COLOR.brassLight} /> NEXT BEST ACTION (UPLIFT MODELING)
                  </span>
                  <span>Conf: {customer.confidence || 91}%</span>
                </div>
                <div style={{ fontFamily: "Fraunces", fontSize: 15, margin: "8px 0 4px", color: "#fff" }}>
                  {customer.next_best_action || customer.action}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#94A3B8" }}>
                  <span>Expected Retention: <b style={{ color: COLOR.brassLight }}>{customer.expected_retention_prob || 78}%</b></span>
                  <span>Revenue Saved: <b style={{ color: "#4ADE80" }}>{fmtINR(customer.expected_revenue_saved || customer.balance * 0.08)}</b></span>
                </div>
              </div>

              {/* RM Assignment Box */}
              <div style={{ padding: "10px 14px", background: "#fff", borderRadius: 8, border: `1px solid ${COLOR.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: COLOR.inkSoft, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Assigned Relationship Manager</div>
                  <div style={{ fontWeight: 600, fontSize: 12.5, color: COLOR.ink, marginTop: 1 }}>{rm.name}</div>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{rm.role} • {maskPhone(rm.phone, false)}</div>
                </div>
                <button onClick={() => onTriggerReassign(customer)} style={{ fontSize: 11, padding: "5px 10px", background: COLOR.paperRaised, border: `1px solid ${COLOR.hair}`, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <UserCheck size={12} /> Reassign
                </button>
              </div>

              {/* Primary Drivers Breakdown */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: COLOR.ink }}>Top Churn Telemetry Drivers</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={cardStyle}>
                    <span style={{ fontWeight: 600, color: COLOR.ink }}>{customer.driver}</span>
                    <Tag tone={tone}>Top Driver</Tag>
                  </div>
                  {customer.secondary?.map((s, idx) => (
                    <div key={idx} style={cardStyle}>
                      <span style={{ color: COLOR.inkSoft }}>{s}</span>
                      <Tag tone="mid">Contributing</Tag>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 360° DATA & CLV */}
          {activeTab === "360profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Demographics Profile */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink, marginBottom: 8 }}>Customer Demographics</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={miniStat}><small>City Location</small><b>{customer.city || "Mumbai"}</b></div>
                  <div style={miniStat}><small>Age & Gender</small><b>{customer.age || 38} yrs • {customer.gender || "Female"}</b></div>
                  <div style={miniStat}><small>Occupation</small><b>{customer.occupation || "Executive"}</b></div>
                  <div style={miniStat}><small>Reward Tier</small><b>{customer.reward_tier || "Platinum"}</b></div>
                </div>
              </div>

              {/* CLV Predictions */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink, marginBottom: 8 }}>Customer Lifetime Value (CLV) Projections</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={miniStat}><small>Current Realized CLV</small><b style={{ fontSize: 14 }}>{fmtINR(customer.current_clv || customer.balance * 0.4)}</b></div>
                  <div style={miniStat}><small>Predicted 12-Month CLV</small><b style={{ fontSize: 14, color: COLOR.brass }}>{fmtINR(customer.predicted_12m_clv || customer.balance * 0.7)}</b></div>
                </div>
              </div>

              {/* Behavioral Telemetry */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink, marginBottom: 8 }}>Digital & Transaction Activity</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={miniStat}><small>Days Since Last Login</small><b>{customer.days_since_last_login || 14} days</b></div>
                  <div style={miniStat}><small>Monthly Transactions</small><b>{customer.transactions_per_month || 4} tx/mo</b></div>
                  <div style={miniStat}><small>Unresolved Complaints</small><b style={{ color: customer.unresolved_complaints > 0 ? COLOR.risk : COLOR.stable }}>{customer.unresolved_complaints || 2} open</b></div>
                  <div style={miniStat}><small>Payment Gateway Failures</small><b style={{ color: customer.payment_failure_count > 0 ? COLOR.risk : COLOR.ink }}>{customer.payment_failure_count || 2} declines</b></div>
                </div>
              </div>

              {/* Financial Accounts */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink, marginBottom: 8 }}>Accounts & Liquidity Breakdown</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={miniStat}><small>Savings Balance</small><b>{fmtINR(customer.savings || customer.accountDetails?.savings || customer.balance * 0.6)}</b></div>
                  <div style={miniStat}><small>Fixed Deposits</small><b>{fmtINR(customer.fixed_deposit || customer.accountDetails?.fixedDeposit || customer.balance * 0.4)}</b></div>
                  <div style={miniStat}><small>Credit Limit</small><b>{fmtINR(customer.credit_limit || customer.accountDetails?.creditLimit || 500000)}</b></div>
                  <div style={miniStat}><small>Active Loans</small><b>{customer.active_loans ?? customer.accountDetails?.activeLoans ?? 0} loans</b></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI OUTREACH GENERATOR */}
          {activeTab === "outreach" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 12, color: COLOR.inkSoft, lineHeight: 1.5 }}>
                Personalized retention message for <b>{customer.name}</b> addressing <i>{customer.driver}</i>.
              </div>

              {/* Channel Selector */}
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { id: "email", label: "Email Script", icon: Mail },
                  { id: "sms", label: "SMS / WhatsApp", icon: MessageSquare },
                  { id: "script", label: "RM Call Script", icon: PhoneCall }
                ].map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setOutreachChannel(ch.id)}
                    style={{
                      flex: 1,
                      padding: "8px 6px",
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: outreachChannel === ch.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                      background: outreachChannel === ch.id ? COLOR.ink : "#fff",
                      color: outreachChannel === ch.id ? "#fff" : COLOR.inkSoft,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5
                    }}
                  >
                    <ch.icon size={13} /> {ch.label}
                  </button>
                ))}
              </div>

              {/* Script Output Box */}
              <div style={{ position: "relative" }}>
                <textarea
                  readOnly
                  value={generatedScriptText}
                  rows={13}
                  style={{ width: "100%", padding: 14, borderRadius: 8, border: `1px solid ${COLOR.hair}`, fontFamily: "IBM Plex Sans", fontSize: 12, lineHeight: 1.5, background: "#fff", color: COLOR.ink, outline: "none", resize: "none" }}
                />
                <button
                  onClick={handleCopyScript}
                  style={{ position: "absolute", top: 10, right: 10, padding: "5px 10px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Template</>}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === "timeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink, marginBottom: 4 }}>Telemetry & Signals Timeline</div>
              {(customer.events || customer.history || []).map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", padding: 12, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                  <Clock size={15} color={COLOR.brass} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>{h.event}</div>
                    <div style={{ fontSize: 10.5, color: COLOR.inkSoft, marginTop: 2 }}>
                      {h.date || "Logged event"} • Type: <Tag tone={h.event_type === "signal" || h.type === "signal" ? "risk" : "stable"}>{h.event_type || h.type || "system"}</Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink }}>Relationship Manager Log</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Type notes on client conversation, requested fee adjustments, or follow-up commitments..."
                  rows={3}
                  style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none" }}
                />
                <button
                  onClick={handleSaveNote}
                  style={{ alignSelf: "flex-end", padding: "6px 14px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
                >
                  Save Note
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                {(customer.notes || []).map((n, i) => (
                  <div key={i} style={{ padding: "10px 12px", background: "#fff", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, color: COLOR.ink }}>
                    <div style={{ fontSize: 10, color: COLOR.inkSoft, marginBottom: 2 }}>RM Log Entry</div>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${COLOR.hair}`, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["New", "Queued", "Contacted", "Retained"].map(st => (
              <button
                key={st}
                onClick={() => onMarkStatus(customer.id, st)}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 4,
                  border: customer.status === st ? `1.5px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                  background: customer.status === st ? COLOR.ink : "transparent",
                  color: customer.status === st ? "#fff" : COLOR.inkSoft,
                  cursor: "pointer"
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => onToggleQueue(customer.id)}
            style={{
              padding: "7px 14px",
              background: queued ? COLOR.paper : COLOR.brass,
              color: queued ? COLOR.ink : "#fff",
              border: queued ? `1px solid ${COLOR.hair}` : 0,
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {queued ? "✓ Queued for Outreach" : "+ Queue for RM Outreach"}
          </button>
        </div>
      </div>
    </div>
  );
}
