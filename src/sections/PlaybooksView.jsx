import { useState } from "react";
import { Sparkles, Play, CheckCircle2, Plus, ShieldCheck, TrendingUp, Users, X } from "lucide-react";
import { COLOR } from "../constants/theme";
import { PLAYBOOKS as INITIAL_PLAYBOOKS } from "../data/customers";
import { fmtINR } from "../utils/helpers";
import Button from "../components/ui/Button";

export default function PlaybooksView({ customers, onQueueMultiple, showToast }) {
  const [playbooks, setPlaybooks] = useState(INITIAL_PLAYBOOKS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [executedPlaybooks, setExecutedPlaybooks] = useState(new Set());

  // Form state for creating custom playbook
  const [newTitle, setNewTitle] = useState("");
  const [newSignal, setNewSignal] = useState("Rate shopping signal");
  const [newIncentive, setNewIncentive] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleRunPlaybook = (pb) => {
    // Find matching customer accounts for this playbook signal
    const matchingAccounts = customers.filter(c => c.driver === pb.signal || c.secondary?.includes(pb.signal));
    const matchingIds = matchingAccounts.map(c => c.id);

    if (matchingIds.length > 0) {
      onQueueMultiple(matchingIds);
      setExecutedPlaybooks(prev => new Set([...prev, pb.id]));
      showToast(`Playbook "${pb.title}" executed! Outreach queued for ${matchingIds.length} accounts.`);
    } else {
      showToast(`No accounts currently match signal "${pb.signal}"`);
    }
  };

  const handleCreatePlaybook = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPb = {
      id: `PB-0${playbooks.length + 1}`,
      title: newTitle,
      signal: newSignal,
      targetTier: "All Tiers",
      targetRisk: "> 50%",
      actionType: "Custom Automated Action",
      description: newDesc || "Custom retention strategy tailored to customer signal.",
      incentive: newIncentive || "Relationship Bonus",
      estConversion: "72%",
      retainedRev: "₹8.5 Lakhs",
      matchedCount: customers.filter(c => c.driver === newSignal).length,
      status: "Active"
    };

    setPlaybooks(prev => [newPb, ...prev]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewIncentive("");
    setNewDesc("");
    showToast(`Created new playbook: "${newPb.title}"`);
  };

  return (
    <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink }}>AI Playbook Execution Engine</div>
          <div style={{ fontSize: 13, color: COLOR.inkSoft }}>Automated, signal-triggered retention strategies and 1-click batch outreach workflows.</div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 6, background: COLOR.ink, color: "#fff", border: 0, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
        >
          <Plus size={15} color={COLOR.brassLight} /> Create Custom AI Playbook
        </button>
      </div>

      {/* Hero Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <div style={heroCard}>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>Active Enterprise Playbooks</div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 26, color: COLOR.ink, fontWeight: 600, marginTop: 4 }}>{playbooks.length}</div>
        </div>
        <div style={heroCard}>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>Total Potential Retained Rev</div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 26, color: COLOR.stable, fontWeight: 600, marginTop: 4 }}>₹45.9 Lakhs</div>
        </div>
        <div style={heroCard}>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>Avg Model Conversion Rate</div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 26, color: COLOR.brass, fontWeight: 600, marginTop: 4 }}>71.4%</div>
        </div>
      </div>

      {/* Playbooks Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {playbooks.map(pb => {
          const matchingAccounts = customers.filter(c => c.driver === pb.signal || c.secondary?.includes(pb.signal));
          const isExecuted = executedPlaybooks.has(pb.id);

          return (
            <div key={pb.id} style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,.03)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: COLOR.inkSoft }}>{pb.id} • {pb.targetRisk} Risk</span>
                    <h3 style={{ fontFamily: "Fraunces", fontSize: 18, color: COLOR.ink, margin: "2px 0 0" }}>{pb.title}</h3>
                  </div>
                  <span style={{ fontSize: 11, padding: "4px 8px", background: COLOR.paper, borderRadius: 12, border: `1px solid ${COLOR.hair}`, fontWeight: 600, color: COLOR.inkSoft }}>
                    {pb.signal}
                  </span>
                </div>

                <p style={{ fontSize: 12.5, color: COLOR.inkSoft, lineHeight: 1.5, margin: "8px 0 12px" }}>
                  {pb.description}
                </p>

                {/* Details Metrics */}
                <div style={{ background: COLOR.paper, padding: 12, borderRadius: 8, border: `1px solid ${COLOR.hair}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11.5 }}>
                  <div>
                    <div style={{ color: COLOR.inkSoft }}>Incentive Offer:</div>
                    <b style={{ color: COLOR.brass }}>{pb.incentive}</b>
                  </div>
                  <div>
                    <div style={{ color: COLOR.inkSoft }}>Targeted Accounts:</div>
                    <b style={{ color: COLOR.ink }}>{matchingAccounts.length} accounts</b>
                  </div>
                  <div>
                    <div style={{ color: COLOR.inkSoft }}>Est. Conversion:</div>
                    <b style={{ color: COLOR.stable }}>{pb.estConversion}</b>
                  </div>
                  <div>
                    <div style={{ color: COLOR.inkSoft }}>Retained Revenue:</div>
                    <b style={{ color: COLOR.ink }}>{pb.retainedRev}</b>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRunPlaybook(pb)}
                disabled={isExecuted || matchingAccounts.length === 0}
                style={{
                  width: "100%",
                  padding: 10,
                  border: 0,
                  borderRadius: 6,
                  background: isExecuted ? COLOR.stable : matchingAccounts.length > 0 ? COLOR.ink : "#D8D9CE",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12.5,
                  cursor: matchingAccounts.length > 0 && !isExecuted ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all .15s"
                }}
              >
                {isExecuted ? (
                  <><CheckCircle2 size={15} /> Playbook Dispatched ({matchingAccounts.length} Queued)</>
                ) : matchingAccounts.length > 0 ? (
                  <><Play size={14} fill="#fff" /> Execute Playbook on {matchingAccounts.length} Accounts</>
                ) : (
                  "No Matching Accounts Active"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Playbook Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgba(15,24,38,.55)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 500, borderRadius: 12, boxShadow: "0 20px 48px rgba(0,0,0,.25)", overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", background: COLOR.panel, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "Fraunces", fontSize: 18 }}>Create AI Retention Playbook</div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "transparent", border: 0, color: "#9AA6B8", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreatePlaybook} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Playbook Title *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. VIP Deposit Rate Saver" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Target Trigger Signal</label>
                <select value={newSignal} onChange={e => setNewSignal(e.target.value)} style={inputStyle}>
                  <option value="Rate shopping signal">Rate shopping signal</option>
                  <option value="Competitor offer clicked">Competitor offer clicked</option>
                  <option value="Declining transactions">Declining transactions</option>
                  <option value="Onboarding drop-off">Onboarding drop-off</option>
                  <option value="Fee sensitivity">Fee sensitivity</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Incentive Offer Package</label>
                <input value={newIncentive} onChange={e => setNewIncentive(e.target.value)} placeholder="e.g. 0.5% Rate Match + Zero Annual Fee" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Strategy Description</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} placeholder="Describe the workflow triggers and RM follow-up procedure..." style={{ ...inputStyle, resize: "none" }} />
              </div>

              <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Button type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <button type="submit" style={{ padding: "9px 18px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={14} color={COLOR.brassLight} /> Save Playbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const heroCard = { background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: "16px 20px" };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: COLOR.inkSoft, marginBottom: 4 };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 13, outline: "none" };
