import { useState } from "react";
import { Lock, ShieldCheck, Eye, EyeOff, FileText, CheckCircle2, UserCheck, Key } from "lucide-react";
import { COLOR } from "../constants/theme";

export default function PrivacyAuditSection({ piiMasked, onTogglePiiMasking, currentRole, onChangeRole, showToast }) {
  const [auditLogs, setAuditLogs] = useState([
    { id: 101, time: "2026-11-07 20:48:12", user: "Anshul", role: "Head of Retention", action: "LOGIN", resource: "AuthService", pii: false, ip: "127.0.0.1" },
    { id: 102, time: "2026-11-07 20:49:05", user: "Priya Sharma", role: "Senior RM — Private Banking", action: "EXPORT_CSV", resource: "RiskLedger", pii: true, ip: "192.168.1.42" },
    { id: 103, time: "2026-11-07 20:50:33", user: "System Daemon", role: "ML Pipeline Engine", action: "MODEL_EVAL", resource: "Model v4.2", pii: false, ip: "127.0.0.1" },
    { id: 104, time: "2026-11-07 20:51:19", user: "David Chen", role: "RM — Business Banking", action: "UPDATE_STATUS", resource: "Customer AC-40220", pii: false, ip: "192.168.1.58" },
    { id: 105, time: "2026-11-07 20:52:40", user: "Anshul", role: "Head of Retention", action: "TOGGLE_PII_UNMASK", resource: "Customer Ledger", pii: true, ip: "127.0.0.1" }
  ]);

  const roles = [
    {
      role: "Head of Retention",
      access: "Full Administrative & Strategic Control",
      permissions: ["View all 20 modules", "Unmask PII across cohorts", "Export ledger CSV", "Deploy budget campaigns", "Override risk thresholds"]
    },
    {
      role: "Senior RM — Private Banking",
      access: "High-Net-Worth Portfolio Ownership",
      permissions: ["View assigned Private Banking clients", "Execute fee waiver playbooks up to 100%", "Unmask client phone & email", "Add CRM case notes"]
    },
    {
      role: "Relationship Manager",
      access: "Retail & Premier Portfolio Access",
      permissions: ["View assigned accounts", "Execute automated outreach playbooks", "Masked PII view (re-verification required for unmask)"]
    },
    {
      role: "Auditor / Compliance",
      access: "Governance & Security Inspection",
      permissions: ["Inspect tamper-evident audit logs", "Review model drift & PSI scores", "Audit Fraud Sentinel flags", "Read-only access"]
    }
  ];

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Privacy, Security & Role-Based Access Control (RBAC)
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Enterprise compliance architecture adhering to DPDP (Digital Personal Data Protection) and GDPR guidelines with immutable audit trails.
        </div>
      </div>

      {/* Security Switches & Status Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
        {/* PII & Data Governance Card */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} color={COLOR.brass} />
            Data Protection & PII Masking Controls
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLOR.ink }}>
                Personally Identifiable Information (PII) Masking
              </div>
              <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 2 }}>
                Masks emails (e.g. <code>p***@gmail.com</code>) and phone numbers (<code>+91 98***** 43210</code>)
              </div>
            </div>

            <button
              onClick={onTogglePiiMasking}
              style={{
                padding: "8px 14px",
                background: piiMasked ? COLOR.stable : COLOR.risk,
                color: "#fff",
                border: 0,
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              {piiMasked ? <CheckCircle2 size={13} /> : <Eye size={13} />}
              {piiMasked ? "Masking Enabled" : "Masking Disabled"}
            </button>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 11.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLOR.hair}` }}>
              <span style={{ color: COLOR.inkSoft }}>PostgreSQL Encryption:</span>
              <span style={{ fontWeight: 600, color: COLOR.stable }}>AES-256 at Rest & TLS 1.3 in Transit</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLOR.hair}` }}>
              <span style={{ color: COLOR.inkSoft }}>Data Retention Period:</span>
              <span style={{ fontWeight: 600, color: COLOR.ink }}>7 Years (RBI Master Regulatory Directive)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: COLOR.inkSoft }}>Consent Registry:</span>
              <span style={{ fontWeight: 600, color: COLOR.stable }}>100% Opt-In Verification</span>
            </div>
          </div>
        </div>

        {/* Current Active Role Switcher */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Key size={16} color={COLOR.blue} />
            Active Role-Based Access Control (RBAC)
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: COLOR.inkSoft, display: "block", marginBottom: 6 }}>
              Switch Operational Role:
            </label>
            <select
              value={currentRole}
              onChange={e => onChangeRole(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, fontWeight: 600, background: "#fff", outline: "none" }}
            >
              {roles.map(r => (
                <option key={r.role} value={r.role}>{r.role}</option>
              ))}
            </select>
          </div>

          <div style={{ background: COLOR.paperRaised, padding: "12px 14px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 11.5 }}>
            <div style={{ fontWeight: 700, color: COLOR.ink }}>Current Role Permissions:</div>
            <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
              {roles.find(r => r.role === currentRole)?.permissions.map((p, idx) => (
                <li key={idx} style={{ color: COLOR.inkSoft, marginBottom: 3 }}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Ledger */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, display: "flex", alignItems: "center", gap: 6 }}>
            <FileText size={16} color={COLOR.ink} />
            Security & Compliance Audit Trail Log (PostgreSQL Table: <code>audit_logs</code>)
          </div>
          <span style={{ fontSize: 11, color: COLOR.inkSoft }}>Real-Time System Log</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {auditLogs.map(log => (
            <div
              key={log.id}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 140px 140px 140px 1fr 100px",
                padding: "10px 14px",
                background: COLOR.paperRaised,
                borderRadius: 6,
                border: `1px solid ${COLOR.hair}`,
                alignItems: "center",
                fontSize: 11.5
              }}
            >
              <div style={{ fontFamily: "IBM Plex Mono", color: COLOR.inkSoft }}>{log.time}</div>
              <div style={{ fontWeight: 600, color: COLOR.ink }}>{log.user}</div>
              <div style={{ color: COLOR.inkSoft, fontSize: 11 }}>{log.role}</div>
              <div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: log.action.includes("PII") ? "rgba(178,58,50,.1)" : "rgba(37,99,235,.1)",
                  color: log.action.includes("PII") ? COLOR.risk : COLOR.blue
                }}>
                  {log.action}
                </span>
              </div>
              <div style={{ color: COLOR.inkSoft }}>{log.resource}</div>
              <div style={{ fontFamily: "IBM Plex Mono", color: COLOR.inkSoft, textAlign: "right" }}>{log.ip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

