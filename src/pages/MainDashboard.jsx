import { useState, useMemo, useRef } from "react";
import { CUSTOMERS as INITIAL_CUSTOMERS, RELATIONSHIP_MANAGERS as INITIAL_RMS } from "../data/customers";
import { COLOR, FONTS } from "../constants/theme";
import { getSegment, csvEscape } from "../utils/helpers";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import OverviewSection from "../sections/OverviewSection";
import RiskLedgerView from "../sections/RiskLedgerView";
import SegmentsView from "../sections/SegmentsView";
import PlaybooksView from "../sections/PlaybooksView";
import PortfoliosView from "../sections/PortfoliosView";

import BulkBar from "../components/dashboard/BulkBar";
import Drawer from "../components/customer/Drawer";
import Toast from "../components/customer/Toast";

import AddAccountModal from "../components/customer/AddAccountModal";
import ReassignModal from "../components/customer/ReassignModal";
import SettingsModal from "../components/dashboard/SettingsModal";
import MeridianCopilot from "../components/ai/MeridianCopilot";

export default function MainDashboard({ user, onLogout }) {
  // Master state
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [rms, setRms] = useState(INITIAL_RMS);
  const [query, setQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  // Thresholds & Sort
  const [thresholds, setThresholds] = useState({ high: 65, mid: 35 });
  const [showThresholds, setShowThresholds] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("desc");

  // Selection & Queueing
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [queuedIds, setQueuedIds] = useState(new Set(["AC-40217", "AC-40227"]));
  const [toast, setToast] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");

  // Modals state
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [reassignTargetAccounts, setReassignTargetAccounts] = useState([]);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState("");

  const timer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  };

  // Segment computation
  const withSegment = useMemo(() => {
    return customers.map(c => ({
      ...c,
      segment: getSegment(c.risk, thresholds)
    }));
  }, [customers, thresholds]);

  const counts = useMemo(() => ({
    all: withSegment.length,
    high: withSegment.filter(c => c.segment === "high").length,
    medium: withSegment.filter(c => c.segment === "medium").length,
    low: withSegment.filter(c => c.segment === "low").length
  }), [withSegment]);

  // Filtering & Sorting
  const filtered = useMemo(() => {
    let rows = withSegment.filter(c => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      const matchSeg = segmentFilter === "all" || c.segment === segmentFilter;
      return matchQ && matchSeg;
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
  }, [withSegment, query, segmentFilter, sortKey, sortDir]);

  // Action handlers
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleQueue = (id) => {
    setQueuedIds(s => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
        showToast("Removed from outreach queue");
      } else {
        n.add(id);
        showToast("Outreach queued for Relationship Manager");
      }
      return n;
    });
  };

  const queueMultiple = (ids = []) => {
    setQueuedIds(s => new Set([...s, ...ids]));
    showToast(`Outreach queued for ${ids.length} accounts`);
    setSelectedIds(new Set());
  };

  const bulkQueue = () => {
    queueMultiple([...selectedIds]);
  };

  const clearQueue = () => {
    setQueuedIds(new Set());
    showToast("Outreach queue cleared");
  };

  const resetAll = () => {
    setQuery("");
    setSegmentFilter("all");
    setThresholds({ high: 65, mid: 35 });
    setSortKey(null);
    setSortDir("desc");
    setSelectedIds(new Set());
    setSelected(null);
    showToast("Filters and sensitivity reset to defaults");
  };

  const exportCsv = () => {
    const header = ["Account ID", "Name", "Tier", "Balance", "Risk Score", "Segment", "Top Driver", "Recommended Action"];
    const rows = filtered.map(c => [c.id, c.name, c.tier, c.balance, c.risk, c.segment, c.driver, c.action]);
    const csv = [header, ...rows].map(r => r.map(csvEscape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "meridian-retention-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} accounts`);
  };

  const handleAddAccount = (newAcc) => {
    setCustomers(prev => [newAcc, ...prev]);
    showToast(`Added ${newAcc.name} (${newAcc.id}) to Retention Matrix`);
  };

  const handleMarkStatus = (accId, newStatus) => {
    setCustomers(prev => prev.map(c => c.id === accId ? { ...c, status: newStatus } : c));
    if (selected && selected.id === accId) {
      setSelected(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Updated ${accId} status to "${newStatus}"`);
  };

  const handleAddNote = (accId, noteText) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === accId) {
        const updatedNotes = [noteText, ...(c.notes || [])];
        return { ...c, notes: updatedNotes };
      }
      return c;
    }));
    if (selected && selected.id === accId) {
      setSelected(prev => ({ ...prev, notes: [noteText, ...(prev.notes || [])] }));
    }
  };

  const handleReassign = (accountIds, newRmId) => {
    setCustomers(prev => prev.map(c => accountIds.includes(c.id) ? { ...c, assignedRm: newRmId } : c));
    showToast(`Reassigned ${accountIds.length} account(s)`);
  };

  const triggerReassignModal = (account) => {
    setReassignTargetAccounts(account ? [account] : [...selectedIds].map(id => customers.find(c => c.id === id)).filter(Boolean));
    setShowReassign(true);
  };

  const openCopilotWithQuery = (q = "") => {
    setCopilotQuery(q);
    setShowCopilot(true);
  };

  const alerts = [...withSegment].sort((a, b) => b.risk - a.risk).slice(0, 4);
  const visibleQueued = filtered.filter(c => queuedIds.has(c.id)).length;

  const sectionProps = {
    customers: withSegment,
    counts,
    filtered,
    queuedIds,
    selectedIds,
    toggleSelect,
    setSelected: (c) => setSelected(c),
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
    onOpenAddAccount: () => setShowAddAccount(true),
    onOpenSettings: () => setShowSettings(true),
    onOpenCopilot: openCopilotWithQuery,
    onOpenCustomer: (c) => setSelected(c),
    onQueueMultiple: queueMultiple,
    onTriggerReassign: triggerReassignModal,
    onSelectSection: (s) => setActiveSection(s),
    showToast,
    rms
  };

  let mainContent = <OverviewSection {...sectionProps} />;
  if (activeSection === "Risk Ledger") mainContent = <RiskLedgerView {...sectionProps} />;
  if (activeSection === "Segments") mainContent = <SegmentsView {...sectionProps} />;
  if (activeSection === "AI Playbooks") mainContent = <PlaybooksView {...sectionProps} />;
  if (activeSection === "Portfolios") mainContent = <PortfoliosView {...sectionProps} />;

  return (
    <div style={{ fontFamily: "IBM Plex Sans", background: COLOR.paper, minHeight: "100vh", display: "flex" }}>
      <style>{`${FONTS}*{box-sizing:border-box}.ledger-row:hover{background:rgba(169,124,63,.06)!important}@media(max-width:880px){.sidebar{display:none}.ledger-row{grid-template-columns:20px 20px 1.4fr 84px 16px!important}.ledger-row>*:nth-child(4),.ledger-row>*:nth-child(6),.ledger-row>*:nth-child(7),.ledger-row>*:nth-child(8),.ledger-row>*:nth-child(9){display:none!important}}`}</style>

      {/* Sidebar */}
      <Sidebar
        queuedCount={queuedIds.size}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenCopilot={openCopilotWithQuery}
        highRiskCount={counts.high}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar
          query={query}
          setQuery={setQuery}
          alerts={alerts}
          onPick={(c) => setSelected(c)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          user={user}
          onLogout={onLogout}
          onOpenAddAccount={() => setShowAddAccount(true)}
          onOpenCopilot={openCopilotWithQuery}
        />

        {mainContent}

        {/* Floating Bulk Action Bar */}
        <BulkBar
          count={selectedIds.size}
          onQueue={bulkQueue}
          onClear={() => setSelectedIds(new Set())}
          onSelectVisible={() => setSelectedIds(new Set(filtered.map(c => c.id)))}
          onClearQueued={clearQueue}
          hasVisible={filtered.length > 0}
        />
      </div>

      {/* Customer Action Drawer */}
      <Drawer
        customer={selected}
        onClose={() => setSelected(null)}
        queuedIds={queuedIds}
        onToggleQueue={toggleQueue}
        onMarkStatus={handleMarkStatus}
        onAddNote={handleAddNote}
        onTriggerReassign={triggerReassignModal}
        showToast={showToast}
        rms={rms}
      />

      {/* AI Copilot Drawer */}
      <MeridianCopilot
        isOpen={showCopilot}
        onClose={() => setShowCopilot(false)}
        customers={withSegment}
        playbooks={[]}
        onOpenCustomer={(c) => setSelected(c)}
        onQueueMultiple={queueMultiple}
        onSelectSection={setActiveSection}
        initialQuery={copilotQuery}
      />

      {/* Modals */}
      <AddAccountModal
        isOpen={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        onAdd={handleAddAccount}
        rms={rms}
      />

      <ReassignModal
        isOpen={showReassign}
        onClose={() => setShowReassign(false)}
        onReassign={handleReassign}
        targetAccounts={reassignTargetAccounts}
        rms={rms}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        thresholds={thresholds}
        setThresholds={setThresholds}
        onReset={resetAll}
        showToast={showToast}
      />

      {/* Global Toast Notification */}
      <Toast message={toast} />
    </div>
  );
}
