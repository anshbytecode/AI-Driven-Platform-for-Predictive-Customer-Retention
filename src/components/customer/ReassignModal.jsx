import { useState } from "react";
import { X, UserCheck } from "lucide-react";
import { COLOR } from "../../constants/theme";
import Button from "../ui/Button";

export default function ReassignModal({ isOpen, onClose, onReassign, targetAccounts = [], rms = [] }) {
  const [selectedRm, setSelectedRm] = useState(rms[0]?.id || "RM-101");

  if (!isOpen || targetAccounts.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onReassign(targetAccounts.map(a => a.id), selectedRm);
    onClose();
  };

  const rmObj = rms.find(r => r.id === selectedRm);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgba(15,24,38,.55)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 460, borderRadius: 12, boxShadow: "0 20px 48px rgba(0,0,0,.25)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", background: COLOR.panel, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserCheck size={18} color={COLOR.brassLight} />
            <div style={{ fontFamily: "Fraunces", fontSize: 18 }}>Assign Relationship Manager</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, color: "#9AA6B8", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, color: COLOR.inkSoft }}>
            Reassigning <b>{targetAccounts.length} account{targetAccounts.length > 1 ? "s" : ""}</b>:
            <div style={{ marginTop: 6, maxHeight: 80, overflowY: "auto", background: COLOR.paper, padding: "8px 12px", borderRadius: 6, fontSize: 12 }}>
              {targetAccounts.map(a => `${a.name} (${a.id})`).join(", ")}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLOR.inkSoft, marginBottom: 6 }}>Select Destination RM</label>
            <select value={selectedRm} onChange={e => setSelectedRm(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 13, outline: "none" }}>
              {rms.map(rm => (
                <option key={rm.id} value={rm.id}>
                  {rm.name} — {rm.role} ({rm.accountsCount} active accounts)
                </option>
              ))}
            </select>
          </div>

          {rmObj && (
            <div style={{ padding: 12, background: COLOR.paperRaised, borderRadius: 8, border: `1px solid ${COLOR.hair}`, fontSize: 12 }}>
              <div style={{ fontWeight: 600, color: COLOR.ink }}>{rmObj.name}</div>
              <div style={{ color: COLOR.inkSoft }}>{rmObj.email} • {rmObj.phone}</div>
            </div>
          )}

          <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <button type="submit" style={{ padding: "10px 20px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>
              Confirm Reassignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
