import { useState } from "react";
<<<<<<< HEAD
import { 
  Check, X, Sparkles, Copy, Mail, MessageSquare, PhoneCall, 
  Clock, FileText, UserCheck, CheckCircle2, ShieldAlert, Zap, 
  DollarSign, Activity, AlertTriangle, Eye, EyeOff 
} from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR, fmtLakh, segLabel, generateScript, maskEmail, maskPhone } from "../../utils/helpers";
=======
import { Check, X, Sparkles, Copy, Mail, MessageSquare, PhoneCall, Clock, FileText, UserCheck, CheckCircle2 } from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR, segLabel, generateScript } from "../../utils/helpers";
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
import SignalDial from "../ui/SignalDial";
import Sparkline from "../ui/Sparkline";
import Tag from "../ui/Tag";

<<<<<<< HEAD
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
=======
export default function Drawer({ customer, onClose, queuedIds, onToggleQueue, onMarkStatus, onAddNote, onTriggerReassign, showToast, rms = [] }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, outreach, timeline, notes
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
  const [outreachChannel, setOutreachChannel] = useState("email"); // email, sms, script
  const [newNote, setNewNote] = useState("");
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

<<<<<<< HEAD
  const tone = customer.risk >= 65 ? "risk" : customer.risk >= 35 ? "mid" : "stable";
  const queued = queuedIds?.has(customer.id);
  const rm = rms.find(r => r.id === customer.assigned_rm || r.id === customer.assignedRm) || { 
    name: customer.rm_name || "Priya Sharma", 
    role: customer.rm_role || "Senior RM — Private Banking",
    phone: customer.rm_phone || "+91 98201 44102"
  };
=======
  const tone = customer.segment === "high" ? "risk" : customer.segment === "medium" ? "mid" : "stable";
  const queued = queuedIds.has(customer.id);
  const rm = rms.find(r => r.id === customer.assignedRm) || { name: "Priya Sharma", role: "Senior RM" };
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
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

<<<<<<< HEAD
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
=======
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 45 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,24,38,.45)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "absolute", top: 0, right: 0, height: "100%", width: 440, maxWidth: "94vw", background: COLOR.paperRaised, boxShadow: "-8px 0 28px rgba(0,0,0,.2)", display: "flex", flexDirection: "column" }}>
        
        {/* Top Header */}
        <div style={{ padding: "20px 22px 14px", borderBottom: `1px solid ${COLOR.hair}`, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: COLOR.inkSoft }}>{customer.id}</div>
              <div style={{ fontFamily: "Fraunces", fontSize: 22, color: COLOR.ink }}>{customer.name}</div>
              <div style={{ fontSize: 12, color: COLOR.inkSoft, marginTop: 2 }}>{customer.tier} · {customer.tenure} · {fmtINR(customer.balance)}</div>
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: 0, cursor: "pointer", color: COLOR.inkSoft }}><X size={20} /></button>
          </div>

          {/* Navigation Tabs */}
