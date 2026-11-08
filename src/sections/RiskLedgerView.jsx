import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Download, RefreshCw, ShieldAlert, Check } from "lucide-react";
import { COLOR } from "../constants/theme";
import { csvEscape } from "../utils/helpers";
import LedgerRow from "../components/customer/LedgerRow";
import EmptyState from "../components/ui/EmptyState";
import SortHeader from "../components/ui/SortHeader";

export default function RiskLedgerView({
  customers,
  queuedIds,
  selectedIds,
  toggleSelect,
  setSelected,
  onOpenCustomer,
  showToast,
  rms = []
}) {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [sortKey, setSortKey] = useState("risk");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let rows = customers.filter(c => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      const matchesTier = tierFilter === "all" || c.tier.includes(tierFilter);
      const matchesRisk =
        riskFilter === "all"
          ? true
          : riskFilter === "high"
          ? c.risk >= 65
          : riskFilter === "watch"
          ? c.risk >= 35 && c.risk < 65
          : c.risk < 35;
      const matchesStatus = statusFilter === "all" || (c.status || "New") === statusFilter;
      const matchesDriver = driverFilter === "all" || c.driver === driverFilter;

      return matchesQuery && matchesTier && matchesRisk && matchesStatus && matchesDriver;
    });

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey];
        if (typeof av === "string") {
          av = av.toLowerCase();
          bv = bv.toLowerCase();
        }
        return av < bv ? (sortDir === "asc" ? -1 : 1) : av > bv ? (sortDir === "asc" ? 1 : -1) : 0;
      });
    }
    return rows;
  }, [customers, query, tierFilter, riskFilter, statusFilter, driverFilter, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleExportCsv = () => {
    const header = ["Account ID", "Name", "Tier", "Balance", "Risk Score", "Driver", "Action", "Status", "RM"];
    const rows = filtered.map(c => [
      c.id,
      c.name,
      c.tier,
      c.balance,
      c.risk,
      c.driver,
      c.action,
      c.status || "New",
      rms.find(r => r.id === c.assignedRm)?.name || "Unassigned"
    ]);
    const csv = [header, ...rows].map(r => r.map(csvEscape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "risk-ledger-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} accounts`);
  };

  const resetFilters = () => {
    setQuery("");
    setTierFilter("all");
    setRiskFilter("all");
    setStatusFilter("all");
    setDriverFilter("all");
    setSortKey("risk");
    setSortDir("desc");
  };

  return (
    <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink }}>Risk Ledger Matrix</div>
          <div style={{ fontSize: 13, color: COLOR.inkSoft }}>Comprehensive churn audit log and real-time account risk signals.</div>
        </div>
        <button onClick={handleExportCsv} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 6, background: COLOR.ink, color: "#fff", border: 0, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
          <Download size={14} /> Export Risk Ledger CSV
        </button>
      </div>

      {/* Filter Control Toolbar */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: 220 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: COLOR.inkSoft }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name or ID..." style={{ width: "100%", padding: "7px 10px 7px 30px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12.5, outline: "none" }} />
        </div>

        {/* Tier Filter */}
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Tiers</option>
          <option value="Private">Private Banking</option>
          <option value="Business">Business Banking</option>
          <option value="Premier">Retail — Premier</option>
          <option value="Standard">Retail — Standard</option>
        </select>

        {/* Risk Level Filter */}
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk (≥65%)</option>
          <option value="watch">Watch (35-64%)</option>
          <option value="stable">Stable (&lt;35%)</option>
        </select>

        {/* Status Filter */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Outreach Status</option>
          <option value="New">New / Uncontacted</option>
          <option value="Queued">Queued</option>
          <option value="Contacted">Contacted</option>
          <option value="Retained">Retained</option>
        </select>

        <button onClick={resetFilters} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "transparent", fontSize: 12, color: COLOR.inkSoft, cursor: "pointer" }}>
          <RefreshCw size={12} /> Reset Filters
        </button>

        <div style={{ marginLeft: "auto", fontSize: 12, color: COLOR.inkSoft }}>
          Showing <b>{filtered.length}</b> of {customers.length} accounts
        </div>
      </div>

      {/* Table Grid */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 10, padding: 14, overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "22px 24px 2fr 1fr 96px 80px 84px 1.2fr 1.3fr 20px", gap: 10, padding: "0 10px 10px", borderBottom: `1px solid ${COLOR.ink}`, fontSize: 10.5, color: COLOR.inkSoft, textTransform: "uppercase", fontWeight: 600 }}>
          <div />
          <SortHeader label="#" />
          <SortHeader label="Customer" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
          <SortHeader label="Tier" active={sortKey === "tier"} dir={sortDir} onClick={() => toggleSort("tier")} />
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
              onOpen={onOpenCustomer}
              selected={selectedIds.has(c.id)}
              onToggleSelect={toggleSelect}
              queued={queuedIds.has(c.id)}
            />
          ))
        ) : (
          <div style={{ padding: "40px 0" }}>
            <EmptyState title="No accounts match your criteria" subtitle="Try clearing your search query or adjusting risk tier filters." actionLabel="Reset Filters" onAction={resetFilters} icon={ShieldAlert} />
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle = { padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, background: "#fff", outline: "none" };
