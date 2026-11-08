import { useState } from "react";
import { Sparkles, Plus, Target, ArrowRight, CheckCircle2, TrendingUp, Layers, Award } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR, fmtLakh } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function CampaignsAbSection({ showToast }) {
  const [activeTab, setActiveTab] = useState("campaigns"); // 'campaigns' or 'ab_tests'
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initial Campaigns Data
  const [campaigns, setCampaigns] = useState([
    {
      id: "CMP-2026-01",
      title: "Q3 High-Yield FD Retention Sprint",
      target_segment: "High-value/high-risk",
      intervention: "20% Personalized Fee Waiver + 7.45% Deposit Rate Match",
      channel: "Direct RM Concierge Call",
      status: "Active",
      targeted: 340,
      contacted: 295,
      responded: 242,
      retained: 198,
      churned: 44,
      budget: 500000,
      cost_spent: 312000,
      revenue_saved: 2840000,
      roi_pct: 810.2
    },
    {
      id: "CMP-2026-02",
      title: "Premier Credit Card Fee Waiver Campaign",
      target_segment: "Price-sensitive",
      intervention: "Annual Card Fee Waiver + 15% Bonus Reward Points",
      channel: "WhatsApp & In-App Push",
      status: "Active",
      targeted: 850,
      contacted: 810,
      responded: 560,
      retained: 480,
      churned: 80,
      budget: 250000,
      cost_spent: 185000,
      revenue_saved: 1240000,
      roi_pct: 570.3
    },
    {
      id: "CMP-2026-03",
      title: "New Retail Customer Onboarding Rescue",
      target_segment: "New",
      intervention: "₹500 Welcome UPI Cashback + Guided Setup Call",
      channel: "Automated SMS & Email Sequence",
      status: "Active",
      targeted: 1200,
      contacted: 1150,
      responded: 720,
      retained: 610,
      churned: 110,
      budget: 150000,
      cost_spent: 98000,
      revenue_saved: 490000,
      roi_pct: 400.0
    }
  ]);

  // A/B Testing Data
  const abTests = [
    {
      id: "AB-2026-A",
      test_name: "Q3 Retention Intervention 4-Arm Experiment",
      description: "Comparative study across 4 distinct customer retention treatments to determine optimal ROI and retention conversion.",
      groups: [
        { group: "Group A", strategy: "10% Fee Waiver", retained_pct: 68.4, sample: 600, cost_per_cust: "₹1,200", roi: "5.4x" },
        { group: "Group B", strategy: "Loyalty Points (3x Multiplier)", retained_pct: 74.8, sample: 600, cost_per_cust: "₹950", roi: "7.1x" },
        { group: "Group C", strategy: "Priority RM Dedicated Support", retained_pct: 82.6, sample: 600, cost_per_cust: "₹1,800", roi: "9.2x", is_winner: true },
        { group: "Group D", strategy: "Control (Standard Email)", retained_pct: 41.2, sample: 600, cost_per_cust: "₹0", roi: "1.0x" }
      ],
      winner: "Group C: Priority RM Dedicated Support",
      significance: "99.4% (p < 0.001)",
      recommendation: "Scale Group C Priority RM protocol across all Private Banking and Premier accounts."
    }
  ];

  // Form State for creating a campaign
  const [newTitle, setNewTitle] = useState("");
  const [newSegment, setNewSegment] = useState("High-value/high-risk");
  const [newIntervention, setNewIntervention] = useState("20% Personalized Fee Discount");
  const [newBudget, setNewBudget] = useState("300000");

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCamp = {
      id: `CMP-${Date.now().toString().slice(-6)}`,
      title: newTitle,
      target_segment: newSegment,
      intervention: newIntervention,
      channel: "Direct RM Concierge Call",
      status: "Active",
      targeted: 150,
      contacted: 0,
      responded: 0,
      retained: 0,
      churned: 0,
      budget: parseFloat(newBudget),
      cost_spent: 0,
      revenue_saved: 0,
      roi_pct: 0
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setShowCreateModal(false);
    setNewTitle("");
    showToast(`Campaign "${newTitle}" created and deployed to RM queue!`);
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
            Retention Campaign Management & A/B Testing
          </div>
          <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
            Track multi-stage retention funnels (Targeted → Contacted → Responded → Retained) and evaluate multi-arm treatment experiments.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {/* Tab Switcher */}
          <div style={{ display: "flex", background: COLOR.paper, padding: 3, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
            <button
              onClick={() => setActiveTab("campaigns")}
              style={{
                padding: "7px 14px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: 0,
                background: activeTab === "campaigns" ? "#fff" : "transparent",
                color: activeTab === "campaigns" ? COLOR.ink : COLOR.inkSoft,
                boxShadow: activeTab === "campaigns" ? "0 2px 4px rgba(0,0,0,.08)" : "none"
              }}
            >
              Active Retention Campaigns
            </button>
            <button
              onClick={() => setActiveTab("ab_tests")}
              style={{
                padding: "7px 14px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: 0,
                background: activeTab === "ab_tests" ? "#fff" : "transparent",
                color: activeTab === "ab_tests" ? COLOR.ink : COLOR.inkSoft,
                boxShadow: activeTab === "ab_tests" ? "0 2px 4px rgba(0,0,0,.08)" : "none"
              }}
            >
              A/B/C/D Experiment Matrix
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "7px 14px",
              background: COLOR.ink,
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
            <Plus size={14} color={COLOR.brassLight} /> Launch Campaign
          </button>
        </div>
      </div>

      {/* TAB 1: CAMPAIGN LIFECYCLE MANAGEMENT */}
      {activeTab === "campaigns" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {campaigns.map(camp => (
            <div key={camp.id} style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: COLOR.ink }}>{camp.title}</span>
                    <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, color: COLOR.inkSoft, background: COLOR.paper, padding: "1px 6px", borderRadius: 4 }}>
                      {camp.id}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "rgba(62,107,82,.1)", color: COLOR.stable }}>
                      {camp.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLOR.inkSoft, marginTop: 4 }}>
                    Segment: <b>{camp.target_segment}</b> • Intervention: <b style={{ color: COLOR.brass }}>{camp.intervention}</b>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <div>
                    <span style={{ color: COLOR.inkSoft }}>Budget Spent: </span>
                    <b style={{ color: COLOR.ink }}>{fmtINR(camp.cost_spent)} / {fmtINR(camp.budget)}</b>
                  </div>
                  <div>
                    <span style={{ color: COLOR.inkSoft }}>Revenue Preserved: </span>
                    <b style={{ color: COLOR.brass }}>{fmtINR(camp.revenue_saved)}</b>
                  </div>
                  <div>
                    <span style={{ color: COLOR.inkSoft }}>Projected ROI: </span>
                    <b style={{ color: COLOR.stable }}>{camp.roi_pct}%</b>
                  </div>
                </div>
              </div>

              {/* 5-Stage Retention Funnel */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, background: COLOR.paperRaised, padding: 14, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                {/* 1. Targeted */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>1. TARGETED</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.ink, marginTop: 2 }}>{camp.targeted}</div>
                  <div style={{ fontSize: 10, color: COLOR.inkSoft }}>100% of cohort</div>
                </div>

                {/* 2. Contacted */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>2. CONTACTED</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.blue, marginTop: 2 }}>{camp.contacted}</div>
                  <div style={{ fontSize: 10, color: COLOR.inkSoft }}>{Math.round((camp.contacted / (camp.targeted || 1)) * 100)}% reached</div>
                </div>

                {/* 3. Responded */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>3. RESPONDED</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.brass, marginTop: 2 }}>{camp.responded}</div>
                  <div style={{ fontSize: 10, color: COLOR.inkSoft }}>{Math.round((camp.responded / (camp.contacted || 1)) * 100)}% engagement</div>
                </div>

                {/* 4. Retained */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>4. RETAINED</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.stable, marginTop: 2 }}>{camp.retained}</div>
                  <div style={{ fontSize: 10, color: COLOR.stable, fontWeight: 700 }}>{Math.round((camp.retained / (camp.targeted || 1)) * 100)}% converted</div>
                </div>

                {/* 5. Churned */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700 }}>5. CHURNED</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.risk, marginTop: 2 }}>{camp.churned}</div>
                  <div style={{ fontSize: 10, color: COLOR.risk }}>{Math.round((camp.churned / (camp.targeted || 1)) * 100)}% lost</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: A/B/C/D EXPERIMENTS MATRIX */}
      {activeTab === "ab_tests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {abTests.map(test => (
            <div key={test.id} style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: COLOR.ink }}>{test.test_name}</div>
                    <span style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 4, background: "rgba(37,99,235,.1)", color: COLOR.blue, fontWeight: 700 }}>
                      Statistical Significance: {test.significance}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLOR.inkSoft, marginTop: 4 }}>
                    {test.description}
                  </div>
                </div>
              </div>

              {/* 4 Groups Comparison Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 12 }}>
                {test.groups.map(grp => (
                  <div
                    key={grp.group}
                    style={{
                      background: grp.is_winner ? "rgba(62,107,82,.06)" : COLOR.paperRaised,
                      border: `1.5px solid ${grp.is_winner ? COLOR.stable : COLOR.hair}`,
                      borderRadius: 8,
                      padding: 16,
                      position: "relative"
                    }}
                  >
                    {grp.is_winner && (
                      <div style={{
                        position: "absolute",
                        top: -10,
                        right: 12,
                        background: COLOR.stable,
                        color: "#fff",
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 8
                      }}>
                        🏆 WINNING STRATEGY
                      </div>
                    )}

                    <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.inkSoft }}>{grp.group}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink, marginTop: 2, minHeight: 36 }}>
                      {grp.strategy}
                    </div>

                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: 11.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: COLOR.inkSoft }}>Retention Rate:</span>
                        <span style={{ fontWeight: 700, color: grp.is_winner ? COLOR.stable : COLOR.ink, fontSize: 13 }}>
                          {grp.retained_pct}%
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: COLOR.inkSoft }}>Sample Size:</span>
                        <span style={{ fontWeight: 600 }}>{grp.sample}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: COLOR.inkSoft }}>Cost / Customer:</span>
                        <span style={{ fontWeight: 600 }}>{grp.cost_per_cust}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: COLOR.inkSoft }}>ROI Multiplier:</span>
                        <span style={{ fontWeight: 700, color: COLOR.brass }}>{grp.roi}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendation Callout */}
              <div style={{ marginTop: 18, padding: "12px 16px", background: "rgba(169,124,63,.08)", border: `1px solid rgba(169,124,63,.2)`, borderRadius: 6, fontSize: 12, color: COLOR.ink }}>
                <b>Executive Recommendation:</b> {test.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center" }}>
          <div onClick={() => setShowCreateModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,24,38,.5)", backdropFilter: "blur(2px)" }} />
          <div style={{ position: "relative", width: 440, background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 12px 32px rgba(0,0,0,.25)" }}>
            <div style={{ fontFamily: "Fraunces", fontSize: 20, color: COLOR.ink, fontWeight: 600 }}>
              Launch New Retention Campaign
            </div>
            <div style={{ fontSize: 12, color: COLOR.inkSoft, marginTop: 4, marginBottom: 18 }}>
              Deploy targeted interventions to high-risk cohorts with automated RM task assignment.
            </div>

            <form onSubmit={handleCreateCampaign} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 4 }}>Campaign Title</label>
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Deposit Parity & Fee Waiver Sprint"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 4 }}>Target Customer Segment</label>
                <select
                  value={newSegment}
                  onChange={e => setNewSegment(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none", background: "#fff" }}
                >
                  <option value="High-value/high-risk">High-value / High-risk</option>
                  <option value="Price-sensitive">Price-sensitive</option>
                  <option value="At-risk">At-risk</option>
                  <option value="New">New Onboarding</option>
                  <option value="Dormant">Dormant</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 4 }}>Selected Retention Intervention</label>
                <select
                  value={newIntervention}
                  onChange={e => setNewIntervention(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none", background: "#fff" }}
                >
                  <option value="20% Personalized Fee Discount">20% Personalized Fee Discount</option>
                  <option value="Priority RM Concierge Calling">Priority RM Concierge Calling</option>
                  <option value="7.45% Fixed Deposit Rate Match Guarantee">7.45% Fixed Deposit Rate Match Guarantee</option>
                  <option value="3x Bonus Loyalty Multiplier">3x Bonus Loyalty Multiplier</option>
                  <option value="Zero-Markup FX Remittance Waiver">Zero-Markup FX Remittance Waiver</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 4 }}>Campaign Budget (INR)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "transparent", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 6, border: 0, background: COLOR.ink, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  Deploy Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

