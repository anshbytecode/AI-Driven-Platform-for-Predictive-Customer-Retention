import { useState } from "react";
import { X, UserPlus, Sparkles } from "lucide-react";
import { COLOR } from "../../constants/theme";
import Button from "../ui/Button";

export default function AddAccountModal({ isOpen, onClose, onAdd, rms }) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("Retail — Premier");
  const [balance, setBalance] = useState(150000);
  const [tenure, setTenure] = useState("1.5 yrs");
  const [driver, setDriver] = useState("Rate shopping signal");
  const [assignedRm, setAssignedRm] = useState(rms[0]?.id || "RM-101");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculate risk score based on driver and balance
    let baseRisk = 72;
    if (driver === "Rate shopping signal") baseRisk = 86;
    else if (driver === "Competitor offer clicked") baseRisk = 80;
    else if (driver === "Declining transactions") baseRisk = 68;
    else if (driver === "Fee sensitivity") baseRisk = 55;

    const newAcc = {
      id: `AC-${Math.floor(40000 + Math.random() * 90000)}`,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: "+91 98000 00000",
      tier,
      tenure,
      balance: Number(balance),
      risk: baseRisk,
      status: "New",
      assignedRm,
      trend: [35, 42, 50, 62, 74, baseRisk],
      driver,
      secondary: ["Fee sensitivity"],
      action: "Initiate relationship onboarding review",
      confidence: 85,
      impact: "High",
      accountDetails: { savings: Math.round(balance * 0.6), fixedDeposit: Math.round(balance * 0.4), creditLimit: 200000, activeLoans: 0 },
      notes: [`Account manually added on ${new Date().toLocaleDateString()}`],
      history: [{ date: new Date().toISOString().split("T")[0], event: "Account created manually", type: "system" }]
    };

    onAdd(newAcc);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgba(15,24,38,.55)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 520, borderRadius: 12, boxShadow: "0 20px 48px rgba(0,0,0,.25)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", background: COLOR.panel, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserPlus size={18} color={COLOR.brassLight} />
            <div style={{ fontFamily: "Fraunces", fontSize: 18 }}>Add New Account</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, color: "#9AA6B8", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Customer Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Customer Tier</label>
              <select value={tier} onChange={e => setTier(e.target.value)} style={inputStyle}>
                <option value="Private Banking">Private Banking</option>
                <option value="Business Banking">Business Banking</option>
                <option value="Retail — Premier">Retail — Premier</option>
                <option value="Retail — Standard">Retail — Standard</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tenure</label>
              <input value={tenure} onChange={e => setTenure(e.target.value)} placeholder="e.g. 3.5 yrs" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Total Balance (₹)</label>
              <input type="number" value={balance} onChange={e => setBalance(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Assigned RM</label>
              <select value={assignedRm} onChange={e => setAssignedRm(e.target.value)} style={inputStyle}>
                {rms.map(rm => (
                  <option key={rm.id} value={rm.id}>{rm.name} ({rm.role.split("—")[1] || rm.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Primary Risk Signal</label>
            <select value={driver} onChange={e => setDriver(e.target.value)} style={inputStyle}>
              <option value="Rate shopping signal">Rate shopping signal</option>
              <option value="Competitor offer clicked">Competitor offer clicked</option>
              <option value="Declining transactions">Declining transactions</option>
              <option value="Onboarding drop-off">Onboarding drop-off</option>
              <option value="Fee sensitivity">Fee sensitivity</option>
              <option value="Reduced app logins">Reduced app logins</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="client@example.com" style={inputStyle} />
          </div>

          <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <button type="submit" style={{ padding: "10px 20px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color={COLOR.brassLight} /> Add & Run AI Diagnostics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: COLOR.inkSoft, marginBottom: 4 };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 13, outline: "none" };
