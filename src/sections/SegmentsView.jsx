import { useState, useMemo } from "react";
import { Users, Filter, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, DollarSign } from "lucide-react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ZAxis } from "recharts";
import { COLOR } from "../constants/theme";
import { fmtINR } from "../utils/helpers";
import Tag from "../components/ui/Tag";

export default function SegmentsView({ customers, thresholds, onOpenCustomer, onQueueMultiple }) {
  const [activeSegmentTab, setActiveSegmentTab] = useState("all");
  const [minBalance, setMinBalance] = useState(0);
  const [minRisk, setMinRisk] = useState(50);
  const [selectedTier, setSelectedTier] = useState("all");

  // Segment groups
  const highRiskAccounts = useMemo(() => customers.filter(c => c.risk >= thresholds.high), [customers, thresholds]);
  const watchAccounts = useMemo(() => customers.filter(c => c.risk >= thresholds.mid && c.risk < thresholds.high), [customers, thresholds]);
  const stableAccounts = useMemo(() => customers.filter(c => c.risk < thresholds.mid), [customers, thresholds]);
  const vipRiskAccounts = useMemo(() => customers.filter(c => c.balance >= 500000 && c.risk >= 60), [customers]);

  // Scatter chart data formatting
  const scatterData = useMemo(() => {
    return customers.map(c => ({
      id: c.id,
      name: c.name,
      x: c.risk,
      y: c.balance / 1000, // Balance in Thousands (₹k)
      tier: c.tier,
      driver: c.driver,
      rawBalance: c.balance,
      obj: c
    }));
  }, [customers]);

  // Filtered accounts from Custom Segment Builder
  const customSegmentAccounts = useMemo(() => {
    return customers.filter(c => {
      const matchBal = c.balance >= minBalance;
      const matchRisk = c.risk >= minRisk;
      const matchTier = selectedTier === "all" || c.tier.includes(selectedTier);
      return matchBal && matchRisk && matchTier;
    });
  }, [customers, minBalance, minRisk, selectedTier]);

  return (
    <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink }}>Segment Analytics & Matrix Hub</div>
        <div style={{ fontSize: 13, color: COLOR.inkSoft }}>Drill down into risk distribution across deposit tiers, balance bands, and custom criteria.</div>
      </div>

      {/* Top 4 Segment Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <div onClick={() => setActiveSegmentTab("high")} style={cardBox(activeSegmentTab === "high")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLOR.risk }}>High Risk Segment</span>
            <Tag tone="risk">≥{thresholds.high}% Risk</Tag>
          </div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 28, fontWeight: 600, color: COLOR.risk, margin: "8px 0 2px" }}>
            {highRiskAccounts.length}
          </div>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
            Total Value: <b>{fmtINR(highRiskAccounts.reduce((a, b) => a + b.balance, 0))}</b>
          </div>
        </div>

        <div onClick={() => setActiveSegmentTab("watch")} style={cardBox(activeSegmentTab === "watch")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLOR.mid }}>Watch List</span>
            <Tag tone="mid">{thresholds.mid}-{thresholds.high - 1}% Risk</Tag>
          </div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 28, fontWeight: 600, color: COLOR.mid, margin: "8px 0 2px" }}>
            {watchAccounts.length}
          </div>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
            Total Value: <b>{fmtINR(watchAccounts.reduce((a, b) => a + b.balance, 0))}</b>
          </div>
        </div>

        <div onClick={() => setActiveSegmentTab("stable")} style={cardBox(activeSegmentTab === "stable")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLOR.stable }}>Stable Segment</span>
            <Tag tone="stable">&lt;{thresholds.mid}% Risk</Tag>
          </div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 28, fontWeight: 600, color: COLOR.stable, margin: "8px 0 2px" }}>
            {stableAccounts.length}
          </div>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
            Total Value: <b>{fmtINR(stableAccounts.reduce((a, b) => a + b.balance, 0))}</b>
          </div>
        </div>

        <div onClick={() => setActiveSegmentTab("vip")} style={cardBox(activeSegmentTab === "vip")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>VIP Accounts At Risk</span>
            <Tag tone="risk">Bal ≥ ₹5L & Risk ≥60%</Tag>
          </div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 28, fontWeight: 600, color: COLOR.ink, margin: "8px 0 2px" }}>
            {vipRiskAccounts.length}
          </div>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft }}>
            High Balance: <b>{fmtINR(vipRiskAccounts.reduce((a, b) => a + b.balance, 0))}</b>
          </div>
        </div>
      </div>

      {/* Risk vs Balance Matrix Scatter Chart */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "Fraunces", fontSize: 16 }}>Portfolio Risk vs. Balance Matrix Scatter</div>
            <div style={{ fontSize: 12, color: COLOR.inkSoft }}>Each point represents a customer account. Hover or click to inspect signals.</div>
          </div>
          <div style={{ fontSize: 11.5, color: COLOR.inkSoft, display: "flex", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR.risk }} /> High Risk</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR.mid }} /> Watch</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR.stable }} /> Stable</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="Risk Score (%)" unit="%" domain={[0, 100]} label={{ value: 'Churn Risk Score (%)', position: 'bottom', offset: 0, fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="Balance (₹k)" unit="k" label={{ value: 'Account Balance (₹ in Thousands)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, padding: 10, borderRadius: 6, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.15)" }}>
                    <b>{d.name}</b> ({d.id})<br />
                    Tier: {d.tier}<br />
                    Balance: <b>{fmtINR(d.rawBalance)}</b><br />
                    Risk Score: <b>{d.x}%</b><br />
                    Signal: <i>{d.driver}</i>
                  </div>
                );
              }}
            />
            <Scatter data={scatterData} cursor="pointer" onClick={(entry) => onOpenCustomer(entry.obj)}>
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.x >= thresholds.high ? COLOR.risk : entry.x >= thresholds.mid ? COLOR.mid : COLOR.stable} r={7} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Segment Rule Builder */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={18} color={COLOR.brass} />
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 16 }}>Custom Segment Rule Builder</div>
              <div style={{ fontSize: 12, color: COLOR.inkSoft }}>Filter custom cohorts dynamically and queue outreach in 1 click.</div>
            </div>
          </div>
          <button
            onClick={() => onQueueMultiple(customSegmentAccounts.map(c => c.id))}
            style={{ padding: "8px 16px", background: COLOR.brass, color: "#fff", border: 0, borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Sparkles size={14} /> Queue Outreach for {customSegmentAccounts.length} Segment Accounts
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, background: COLOR.paper, padding: 14, borderRadius: 8, border: `1px solid ${COLOR.hair}` }}>
          <div>
            <label style={labelStyle}>Min Risk Score: <b>{minRisk}%</b></label>
            <input type="range" min={0} max={95} value={minRisk} onChange={e => setMinRisk(Number(e.target.value))} style={{ width: "100%", accentColor: COLOR.risk }} />
          </div>
          <div>
            <label style={labelStyle}>Min Balance: <b>{fmtINR(minBalance)}</b></label>
            <input type="range" min={0} max={1000000} step={25000} value={minBalance} onChange={e => setMinBalance(Number(e.target.value))} style={{ width: "100%", accentColor: COLOR.brass }} />
          </div>
          <div>
            <label style={labelStyle}>Customer Tier Filter</label>
            <select value={selectedTier} onChange={e => setSelectedTier(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, background: "#fff" }}>
              <option value="all">All Tiers</option>
              <option value="Private">Private Banking</option>
              <option value="Business">Business Banking</option>
              <option value="Premier">Retail — Premier</option>
              <option value="Standard">Retail — Standard</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div>
          <div style={{ fontSize: 12, color: COLOR.inkSoft, marginBottom: 8 }}>
            Matching Cohort: <b>{customSegmentAccounts.length} accounts</b> (Combined Balance: <b>{fmtINR(customSegmentAccounts.reduce((a, b) => a + b.balance, 0))}</b>)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {customSegmentAccounts.map(c => (
              <div key={c.id} onClick={() => onOpenCustomer(c)} style={{ padding: 12, background: COLOR.paperRaised, border: `1px solid ${COLOR.hair}`, borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: COLOR.inkSoft }}>{c.tier} • {fmtINR(c.balance)}</div>
                </div>
                <Tag tone={c.risk >= 65 ? "risk" : c.risk >= 35 ? "mid" : "stable"}>{c.risk}% Risk</Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardBox = (active) => ({
  background: "#fff",
  border: active ? `2px solid ${COLOR.ink}` : `1px solid ${COLOR.hair}`,
  borderRadius: 10,
  padding: 16,
  cursor: "pointer",
  boxShadow: active ? "0 4px 14px rgba(0,0,0,.08)" : "none",
  transition: "all .15s ease"
});

const labelStyle = { display: "block", fontSize: 11.5, color: COLOR.inkSoft, marginBottom: 4 };
