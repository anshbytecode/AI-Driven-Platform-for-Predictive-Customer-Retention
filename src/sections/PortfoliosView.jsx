import { useState, useMemo } from "react";
import { Landmark, Users, ShieldAlert, CheckCircle2, UserCheck, ArrowUpRight } from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";

export default function PortfoliosView({ customers, rms, onTriggerReassign, onOpenCustomer }) {
  const [selectedRmFilter, setSelectedRmFilter] = useState("all");

  // Tier metrics calculation
  const tierStats = useMemo(() => {
    const tiers = ["Private Banking", "Business Banking", "Retail — Premier", "Retail — Standard"];
    return tiers.map(tier => {
      const match = customers.filter(c => c.tier.includes(tier.split("—")[0].trim()));
      const totalBal = match.reduce((a, b) => a + b.balance, 0);
      const highRiskCount = match.filter(c => c.risk >= 65).length;
      return { tier, count: match.length, totalBal, highRiskCount };
    });
  }, [customers]);

  // RM workload metrics
  const rmWorkload = useMemo(() => {
    return rms.map(rm => {
      const assigned = customers.filter(c => c.assignedRm === rm.id);
      const riskCount = assigned.filter(c => c.risk >= 65).length;
      const totalBal = assigned.reduce((a, b) => a + b.balance, 0);
      const retainedCount = assigned.filter(c => c.status === "Retained").length;
      return { ...rm, assignedAccounts: assigned, riskCount, totalBal, retainedCount };
    });
  }, [customers, rms]);

  return (
    <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
      {/* View Header */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink }}>Portfolios & Relationship Managers</div>
        <div style={{ fontSize: 13, color: COLOR.inkSoft }}>Portfolio tier allocation, Relationship Manager (RM) capacity, and SLA tracking.</div>
      </div>

      {/* Tier Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {tierStats.map(t => (
          <div key={t.tier} style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLOR.inkSoft, fontWeight: 600 }}>{t.tier}</span>
              {t.highRiskCount > 0 && <Tag tone="risk">{t.highRiskCount} at risk</Tag>}
            </div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: 24, fontWeight: 600, color: COLOR.ink, margin: "8px 0 2px" }}>
              {fmtINR(t.totalBal)}
            </div>
            <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
              {t.count} accounts in tier
            </div>
          </div>
        ))}
      </div>

      {/* RM Workload Allocation Table */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "Fraunces", fontSize: 18, color: COLOR.ink }}>Relationship Manager Capacity & Workload Grid</div>
            <div style={{ fontSize: 12, color: COLOR.inkSoft }}>Balance managed, flagged risk count, and SLA performance per RM.</div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLOR.ink}`, fontSize: 11, color: COLOR.inkSoft, textTransform: "uppercase" }}>
                <th style={{ padding: "10px 12px" }}>Relationship Manager</th>
                <th style={{ padding: "10px 12px" }}>Role / Unit</th>
                <th style={{ padding: "10px 12px" }}>Active Accounts</th>
                <th style={{ padding: "10px 12px" }}>Total Portfolio Balance</th>
                <th style={{ padding: "10px 12px" }}>High Risk Flagged</th>
                <th style={{ padding: "10px 12px" }}>Status / SLA</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rmWorkload.map(rm => (
                <tr key={rm.id} style={{ borderBottom: `1px solid ${COLOR.hair}` }}>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ fontWeight: 600, color: COLOR.ink }}>{rm.name}</div>
                    <div style={{ fontSize: 11, color: COLOR.inkSoft }}>{rm.email}</div>
                  </td>
                  <td style={{ padding: "14px 12px", color: COLOR.inkSoft, fontSize: 12 }}>{rm.role}</td>
                  <td style={{ padding: "14px 12px", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{rm.assignedAccounts.length}</td>
                  <td style={{ padding: "14px 12px", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmtINR(rm.totalBal)}</td>
                  <td style={{ padding: "14px 12px" }}>
                    {rm.riskCount > 0 ? (
                      <Tag tone="risk">{rm.riskCount} accounts</Tag>
                    ) : (
                      <Tag tone="stable">0 flagged</Tag>
                    )}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ fontSize: 12, color: COLOR.stable, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={13} /> 98% SLA
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right" }}>
                    <button
                      onClick={() => onTriggerReassign(rm.assignedAccounts[0])}
                      disabled={rm.assignedAccounts.length === 0}
                      style={{ padding: "6px 12px", fontSize: 11.5, background: COLOR.paper, border: `1px solid ${COLOR.hair}`, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <UserCheck size={12} /> Reassign Portfolio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account List by RM */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontFamily: "Fraunces", fontSize: 16, marginBottom: 12 }}>Assigned Account Drilldown</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <button onClick={() => setSelectedRmFilter("all")} style={pillStyle(selectedRmFilter === "all")}>
            All RMs
          </button>
          {rms.map(r => (
            <button key={r.id} onClick={() => setSelectedRmFilter(r.id)} style={pillStyle(selectedRmFilter === r.id)}>
              {r.name}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {customers
            .filter(c => selectedRmFilter === "all" || c.assignedRm === selectedRmFilter)
            .map(c => {
              const rmObj = rms.find(r => r.id === c.assignedRm);
              return (
                <div key={c.id} onClick={() => onOpenCustomer(c)} style={{ padding: 12, background: COLOR.paperRaised, border: `1px solid ${COLOR.hair}`, borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: COLOR.inkSoft }}>{c.tier} • {fmtINR(c.balance)}</div>
                    <div style={{ fontSize: 10.5, color: COLOR.brass, marginTop: 2 }}>RM: {rmObj?.name || "Unassigned"}</div>
                  </div>
                  <Tag tone={c.risk >= 65 ? "risk" : c.risk >= 35 ? "mid" : "stable"}>{c.risk}% Risk</Tag>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const pillStyle = (active) => ({
  padding: "6px 12px",
  borderRadius: 16,
  fontSize: 12,
  border: active ? `1px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
  background: active ? COLOR.ink : "transparent",
  color: active ? "#fff" : COLOR.inkSoft,
  cursor: "pointer"
});
