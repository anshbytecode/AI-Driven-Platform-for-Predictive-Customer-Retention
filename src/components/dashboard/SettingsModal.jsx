import { useState } from "react";
import { X, Sliders, Bell, Cpu, Database, Save, Check } from "lucide-react";
import { COLOR } from "../../constants/theme";
import Button from "../ui/Button";

export default function SettingsModal({ isOpen, onClose, thresholds, setThresholds, onReset, showToast }) {
  const [weights, setWeights] = useState({
    rateShopping: 40,
    competitorOffer: 25,
    transactionDrop: 20,
    feeSensitivity: 15
  });
  const [autoQueue, setAutoQueue] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    showToast("Settings & AI Model Weights updated successfully");
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgba(15,24,38,.55)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 620, borderRadius: 12, boxShadow: "0 20px 48px rgba(0,0,0,.25)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", background: COLOR.panel, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sliders size={18} color={COLOR.brassLight} />
            <div style={{ fontFamily: "Fraunces", fontSize: 18 }}>Engine & AI Settings</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, color: "#9AA6B8", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, maxHeight: "78vh", overflowY: "auto" }}>
          {/* Risk Sensitivity Thresholds */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Fraunces", fontSize: 15, marginBottom: 12 }}>
              <Cpu size={16} color={COLOR.brass} /> Risk Classification Thresholds
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>High Risk Trigger Score:</span>
                  <b>{thresholds.high}%</b>
                </div>
                <input type="range" min={thresholds.mid + 5} max={95} value={thresholds.high} onChange={e => setThresholds(t => ({ ...t, high: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLOR.risk }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>Watch List Trigger Score:</span>
                  <b>{thresholds.mid}%</b>
                </div>
                <input type="range" min={10} max={thresholds.high - 5} value={thresholds.mid} onChange={e => setThresholds(t => ({ ...t, mid: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLOR.mid }} />
              </div>
            </div>
          </div>

          {/* AI Feature Weighting */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "Fraunces", fontSize: 15, marginBottom: 12 }}>Signal Impact Feature Weightings</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Rate Shopping Weight ({weights.rateShopping}%)</label>
                <input type="range" min={10} max={60} value={weights.rateShopping} onChange={e => setWeights(w => ({ ...w, rateShopping: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLOR.brass }} />
              </div>
              <div>
                <label style={labelStyle}>Competitor Offer Clicks ({weights.competitorOffer}%)</label>
                <input type="range" min={10} max={60} value={weights.competitorOffer} onChange={e => setWeights(w => ({ ...w, competitorOffer: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLOR.brass }} />
              </div>
              <div>
                <label style={labelStyle}>Transaction Drop ({weights.transactionDrop}%)</label>
                <input type="range" min={5} max={50} value={weights.transactionDrop} onChange={e => setWeights(w => ({ ...w, transactionDrop: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLOR.brass }} />
              </div>
              <div>
                <label style={labelStyle}>Fee Sensitivity ({weights.feeSensitivity}%)</label>
                <input type="range" min={5} max={40} value={weights.feeSensitivity} onChange={e => setWeights(w => ({ ...w, feeSensitivity: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLOR.brass }} />
              </div>
            </div>
          </div>

          {/* Automation & Alerts */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Fraunces", fontSize: 15, marginBottom: 12 }}>
              <Bell size={16} color={COLOR.brass} /> Automation & Outreach Alerts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, cursor: "pointer" }}>
                <input type="checkbox" checked={autoQueue} onChange={e => setAutoQueue(e.target.checked)} />
                Auto-queue outreach for accounts scoring above 85% risk score
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, cursor: "pointer" }}>
                <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} />
                Send daily morning briefing email to assigned Relationship Managers
              </label>
            </div>
          </div>

          {/* Data Controls */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Fraunces", fontSize: 15, marginBottom: 8 }}>
              <Database size={16} color={COLOR.brass} /> Data Controls
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button onClick={() => { onReset(); showToast("Reset defaults applied"); }}>Reset Model Defaults</Button>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLOR.hair}`, background: COLOR.paperRaised, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <button onClick={handleSave} style={{ padding: "10px 20px", background: saved ? COLOR.stable : COLOR.ink, color: "#fff", border: 0, borderRadius: 6, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Configuration</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionStyle = { padding: 14, background: COLOR.paper, borderRadius: 8, border: `1px solid ${COLOR.hair}` };
const labelStyle = { display: "block", fontSize: 11.5, fontWeight: 500, color: COLOR.inkSoft, marginBottom: 4 };