<<<<<<< HEAD
          <div style={{ display: "flex", gap: 4, marginTop: 14, overflowX: "auto", paddingBottom: 2 }}>
            {[
              { id: "overview", label: "Overview & Signals" },
              { id: "360profile", label: "360° Data & CLV" },
              { id: "outreach", label: "AI Outreach" },
              { id: "timeline", label: "Timeline" },
              { id: "notes", label: "RM Notes" }
=======
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {[
              { id: "overview", label: "Overview & Signals" },
              { id: "outreach", label: "AI Outreach" },
              { id: "timeline", label: "Timeline" },
              { id: "notes", label: "Notes" }
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
<<<<<<< HEAD
                  padding: "5px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 5,
                  border: activeTab === tab.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                  background: activeTab === tab.id ? COLOR.ink : "transparent",
                  color: activeTab === tab.id ? "#fff" : COLOR.inkSoft,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
=======
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: activeTab === tab.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                  background: activeTab === tab.id ? COLOR.ink : "transparent",
                  color: activeTab === tab.id ? "#fff" : COLOR.inkSoft,
                  cursor: "pointer"
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
<<<<<<< HEAD
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
=======
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          {/* TAB 1: OVERVIEW & SIGNALS */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Risk Dial & Summary */}
              <div style={{ display: "flex", gap: 18, alignItems: "center", background: "#fff", padding: 14, borderRadius: 10, border: `1px solid ${COLOR.hair}` }}>
                <SignalDial value={customer.risk} size={80} />
                <div>
                  <Tag tone={tone}>{segLabel(customer.segment)} Risk ({customer.risk}%)</Tag>
                  <div style={{ fontSize: 11.5, color: COLOR.inkSoft, marginTop: 6, lineHeight: 1.4 }}>
                    6-week trajectory:
                    <div style={{ height: 24, marginTop: 4 }}>
                      <Sparkles size={12} color={COLOR.brass} style={{ marginRight: 4 }} />
                      <Sparkline points={customer.trend} tone={tone} />
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                    </div>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
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
=======
              {/* RM Assignment */}
              <div style={{ padding: 12, background: COLOR.paper, borderRadius: 8, border: `1px solid ${COLOR.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, textTransform: "uppercase", letterSpacing: ".06em" }}>Assigned Manager</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink }}>{rm.name}</div>
                  <div style={{ fontSize: 11, color: COLOR.inkSoft }}>{rm.role}</div>
                </div>
                <button onClick={() => onTriggerReassign(customer)} style={{ fontSize: 11, padding: "5px 10px", background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                  <UserCheck size={12} /> Reassign
                </button>
              </div>

<<<<<<< HEAD
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
=======
              {/* Flag Drivers */}
              <div>
                <div style={{ fontFamily: "Fraunces", fontSize: 15, marginBottom: 8 }}>Primary Churn Drivers</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={cardStyle}>
                    <span style={{ fontWeight: 500 }}>{customer.driver}</span>
                    <Tag tone={tone}>Primary Flag</Tag>
                  </div>
                  {customer.secondary?.map(s => (
                    <div key={s} style={cardStyle}>
                      <span>{s}</span>
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                      <Tag tone="mid">Contributing</Tag>
                    </div>
                  ))}
                </div>
              </div>
<<<<<<< HEAD
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
=======

              {/* Recommended Action Box */}
              <div style={{ background: COLOR.ink, borderRadius: 10, padding: 16, color: "#F3F1E9" }}>
                <div style={{ display: "flex", gap: 6, color: COLOR.brassLight, fontSize: 12, fontWeight: 600 }}>
                  <Sparkles size={14} /> AI Recommendation Engine
                </div>
                <div style={{ fontFamily: "Fraunces", fontSize: 16, margin: "10px 0 6px" }}>{customer.action}</div>
                <div style={{ fontSize: 11.5, color: "#9AA6B8" }}>
                  {customer.confidence}% Confidence • {customer.impact} Impact • Status: <b style={{ color: COLOR.brassLight }}>{customer.status || "New"}</b>
                </div>
              </div>

              {/* Financial Profile */}
              {customer.accountDetails && (
                <div>
                  <div style={{ fontFamily: "Fraunces", fontSize: 15, marginBottom: 8 }}>Account Portfolio Breakdown</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={miniStat}>
                      <small>Savings Deposit</small>
                      <b>{fmtINR(customer.accountDetails.savings)}</b>
                    </div>
                    <div style={miniStat}>
                      <small>Fixed Deposit</small>
                      <b>{fmtINR(customer.accountDetails.fixedDeposit)}</b>
                    </div>
                    <div style={miniStat}>
                      <small>Credit Limit</small>
                      <b>{fmtINR(customer.accountDetails.creditLimit)}</b>
                    </div>
                    <div style={miniStat}>
                      <small>Active Loans</small>
                      <b>{customer.accountDetails.activeLoans}</b>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI OUTREACH GENERATOR */}
          {activeTab === "outreach" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 12.5, color: COLOR.inkSoft, lineHeight: 1.5 }}>
                Generate customized retention messaging tailored to <b>{customer.name}</b>'s segment, tier, and primary churn driver (<i>{customer.driver}</i>).
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
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
<<<<<<< HEAD
                      fontSize: 11,
=======
                      fontSize: 11.5,
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                      fontWeight: 600,
                      borderRadius: 6,
                      border: outreachChannel === ch.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                      background: outreachChannel === ch.id ? COLOR.ink : "#fff",
                      color: outreachChannel === ch.id ? "#fff" : COLOR.inkSoft,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
<<<<<<< HEAD
                      gap: 5
=======
                      gap: 6
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
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
<<<<<<< HEAD
                  rows={13}
                  style={{ width: "100%", padding: 14, borderRadius: 8, border: `1px solid ${COLOR.hair}`, fontFamily: "IBM Plex Sans", fontSize: 12, lineHeight: 1.5, background: "#fff", color: COLOR.ink, outline: "none", resize: "none" }}
                />
                <button
                  onClick={handleCopyScript}
                  style={{ position: "absolute", top: 10, right: 10, padding: "5px 10px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
=======
                  rows={12}
                  style={{ width: "100%", padding: 14, borderRadius: 8, border: `1px solid ${COLOR.hair}`, fontFamily: "IBM Plex Sans", fontSize: 12.5, lineHeight: 1.5, background: "#fff", color: COLOR.ink, outline: "none", resize: "none" }}
                />
                <button
                  onClick={handleCopyScript}
                  style={{ position: "absolute", top: 10, right: 10, padding: "6px 12px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Template</>}
                </button>
              </div>
            </div>
          )}

<<<<<<< HEAD
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
              
=======
          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontFamily: "Fraunces", fontSize: 15, marginBottom: 4 }}>Signals & Servicing Log</div>
              {customer.history && customer.history.length > 0 ? (
                customer.history.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", padding: 12, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
                    <Clock size={15} color={COLOR.brass} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: COLOR.ink }}>{h.event}</div>
                      <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 2 }}>{h.date} • Type: <Tag tone={h.type === "signal" ? "risk" : "stable"}>{h.type}</Tag></div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 12, color: COLOR.inkSoft, fontStyle: "italic" }}>No prior signals logged.</div>
              )}
            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontFamily: "Fraunces", fontSize: 15 }}>Relationship Manager Notes</div>
              
              {/* Note Input */}
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
<<<<<<< HEAD
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
=======
                  placeholder="Enter call notes, client feedback, or retention offer updates..."
                  rows={4}
                  style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLOR.hair}`, fontSize: 12.5, outline: "none" }}
                />
                <button onClick={handleSaveNote} style={{ alignSelf: "flex-end", padding: "8px 16px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={13} /> Add RM Note
                </button>
              </div>

              {/* Saved Notes List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {customer.notes && customer.notes.map((n, i) => (
                  <div key={i} style={{ padding: 12, background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, fontSize: 12, lineHeight: 1.4 }}>
                    "{n}"
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

<<<<<<< HEAD
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
=======
        {/* Footer Actions */}
        <div style={{ padding: 16, borderTop: `1px solid ${COLOR.hair}`, background: "#fff", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onToggleQueue(customer.id)}
              style={{
                flex: 1,
                padding: 11,
                border: 0,
                borderRadius: 6,
                background: queued ? COLOR.stable : COLOR.brass,
                color: "#fff",
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              {queued ? <><Check size={15} /> Queued — Remove</> : "Queue Outreach"}
            </button>
            <button
              onClick={() => onMarkStatus(customer.id, customer.status === "Retained" ? "New" : "Retained")}
              style={{
                padding: "11px 16px",
                border: `1px solid ${COLOR.hair}`,
                borderRadius: 6,
                background: customer.status === "Retained" ? COLOR.stableSoft : "#fff",
                color: COLOR.ink,
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <CheckCircle2 size={15} color={COLOR.stable} /> {customer.status === "Retained" ? "Retained ✓" : "Mark Retained"}
            </button>
          </div>
        </div>

>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

const cardStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, fontSize: 12.5 };
const miniStat = { background: "#fff", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLOR.hair}`, display: "flex", flexDirection: "column" };
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
