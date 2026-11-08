import { SlidersHorizontal, Percent, ChevronDown, RefreshCw, FilterX, Download, Inbox, Sparkles, Plus, Settings, Bot } from "lucide-react";
import { COLOR } from "../constants/theme";
import { getSegment, segLabel } from "../utils/helpers";
import HeroStats from "../components/dashboard/HeroStats";
import ThresholdPanel from "../components/dashboard/ThresholdPanel";
import DriverChart from "../components/dashboard/DriverChart";
import LedgerRow from "../components/customer/LedgerRow";
import EmptyState from "../components/ui/EmptyState";
import SortHeader from "../components/ui/SortHeader";
import Tag from "../components/ui/Tag";

export default function OverviewSection(p) {
  const {
    customers,
    counts,
    filtered,
    queuedIds,
    selectedIds,
    toggleSelect,
    setSelected,
    segmentFilter,
    setSegmentFilter,
    showThresholds,
    setShowThresholds,
    thresholds,
    setThresholds,
    resetAll,
    exportCsv,
    visibleQueued,
    sortKey,
    sortDir,
    toggleSort,
    onOpenAddAccount,
    onOpenSettings,
    onOpenCopilot
  } = p;

  const totalAccounts = customers ? customers.length : counts.all;
  const list = customers || [];
  const avg = Math.round(list.reduce((a, c) => a + c.risk, 0) / (list.length || 1));
  const riskRevenue = list.filter(c => getSegment(c.risk, thresholds) === "high").reduce((a, c) => a + c.balance, 0) / 100000;

  return (
    <>
      <HeroStats
        riskIndex={avg}
        avgConfidence={82}
        revenueAtRisk={riskRevenue}
        flaggedCount={counts.high + counts.medium}
        queuedCount={queuedIds.size}
        total={totalAccounts}
      />

      {/* AI Insights & Quick Action Toolbar */}
      <div style={{ padding: "16px 28px 4px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Live Ticker */}
        <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color={COLOR.brassLight} />
            <span><b>Live AI Diagnostic:</b> 3 Private Banking accounts detected with elevated deposit rate comparisons.</span>
          </div>
          <button onClick={() => onOpenCopilot("Analyze high risk accounts")} style={{ background: COLOR.brass, color: "#fff", border: 0, padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Bot size={12} /> Ask Copilot
          </button>
        </div>

        {/* Filter Pills & Quick Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <SlidersHorizontal size={13} />
          {[
            ["all", "All accounts", counts.all],
            ["high", "High risk", counts.high],
            ["medium", "Watch", counts.medium],
            ["low", "Stable", counts.low]
          ].map(([key, label, count]) => (
            <button key={key} onClick={() => setSegmentFilter(key)} style={pill(segmentFilter === key)}>
              {label} <small>({count})</small>
            </button>
          ))}

          <button onClick={() => setShowThresholds(v => !v)} style={pill(showThresholds)}>
            <Percent size={12} /> Sensitivity <ChevronDown size={12} />
          </button>

          <button onClick={resetAll} style={pill(false)}>
            <RefreshCw size={12} /> Reset
          </button>

          {/* Quick Action Buttons */}
          <button onClick={onOpenAddAccount} style={{ ...pill(true), background: COLOR.brass, borderColor: COLOR.brass, marginLeft: "auto" }}>
            <Plus size={13} /> Add Account
          </button>
          <button onClick={onOpenSettings} style={pill(false)}>
            <Settings size={13} /> Settings
          </button>
          <button onClick={exportCsv} style={pill(true)}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        {showThresholds && <ThresholdPanel thresholds={thresholds} setThresholds={setThresholds} onReset={resetAll} />}
      </div>

      {/* Driver Chart Visualizer */}
      <div style={{ padding: "14px 28px 4px" }}>
        <DriverChart />
      </div>

      {/* Table Section */}
      <div style={{ padding: "14px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: COLOR.inkSoft }}>
          <span><Inbox size={13} /> {visibleQueued} queued in current view</span>
          <span>Showing {filtered.length} of {totalAccounts} accounts</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "22px 24px 2fr 1fr 96px 80px 84px 1.2fr 1.3fr 20px", gap: 10, padding: "0 10px 8px", borderBottom: `1px solid ${COLOR.ink}`, fontSize: 10.5, color: COLOR.inkSoft, textTransform: "uppercase" }}>
          <div />
          <SortHeader label="#" />
          <SortHeader label="Customer" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
          <SortHeader label="Segment" />
          <SortHeader label="Balance" active={sortKey === "balance"} dir={sortDir} onClick={() => toggleSort("balance")} />
          <SortHeader label="Risk" active={sortKey === "risk"} dir={sortDir} onClick={() => toggleSort("risk")} />
          <SortHeader label="6-wk trend" />
          <SortHeader label="Top driver" />
          <SortHeader label="Recommended action" />
          <div />
        </div>

        {filtered.length ? (
          filtered.map((c, i) => (
            <LedgerRow
              key={c.id}
              c={c}
              i={i}
              onOpen={setSelected}
              selected={selectedIds.has(c.id)}
              onToggleSelect={toggleSelect}
              queued={queuedIds.has(c.id)}
            />
          ))
        ) : (
          <div style={{ paddingTop: 18 }}>
            <EmptyState title="No accounts match this view" subtitle="Try clearing filters or searching a different customer." actionLabel="Reset filters" onAction={resetAll} />
          </div>
        )}
      </div>
    </>
  );
}

const pill = active => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  padding: "6px 12px",
  borderRadius: 20,
  border: `1px solid ${active ? COLOR.ink : COLOR.hair}`,
  background: active ? COLOR.ink : "transparent",
  color: active ? "#F3F1E9" : COLOR.inkSoft,
  cursor: "pointer"
});
