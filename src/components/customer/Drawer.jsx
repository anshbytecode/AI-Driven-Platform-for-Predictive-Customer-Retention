import { useState } from "react";
import { Check, X, Sparkles, Copy, Mail, MessageSquare, PhoneCall, Clock, FileText, UserCheck, CheckCircle2 } from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR, segLabel, generateScript } from "../../utils/helpers";
import SignalDial from "../ui/SignalDial";
import Sparkline from "../ui/Sparkline";
import Tag from "../ui/Tag";

export default function Drawer({ customer, onClose, queuedIds, onToggleQueue, onMarkStatus, onAddNote, onTriggerReassign, showToast, rms = [] }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, outreach, timeline, notes
  const [outreachChannel, setOutreachChannel] = useState("email"); // email, sms, script
  const [newNote, setNewNote] = useState("");
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const tone = customer.segment === "high" ? "risk" : customer.segment === "medium" ? "mid" : "stable";
  const queued = queuedIds.has(customer.id);
  const rm = rms.find(r => r.id === customer.assignedRm) || { name: "Priya Sharma", role: "Senior RM" };
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
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: 0, cursor: "pointer", color: COLOR.inkSoft }}><X size={20} /></button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {[
              { id: "overview", label: "Overview & Signals" },
              { id: "outreach", label: "AI Outreach" },
              { id: "timeline", label: "Timeline" },
              { id: "notes", label: "Notes" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: activeTab === tab.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                  background: activeTab === tab.id ? COLOR.ink : "transparent",
                  color: activeTab === tab.id ? "#fff" : COLOR.inkSoft,
                  cursor: "pointer"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
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
                    </div>
                  </div>
                </div>
              </div>

              {/* RM Assignment */}
              <div style={{ padding: 12, background: COLOR.paper, borderRadius: 8, border: `1px solid ${COLOR.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, textTransform: "uppercase", letterSpacing: ".06em" }}>Assigned Manager</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink }}>{rm.name}</div>
                  <div style={{ fontSize: 11, color: COLOR.inkSoft }}>{rm.role}</div>
                </div>
                <button onClick={() => onTriggerReassign(customer)} style={{ fontSize: 11, padding: "5px 10px", background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <UserCheck size={12} /> Reassign
                </button>
              </div>

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
                      <Tag tone="mid">Contributing</Tag>
                    </div>
                  ))}
                </div>
              </div>

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
                      fontSize: 11.5,
                      fontWeight: 600,
                      borderRadius: 6,
                      border: outreachChannel === ch.id ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
                      background: outreachChannel === ch.id ? COLOR.ink : "#fff",
                      color: outreachChannel === ch.id ? "#fff" : COLOR.inkSoft,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6
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
                  rows={12}
                  style={{ width: "100%", padding: 14, borderRadius: 8, border: `1px solid ${COLOR.hair}`, fontFamily: "IBM Plex Sans", fontSize: 12.5, lineHeight: 1.5, background: "#fff", color: COLOR.ink, outline: "none", resize: "none" }}
                />
                <button
                  onClick={handleCopyScript}
                  style={{ position: "absolute", top: 10, right: 10, padding: "6px 12px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Template</>}
                </button>
              </div>
            </div>
          )}

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
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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

      </div>
    </div>
  );
}

const cardStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, fontSize: 12.5 };
const miniStat = { background: "#fff", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLOR.hair}`, display: "flex", flexDirection: "column" };
