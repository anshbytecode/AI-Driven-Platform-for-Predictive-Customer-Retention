import { useState, useMemo } from "react";
import { 
  Users, SlidersHorizontal, ArrowUpDown, Download, 
  Sparkles, CheckSquare, Square, Eye, EyeOff, ShieldAlert, 
  TrendingUp, Clock, AlertTriangle, CheckCircle2, ChevronRight, UserCheck 
} from "lucide-react";
import { COLOR } from "../constants/theme";
import { fmtINR, fmtLakh, maskEmail, maskPhone, segLabel } from "../utils/helpers";
import Tag from "../components/ui/Tag";
import SignalDial from "../components/ui/SignalDial";
import Sparkline from "../components/ui/Sparkline";

export default function Customer360View({
  customers = [],
  selectedIds,
  toggleSelect,
  onOpenCustomer,
  onQueueMultiple,
  onTriggerReassign,
  piiMasked,
  showToast,
  rms = []
}) {
  const [filterTier, setFilterTier] = useState("all");
  const [filterRiskLevel, setFilterRiskLevel] = useState("all");
  const [filterSegment, setFilterSegment] = useState("all");
  const [sortKey, setSortKey] = useState("risk");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let rows = customers.filter(c => {
      const matchTier = filterTier === "all" || c.tier === filterTier;
      const matchRisk = filterRiskLevel === "all" || c.risk_level === filterRiskLevel;
      const matchSeg = filterSegment === "all" || c.segment === filterSegment;
      return matchTier && matchRisk && matchSeg;
    });

    return [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      return av < bv ? (sortDir === "asc" ? -1 : 1) : av > bv ? (sortDir === "asc" ? 1 : -1) : 0;
    });
  }, [customers, filterTier, filterRiskLevel, filterSegment, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header & Metrics Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
            Customer Data & 360° Profile Hub
          </div>
          <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
            Unified demographic profiles, behavioral velocities, CLV projections, and predictive churn risk scores.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {selectedIds.size > 0 && (
            <button
              onClick={() => onQueueMultiple([...selectedIds])}
              style={{
                padding: "7px 12px",
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
              <Sparkles size={13} color={COLOR.brassLight} />
              Queue Outreach ({selectedIds.size})
            </button>
          )}

          <div style={{
            padding: "6px 12px",
            background: "#fff",
            border: `1px solid ${COLOR.hair}`,
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 600,
            color: COLOR.inkSoft,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            {piiMasked ? <EyeOff size={13} color={COLOR.risk} /> : <Eye size={13} color={COLOR.stable} />}
            <span>{piiMasked ? "PII Masking Active" : "PII Unmasked"}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: "#fff",
        border: `1px solid ${COLOR.hair}`,
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft }}>Filter by:</span>

          <select
            value={filterRiskLevel}
            onChange={e => setFilterRiskLevel(e.target.value)}
            style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", outline: "none" }}
          >
            <option value="all">Risk Level: All</option>
            <option value="Critical">Critical (≥80%)</option>
            <option value="High">High (65-79%)</option>
            <option value="Medium">Medium (35-64%)</option>
            <option value="Low">Low (&lt;35%)</option>
          </select>

          <select
            value={filterTier}
            onChange={e => setFilterTier(e.target.value)}
            style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", outline: "none" }}
          >
            <option value="all">Tier: All</option>
            <option value="Private Banking">Private Banking</option>
            <option value="Retail — Premier">Retail — Premier</option>
            <option value="Retail — Standard">Retail — Standard</option>
            <option value="Business Banking">Business Banking</option>
          </select>

          <select
            value={filterSegment}
            onChange={e => setFilterSegment(e.target.value)}
            style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", outline: "none" }}
          >
            <option value="all">Segment: All</option>
            <option value="High-value/high-risk">High-value / High-risk</option>
            <option value="VIP">VIP</option>
            <option value="At-risk">At-risk</option>
            <option value="Price-sensitive">Price-sensitive</option>
            <option value="Loyal">Loyal</option>
            <option value="Regular">Regular</option>
            <option value="New">New</option>
            <option value="Dormant">Dormant</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: COLOR.inkSoft, fontWeight: 600 }}>
          Showing <b>{filtered.length}</b> of {customers.length} Accounts
        </div>
      </div>

      {/* Customer 360 Ledger Table */}
      <div style={{
        background: "#fff",
        border: `1px solid ${COLOR.hair}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,.03)"
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "36px 1fr 140px 110px 120px 110px 120px 160px 40px",
          padding: "10px 16px",
          background: COLOR.paperRaised,
          borderBottom: `1px solid ${COLOR.hair}`,
          fontSize: 11,
          fontWeight: 700,
          color: COLOR.inkSoft,
          textTransform: "uppercase",
          letterSpacing: ".04em"
        }}>
          <div></div>
          <div onClick={() => handleSort("name")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            Customer Profile <ArrowUpDown size={11} />
          </div>
          <div>Demographics</div>
          <div onClick={() => handleSort("balance")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            Balance <ArrowUpDown size={11} />
          </div>
          <div onClick={() => handleSort("current_clv")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            CLV (Cur/12M) <ArrowUpDown size={11} />
          </div>
          <div onClick={() => handleSort("risk")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            Churn Risk <ArrowUpDown size={11} />
          </div>
          <div>Churn Window</div>
          <div>Top Driver & Action</div>
          <div></div>
        </div>

        {/* Rows */}
        {filtered.map(c => {
          const isSelected = selectedIds.has(c.id);
          const tone = c.risk >= 65 ? "risk" : c.risk >= 35 ? "mid" : "stable";

          return (
            <div
              key={c.id}
              onClick={() => onOpenCustomer(c)}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 140px 110px 120px 110px 120px 160px 40px",
                padding: "12px 16px",
                borderBottom: `1px solid ${COLOR.hair}`,
                alignItems: "center",
                fontSize: 12,
                cursor: "pointer",
                background: isSelected ? "rgba(169,124,63,.08)" : "#fff",
                transition: "background .12s ease"
              }}
              onMouseEnter={e => !isSelected && (e.currentTarget.style.background = "rgba(169,124,63,.04)")}
              onMouseLeave={e => !isSelected && (e.currentTarget.style.background = "#fff")}
            >
              {/* Checkbox */}
              <div onClick={(e) => { e.stopPropagation(); toggleSelect(c.id); }}>
                {isSelected ? (
                  <CheckSquare size={16} color={COLOR.brass} />
                ) : (
                  <Square size={16} color={COLOR.hairDark} />
                )}
              </div>

              {/* Name & Contact */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600, color: COLOR.ink, fontSize: 13 }}>{c.name}</span>
                  <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: COLOR.inkSoft, background: COLOR.paper, padding: "1px 5px", borderRadius: 4 }}>
                    {c.id}
                  </span>
                  {c.is_anomaly && (
                    <span style={{ background: "rgba(178,58,50,.15)", color: COLOR.risk, fontSize: 9.5, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>
                      Sentinel Flag
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 2 }}>
                  {maskEmail(c.email, piiMasked)} • {maskPhone(c.phone, piiMasked)}
                </div>
              </div>

              {/* Demographics */}
              <div>
                <div style={{ color: COLOR.ink, fontWeight: 500, fontSize: 11.5 }}>
                  {c.city || "Mumbai"} • {c.age || 35}y
                </div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>
                  {c.occupation || "Professional"}
                </div>
              </div>

              {/* Balance */}
              <div>
                <div style={{ fontWeight: 600, color: COLOR.ink, fontFamily: "IBM Plex Mono", fontSize: 12.5 }}>
                  {fmtINR(c.balance)}
                </div>
                <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>
                  {c.tier}
                </div>
              </div>

              {/* CLV */}
              <div>
                <div style={{ fontWeight: 600, color: COLOR.ink, fontSize: 11.5 }}>
                  {fmtLakh(c.current_clv || c.balance * 0.4)}
                </div>
                <div style={{ fontSize: 10.5, color: COLOR.brass, fontWeight: 600 }}>
                  Pred: {fmtLakh(c.predicted_12m_clv || c.balance * 0.65)}
                </div>
              </div>

              {/* Churn Risk */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: 13, 
                    color: tone === "risk" ? COLOR.risk : tone === "mid" ? COLOR.mid : COLOR.stable 
                  }}>
                    {c.risk}%
                  </span>
                  <Tag tone={tone}>{c.risk_level || segLabel(c.segment)}</Tag>
                </div>
                <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>
                  Conf: {c.confidence || 85}%
                </div>
              </div>

              {/* Churn Window */}
              <div>
                <span style={{
                  fontSize: 10.5,
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontWeight: 600,
                  background: c.risk >= 80 ? "rgba(178,58,50,.12)" : c.risk >= 65 ? "rgba(245,124,0,.12)" : "rgba(62,107,82,.1)",
                  color: c.risk >= 80 ? COLOR.risk : c.risk >= 65 ? "#C05621" : COLOR.stable
                }}>
                  {c.predicted_churn_window || (c.risk >= 80 ? "< 30 days" : "Low risk")}
                </span>
              </div>

              {/* Top Driver & Action */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLOR.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.driver || "Normal activity"}
                </div>
                <div style={{ fontSize: 10, color: COLOR.brass, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.action}
                </div>
              </div>

              {/* Arrow */}
              <div>
                <ChevronRight size={16} color={COLOR.inkSoft} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

