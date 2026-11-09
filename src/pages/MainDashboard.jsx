import { useState, useMemo, useRef, useEffect } from "react";
import { CUSTOMERS as INITIAL_CUSTOMERS, RELATIONSHIP_MANAGERS as INITIAL_RMS } from "../data/customers";
import { COLOR, FONTS } from "../constants/theme";
import { getSegment, csvEscape } from "../utils/helpers";
import { fetchHealth, fetchCustomers, updateCustomer, createCustomer, logAuditAction } from "../api/client";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

// Section Views
import CommandCenterSection from "../sections/CommandCenterSection";
import Customer360View from "../sections/Customer360View";
import BehaviorTimelineSection from "../sections/BehaviorTimelineSection";
import XaiSection from "../sections/XaiSection";
import SegmentationEarlyWarningSection from "../sections/SegmentationEarlyWarningSection";
import RetentionOpportunitySection from "../sections/RetentionOpportunitySection";
import WhatIfSimulatorSection from "../sections/WhatIfSimulatorSection";
import OmnichannelFatigueSection from "../sections/OmnichannelFatigueSection";
import JourneysCohortSection from "../sections/JourneysCohortSection";
import CampaignsAbSection from "../sections/CampaignsAbSection";
import NlpSentimentSection from "../sections/NlpSentimentSection";
import FraudSentinelSection from "../sections/FraudSentinelSection";
import MultiAgentClosedLoopSection from "../sections/MultiAgentClosedLoopSection";
import RealtimeStreamSection from "../sections/RealtimeStreamSection";
import ModelMonitoringSection from "../sections/ModelMonitoringSection";
import PrivacyAuditSection from "../sections/PrivacyAuditSection";
import DatabaseStudioSection from "../sections/DatabaseStudioSection";
import PlaybooksView from "../sections/PlaybooksView";
import PortfoliosView from "../sections/PortfoliosView";

