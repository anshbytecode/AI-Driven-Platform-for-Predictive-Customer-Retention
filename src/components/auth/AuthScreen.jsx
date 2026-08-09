import { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, Sparkles, ShieldCheck, Landmark } from "lucide-react";
import { COLOR } from "../../constants/theme";
import Tag from "../ui/Tag";

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoLogin = (demoUser) => {
    onLogin(demoUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: name || (email.split("@")[0] || "User"), email, mode });
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLOR.panel} 0%, #182335 55%, #0F1826 100%)`, display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 960, display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 24, alignItems: "center" }}>
        
        {/* Left Hero Panel */}
        <div style={{ color: "#F3F1E9", padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(155deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center" }}>
              <Landmark size={24} color={COLOR.panel} />
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 28 }}>Meridian</div>
              <div style={{ fontSize: 11, letterSpacing: ".16em", color: COLOR.brassLight, fontWeight: 600 }}>RETENTION INTELLIGENCE 2.0</div>
            </div>
          </div>

          <div style={{ fontFamily: "Fraunces", fontSize: 38, lineHeight: 1.1, margin: "14px 0" }}>
            AI-Driven Predictive Customer Retention
          </div>

          <div style={{ fontFamily: "IBM Plex Sans", color: "#AAB4C3", fontSize: 14.5, lineHeight: 1.6, maxWidth: 480 }}>
            Identify high-value accounts comparing rates, executing competitor offers, or reducing app activity before churn occurs. Empower relationship managers with automated AI Playbooks.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
            <Tag tone="risk">Live Risk Signals</Tag>
            <Tag tone="mid">Automated AI Playbooks</Tag>
            <Tag tone="stable">Copilot Assistant</Tag>
          </div>
        </div>

        {/* Right Auth Card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 30, boxShadow: "0 24px 60px rgba(0,0,0,.35)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 22, background: COLOR.paper, padding: 4, borderRadius: 8 }}>
            <button
              onClick={() => setMode("login")}
              style={{ flex: 1, padding: "9px 0", border: 0, borderRadius: 6, fontWeight: 600, fontSize: 13, background: mode === "login" ? "#fff" : "transparent", color: mode === "login" ? COLOR.ink : COLOR.inkSoft, cursor: "pointer", boxShadow: mode === "login" ? "0 2px 6px rgba(0,0,0,.08)" : "none" }}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              style={{ flex: 1, padding: "9px 0", border: 0, borderRadius: 6, fontWeight: 600, fontSize: 13, background: mode === "signup" ? "#fff" : "transparent", color: mode === "signup" ? COLOR.ink : COLOR.inkSoft, cursor: "pointer", boxShadow: mode === "signup" ? "0 2px 6px rgba(0,0,0,.08)" : "none" }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle} />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. priya.sharma@meridian.bank" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ border: `1px solid ${COLOR.hair}`, background: "#fff", borderRadius: 8, padding: "0 12px", cursor: "pointer" }}>
                  {showPw ? <EyeOff size={15} color={COLOR.inkSoft} /> : <Eye size={15} color={COLOR.inkSoft} />}
                </button>
              </div>
            </div>

            <button type="submit" style={{ width: "100%", border: "none", background: COLOR.ink, color: "#fff", padding: 12, borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
              {mode === "login" ? <><LogIn size={15} /> Sign In to Dashboard</> : <><UserPlus size={15} /> Create Account</>}
            </button>
          </form>

          {/* Quick Demo Login Presets */}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${COLOR.hair}` }}>
            <div style={{ fontSize: 11.5, color: COLOR.inkSoft, marginBottom: 10, textAlign: "center", fontWeight: 500 }}>
              Or quick launch with Demo Credentials:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={() => handleDemoLogin({ name: "Anshul Mehta", email: "anshul.m@meridian.bank", role: "Head of Retention" })}
                style={demoBtn}
              >
                <b>Anshul Mehta</b>
                <span style={{ fontSize: 10.5, color: COLOR.inkSoft }}>Head of Retention</span>
              </button>
              <button
                onClick={() => handleDemoLogin({ name: "Priya Sharma", email: "priya.sharma@meridian.bank", role: "Senior RM" })}
                style={demoBtn}
              >
                <b>Priya Sharma</b>
                <span style={{ fontSize: 10.5, color: COLOR.inkSoft }}>Senior RM — Private</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: COLOR.inkSoft, marginBottom: 4 };
const inputStyle = { width: "100%", padding: "11px 13px", border: `1px solid ${COLOR.hair}`, borderRadius: 8, fontSize: 13, outline: "none" };
const demoBtn = { padding: "8px 10px", background: COLOR.paper, border: `1px solid ${COLOR.hair}`, borderRadius: 8, cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", fontSize: 12 };
