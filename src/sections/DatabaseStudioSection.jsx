import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Database, RefreshCw, Search, Table, Columns, Eye, Key, 
  Clock, ArrowUpDown, ChevronRight, CheckCircle2, Shield, 
  ExternalLink, Layers, Sparkles, Filter
} from "lucide-react";
import { COLOR, FONTS } from "../constants/theme";
import { fetchDatabaseTables, fetchDatabaseTableRows } from "../api/client";

export default function DatabaseStudioSection({ showToast }) {
  const [dbData, setDbData] = useState(null);
  const [selectedTable, setSelectedTable] = useState("customers");
  const [tableDetails, setTableDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [rowSearch, setRowSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeCellModal, setActiveCellModal] = useState(null);
  const [activeTab, setActiveTab] = useState("data"); // "data" | "schema"
  const refreshTimerRef = useRef(null);

  // Load all tables overview
  const loadTables = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const res = await fetchDatabaseTables();
    if (res && res.tables) {
      setDbData(res);
      if (!selectedTable && res.tables.length > 0) {
        setSelectedTable(res.tables[0].name);
      }
    }
    if (!isBackground) setLoading(false);
  };

  // Load rows for selected table
  const loadRows = async (tableName, isBackground = false) => {
    if (!tableName) return;
    if (!isBackground) setLoadingRows(true);
    const res = await fetchDatabaseTableRows(tableName);
    if (res) {
      setTableDetails(res);
    }
    if (!isBackground) setLoadingRows(false);
  };

  // Initial load
  useEffect(() => {
    loadTables();
  }, []);

  // When selected table changes
  useEffect(() => {
    if (selectedTable) {
      loadRows(selectedTable);
    }
  }, [selectedTable]);

  // Auto-refresh interval (every 3 seconds)
  useEffect(() => {
    if (!autoRefresh) {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      return;
    }

    refreshTimerRef.current = setInterval(() => {
      loadTables(true);
      if (selectedTable) {
        loadRows(selectedTable, true);
      }
    }, 3000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [autoRefresh, selectedTable]);

  const handleManualRefresh = () => {
    loadTables();
    if (selectedTable) loadRows(selectedTable);
    if (showToast) showToast(`Refreshed table: ${selectedTable} from PostgreSQL`);
  };

  // Filtered tables list
  const filteredTables = useMemo(() => {
    if (!dbData?.tables) return [];
    const q = tableSearch.trim().toLowerCase();
    if (!q) return dbData.tables;
    return dbData.tables.filter(t => t.name.toLowerCase().includes(q));
  }, [dbData, tableSearch]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    if (!tableDetails?.rows) return [];
    const q = rowSearch.trim().toLowerCase();
    if (!q) return tableDetails.rows;
    return tableDetails.rows.filter(row => {
      return Object.values(row).some(val => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [tableDetails, rowSearch]);

  const columns = tableDetails?.columns || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      {/* Top Banner (Neon / Supabase Studio Header) */}
      <div style={{
        background: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: 10,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        color: "#f0f6fc"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            display: "grid",
            placeItems: "center",
            color: "#38bdf8"
          }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>
                PostgreSQL Studio (Live Table Explorer)
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(34, 197, 94, 0.15)",
                color: "#4ade80",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                padding: "2px 8px",
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 5
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                REAL-TIME SYNC
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: "#8b949e", marginTop: 2 }}>
              Database: <code style={{ color: "#79c0ff", background: "#161b22", padding: "1px 5px", borderRadius: 4 }}>meridian_retention_db</code> • Port: <code style={{ color: "#79c0ff" }}>5432</code> • Changes made anywhere in the platform update live here without SQL commands.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 6,
              border: autoRefresh ? "1px solid #238636" : "1px solid #30363d",
              background: autoRefresh ? "rgba(35, 134, 54, 0.2)" : "#21262d",
              color: autoRefresh ? "#3fb950" : "#8b949e",
              cursor: "pointer"
            }}
          >
            <Sparkles size={13} />
            {autoRefresh ? "Auto-Sync: ON (3s)" : "Auto-Sync: PAUSED"}
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #30363d",
              background: "#21262d",
              color: "#c9d1d9",
              cursor: "pointer"
            }}
          >
            <RefreshCw size={13} className={loadingRows ? "spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Studio Body: Sidebar on Left + Spreadsheet on Right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 16,
        minHeight: 580
      }}>

        {/* Left: Table Selector */}
        <div style={{
          background: "#fff",
          border: `1px solid ${COLOR.hair}`,
          borderRadius: 10,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: COLOR.inkSoft, textTransform: "uppercase", letterSpacing: ".06em" }}>
              Tables ({filteredTables.length})
            </span>
            <span style={{ fontSize: 10.5, color: COLOR.brass, fontWeight: 600 }}>public</span>
          </div>

          {/* Search Tables Input */}
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 9, top: 8, color: COLOR.inkSoft }} />
            <input
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              placeholder="Search tables..."
              style={{
                width: "100%",
                padding: "6px 8px 6px 28px",
                fontSize: 11.5,
                border: `1px solid ${COLOR.hair}`,
                borderRadius: 6,
                outline: "none",
                background: COLOR.paper
              }}
            />
          </div>

          {/* Table List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, overflowY: "auto", maxHeight: 520 }}>
            {filteredTables.map(t => {
              const isSelected = selectedTable === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: 6,
                    border: isSelected ? `1px solid ${COLOR.ink}` : "1px solid transparent",
                    background: isSelected ? COLOR.ink : "transparent",
                    color: isSelected ? "#fff" : COLOR.ink,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, overflow: "hidden" }}>
                    <Table size={13} color={isSelected ? "#79c0ff" : COLOR.inkSoft} style={{ flexShrink: 0 }} />
                    <span style={{
                      fontSize: 12,
                      fontWeight: isSelected ? 600 : 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {t.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 10,
                    background: isSelected ? "rgba(255,255,255,0.2)" : COLOR.paperRaised,
                    color: isSelected ? "#fff" : COLOR.inkSoft
                  }}>
                    {t.rowCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* pgAdmin 4 Note */}
          <div style={{
            marginTop: "auto",
            padding: "10px 12px",
            background: COLOR.paperRaised,
            borderRadius: 6,
            border: `1px solid ${COLOR.hair}`,
            fontSize: 11,
            color: COLOR.inkSoft,
            lineHeight: 1.4
          }}>
            <strong style={{ color: COLOR.ink, display: "block", marginBottom: 2 }}>💡 Desktop App</strong>
            pgAdmin 4 is installed at:
            <code style={{ display: "block", fontSize: 9.5, marginTop: 4, wordBreak: "break-all", color: COLOR.ink }}>
              C:\Program Files\PostgreSQL\17\pgAdmin 4
            </code>
          </div>
        </div>

        {/* Right: Spreadsheet Table View */}
        <div style={{
          background: "#fff",
          border: `1px solid ${COLOR.hair}`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          
          {/* Table Header & Controls */}
          <div style={{
            padding: "12px 18px",
            borderBottom: `1px solid ${COLOR.hair}`,
            background: COLOR.paperRaised,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "Fraunces", fontSize: 18, fontWeight: 700, color: COLOR.ink }}>
                  {selectedTable}
                </span>
                <span style={{ fontSize: 11, color: COLOR.inkSoft }}>
                  {filteredRows.length} record{filteredRows.length !== 1 ? 's' : ''} • {columns.length} columns
                </span>
              </div>

              {/* View Switcher: Data vs Schema */}
              <div style={{ display: "flex", background: "#fff", padding: 2, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <button
                  onClick={() => setActiveTab("data")}
                  style={{
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 4,
                    border: 0,
                    background: activeTab === "data" ? COLOR.ink : "transparent",
                    color: activeTab === "data" ? "#fff" : COLOR.inkSoft,
                    cursor: "pointer"
                  }}
                >
                  Rows Data
                </button>
                <button
                  onClick={() => setActiveTab("schema")}
                  style={{
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 4,
                    border: 0,
                    background: activeTab === "schema" ? COLOR.ink : "transparent",
                    color: activeTab === "schema" ? "#fff" : COLOR.inkSoft,
                    cursor: "pointer"
                  }}
                >
                  Columns Schema
                </button>
              </div>
            </div>

            {/* Row Search Filter */}
            {activeTab === "data" && (
              <div style={{ position: "relative", minWidth: 220 }}>
                <Search size={13} style={{ position: "absolute", left: 9, top: 8, color: COLOR.inkSoft }} />
                <input
                  value={rowSearch}
                  onChange={e => setRowSearch(e.target.value)}
                  placeholder="Filter rows..."
                  style={{
                    width: "100%",
                    padding: "6px 10px 6px 28px",
                    fontSize: 11.5,
                    border: `1px solid ${COLOR.hair}`,
                    borderRadius: 6,
                    outline: "none",
                    background: "#fff"
                  }}
                />
              </div>
            )}
          </div>

          {/* TAB 1: SPREADSHEET ROWS VIEW */}
          {activeTab === "data" && (
            <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", maxHeight: 560 }}>
              {loadingRows ? (
                <div style={{ padding: 40, textAlign: "center", color: COLOR.inkSoft, fontSize: 13 }}>
                  Fetching live rows from PostgreSQL...
                </div>
              ) : filteredRows.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: COLOR.inkSoft, fontSize: 13 }}>
                  No rows found in <code>{selectedTable}</code>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: `2px solid ${COLOR.hair}`, position: "sticky", top: 0, zIndex: 10 }}>
                      <th style={{ padding: "8px 10px", color: COLOR.inkSoft, fontWeight: 700, width: 40 }}>#</th>
                      {columns.map(col => (
                        <th key={col.column_name} style={{ padding: "8px 12px", color: COLOR.ink, fontWeight: 600, whiteSpace: "nowrap" }}>
                          <div>{col.column_name}</div>
                          <div style={{ fontSize: 9, color: COLOR.inkSoft, fontWeight: 400, textTransform: "lowercase" }}>
                            {col.data_type}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, idx) => (
                      <tr 
                        key={idx} 
                        style={{ 
                          borderBottom: `1px solid ${COLOR.hair}`,
                          background: idx % 2 === 0 ? "#fff" : "#fafafa",
                          transition: "background 0.1s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa"}
                      >
                        <td style={{ padding: "7px 10px", color: COLOR.inkSoft, fontWeight: 600 }}>{idx + 1}</td>
                        {columns.map(col => {
                          const val = row[col.column_name];
                          return (
                            <td 
                              key={col.column_name} 
                              style={{ 
                                padding: "7px 12px", 
                                color: COLOR.ink, 
                                whiteSpace: "nowrap", 
                                maxWidth: 240, 
                                overflow: "hidden", 
                                textOverflow: "ellipsis" 
                              }}
                              title={typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            >
                              <RenderCellValue 
                                value={val} 
                                colName={col.column_name} 
                                onInspect={() => setActiveCellModal({ col: col.column_name, val, row })}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: SCHEMA VIEW */}
          {activeTab === "schema" && (
            <div style={{ flex: 1, overflowY: "auto", maxHeight: 560, padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: `2px solid ${COLOR.hair}` }}>
                    <th style={{ padding: "8px 12px", color: COLOR.ink, fontWeight: 600 }}>Column Name</th>
                    <th style={{ padding: "8px 12px", color: COLOR.ink, fontWeight: 600 }}>PostgreSQL Type</th>
                    <th style={{ padding: "8px 12px", color: COLOR.ink, fontWeight: 600 }}>Nullable</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((c, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLOR.hair}` }}>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: COLOR.ink, fontFamily: "IBM Plex Mono, monospace" }}>
                        {c.column_name}
                      </td>
                      <td style={{ padding: "8px 12px", color: "#0284c7", fontFamily: "IBM Plex Mono, monospace" }}>
                        {c.data_type}
                      </td>
                      <td style={{ padding: "8px 12px", color: c.is_nullable === 'YES' ? COLOR.inkSoft : "#b91c1c" }}>
                        {c.is_nullable}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Cell Inspect Modal */}
      {activeCellModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "grid",
          placeItems: "center",
          zIndex: 100
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 10,
            width: "90%",
            maxWidth: 600,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLOR.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                Inspect Field: <code style={{ color: COLOR.ink }}>{activeCellModal.col}</code>
              </div>
              <button 
                onClick={() => setActiveCellModal(null)}
                style={{ background: "transparent", border: 0, fontSize: 16, cursor: "pointer", fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 18, overflowY: "auto", flex: 1 }}>
              <pre style={{
                background: "#0d1117",
                color: "#58a6ff",
                padding: 14,
                borderRadius: 8,
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                margin: 0
              }}>
                {typeof activeCellModal.val === 'object' 
                  ? JSON.stringify(activeCellModal.val, null, 2)
                  : String(activeCellModal.val)}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Cell Value Renderer Helper
function RenderCellValue({ value, colName, onInspect }) {
  if (value === null || value === undefined) {
    return <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>null</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span style={{
        fontSize: 10.5,
        fontWeight: 700,
        color: value ? "#16a34a" : "#dc2626",
        background: value ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
        padding: "2px 6px",
        borderRadius: 4
      }}>
        {value ? "TRUE" : "FALSE"}
      </span>
    );
  }

  if (typeof value === "object") {
    return (
      <button
        onClick={onInspect}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 6px",
          borderRadius: 4,
          border: `1px solid ${COLOR.hair}`,
          background: COLOR.paperRaised,
          fontSize: 10.5,
          color: COLOR.ink,
          cursor: "pointer"
        }}
      >
        <Eye size={11} /> View JSON ({Array.isArray(value) ? `${value.length} items` : 'object'})
      </button>
    );
  }

  // Risk badges
  if (colName === "risk") {
    const num = Number(value);
    const color = num >= 80 ? "#dc2626" : num >= 65 ? "#ea580c" : num >= 35 ? "#d97706" : "#16a34a";
    return (
      <span style={{ fontWeight: 700, color }}>
        {num}%
      </span>
    );
  }

  // Status badges
  if (colName === "status") {
    return (
      <span style={{
        fontSize: 10.5,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 4,
        background: COLOR.paperRaised,
        color: COLOR.ink,
        border: `1px solid ${COLOR.hair}`
      }}>
        {String(value)}
      </span>
    );
  }

  return <span>{String(value)}</span>;
}