// Modals & Drawers
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
  const [dbConnected, setDbConnected] = useState(true);
  const [query, setQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  // Privacy & RBAC Controls
  const [piiMasked, setPiiMasked] = useState(true);
  const [currentRole, setCurrentRole] = useState(user?.role || "Head of Retention");

  // Thresholds & Sort
  const [thresholds, setThresholds] = useState({ high: 65, mid: 35 });
  const [showThresholds, setShowThresholds] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("desc");

  // Selection & Queueing
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [queuedIds, setQueuedIds] = useState(new Set(["AC-40217", "AC-40225"]));
  const [toast, setToast] = useState("");
  const [activeSection, setActiveSection] = useState("Command Center");

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
    timer.current = setTimeout(() => setToast(""), 2800);
  };

  // Connect to PostgreSQL Backend on mount
  useEffect(() => {
    async function loadData() {
      const health = await fetchHealth();
      setDbConnected(health.database_connected || false);

      const dbCustomers = await fetchCustomers();
      if (dbCustomers && dbCustomers.length > 0) {
        setCustomers(dbCustomers.map(c => ({
          ...c,
          balance: parseFloat(c.balance),
          current_clv: parseFloat(c.current_clv || c.balance * 0.4),
          predicted_12m_clv: parseFloat(c.predicted_12m_clv || c.balance * 0.7),
          trend: typeof c.trend === 'string' ? JSON.parse(c.trend) : (c.trend || [40, 50, 60, c.risk]),
          secondary: typeof c.secondary === 'string' ? JSON.parse(c.secondary) : (c.secondary || []),
          notes: typeof c.notes === 'string' ? JSON.parse(c.notes) : (c.notes || [])
        })));
        console.log(`[PostgreSQL] Loaded ${dbCustomers.length} active customer profiles from database.`);
      }
    }
    loadData();

    // Recheck health periodically to maintain live link
    const healthInterval = setInterval(async () => {
      const health = await fetchHealth();
      setDbConnected(health.database_connected || false);
    }, 12000);

    return () => clearInterval(healthInterval);
  }, []);

  // Segment computation
  const withSegment = useMemo(() => {
    return customers.map(c => ({
      ...c,
      segment: c.segment || getSegment(c.risk, thresholds)
    }));
  }, [customers, thresholds]);

  const counts = useMemo(() => ({
    all: withSegment.length,
    high: withSegment.filter(c => c.risk >= 65).length,
    medium: withSegment.filter(c => c.risk >= 35 && c.risk < 65).length,
    low: withSegment.filter(c => c.risk < 35).length
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
    showToast(`Exported ${filtered.length} accounts to CSV`);
    logAuditAction({
      user_name: user?.name || "Anshul",
      user_role: currentRole,
      action: "EXPORT_CSV",
      resource: "Customer Ledger",
      pii_accessed: !piiMasked
    });
  };

  const handleAddAccount = async (newAcc) => {
    setCustomers(prev => [newAcc, ...prev]);
    await createCustomer(newAcc);
    showToast(`Added ${newAcc.name} (${newAcc.id}) to PostgreSQL database`);
  };

  const handleMarkStatus = async (accId, newStatus) => {
    setCustomers(prev => prev.map(c => c.id === accId ? { ...c, status: newStatus } : c));
    if (selected && selected.id === accId) {
      setSelected(prev => ({ ...prev, status: newStatus }));
    }
    await updateCustomer(accId, { status: newStatus });
    showToast(`Updated ${accId} status to "${newStatus}" in PostgreSQL`);
  };

  const handleAddNote = async (accId, noteText) => {
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
    await updateCustomer(accId, { noteText });
  };

  const handleReassign = async (accountIds, newRmId) => {
    setCustomers(prev => prev.map(c => accountIds.includes(c.id) ? { ...c, assigned_rm: newRmId, assignedRm: newRmId } : c));
    for (const id of accountIds) {
      await updateCustomer(id, { assignedRm: newRmId });
    }
    showToast(`Reassigned ${accountIds.length} account(s) to ${newRmId}`);
  };

  const handleRiskUpdated = (accId, newRisk) => {
    setCustomers(prev => prev.map(c => c.id === accId ? { ...c, risk: newRisk } : c));
    if (selected && selected.id === accId) {
      setSelected(prev => ({ ...prev, risk: newRisk }));
    }
  };

  const togglePiiMasking = () => {
    const nextState = !piiMasked;
    setPiiMasked(nextState);
    showToast(nextState ? "PII Masking enabled (DPDP/GDPR compliant)" : "PII revealed. Access logged to audit trail.");
    logAuditAction({
      user_name: user?.name || "Anshul",
      user_role: currentRole,
      action: nextState ? "ENABLE_PII_MASK" : "DISABLE_PII_MASK",
      resource: "Customer 360",
      pii_accessed: !nextState
    });
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
    rms,
    piiMasked
  };

  // Section Router covering all 37 capabilities:
  let mainContent;
  switch (activeSection) {
    case "Command Center":
    case "Overview":
      mainContent = <CommandCenterSection customers={withSegment} onSelectSection={setActiveSection} onOpenCustomer={(c) => setSelected(c)} />;
      break;
    case "Customer 360":
    case "Risk Ledger":
      mainContent = <Customer360View {...sectionProps} />;
      break;
    case "Behavior & Digital Twin":
      mainContent = <BehaviorTimelineSection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} showToast={showToast} />;
      break;
    case "Explainable AI":
      mainContent = <XaiSection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} />;
      break;
    case "Segmentation & RFM":
    case "Segmentation":
    case "Segments":
      mainContent = <SegmentationEarlyWarningSection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} showToast={showToast} />;
      break;
    case "Opportunity & Uplift":
    case "CLV & Next Best Action":
      mainContent = <RetentionOpportunitySection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} showToast={showToast} />;
      break;
    case "What-If Simulator":
      mainContent = <WhatIfSimulatorSection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} />;
      break;
    case "Omnichannel & Fatigue":
      mainContent = <OmnichannelFatigueSection customers={withSegment} showToast={showToast} />;
      break;
    case "Journeys & Cohorts":
      mainContent = <JourneysCohortSection onOpenCustomer={(c) => setSelected(c)} />;
      break;
    case "Campaigns & A/B":
      mainContent = <CampaignsAbSection showToast={showToast} />;
      break;
    case "NLP Sentiment":
      mainContent = <NlpSentimentSection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} />;
      break;
    case "Fraud Sentinel":
      mainContent = <FraudSentinelSection customers={withSegment} onOpenCustomer={(c) => setSelected(c)} showToast={showToast} />;
      break;
    case "Multi-Agent & Closed Loop":
      mainContent = <MultiAgentClosedLoopSection showToast={showToast} />;
      break;
    case "Real-Time Stream":
      mainContent = <RealtimeStreamSection customers={withSegment} onCustomerRiskUpdated={handleRiskUpdated} showToast={showToast} />;
      break;
    case "Model Monitoring":
      mainContent = <ModelMonitoringSection />;
      break;
    case "Privacy & Security":
      mainContent = (
        <PrivacyAuditSection
          piiMasked={piiMasked}
          onTogglePiiMasking={togglePiiMasking}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          showToast={showToast}
        />
      );
      break;
    case "Database Studio":
      mainContent = <DatabaseStudioSection showToast={showToast} />;
      break;
    case "AI Playbooks":
      mainContent = <PlaybooksView {...sectionProps} />;
      break;
    case "Portfolios":
      mainContent = <PortfoliosView {...sectionProps} />;
      break;
    default:
      mainContent = <CommandCenterSection customers={withSegment} onSelectSection={setActiveSection} onOpenCustomer={(c) => setSelected(c)} />;
  }

  return (
    <div style={{ fontFamily: "IBM Plex Sans", background: COLOR.paper, minHeight: "100vh", display: "flex" }}>
      <style>{`${FONTS}*{box-sizing:border-box}.ledger-row:hover{background:rgba(169,124,63,.06)!important}@media(max-width:880px){.sidebar{display:none}}`}</style>

      {/* Sidebar Navigation */}
      <Sidebar
        queuedCount={queuedIds.size}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenCopilot={openCopilotWithQuery}
        highRiskCount={counts.high}
        dbConnected={dbConnected}
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
          piiMasked={piiMasked}
          onTogglePiiMasking={togglePiiMasking}
          dbConnected={dbConnected}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
        />

        {mainContent}

        {/* Global Footer */}
        <footer style={{
          marginTop: "auto",
          padding: "18px 24px 22px",
          textAlign: "center",
          fontSize: "11px",
          color: COLOR.inkSoft,
          borderTop: `1px solid ${COLOR.hair}`
        }}>
          © 2026 Anshul Bhilare. All rights reserved.
        </footer>

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

      {/* Enhanced Customer 360 & Remediation Drawer */}
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
        piiMasked={piiMasked}
      />

      {/* Grounded AI Copilot Assistant */}
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
