import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR } from "../../utils/helpers";

export default function MeridianCopilot({ isOpen, onClose, customers, playbooks, onOpenCustomer, onQueueMultiple, onSelectSection, initialQuery = "" }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Meridian Copilot — your AI Customer Retention Specialist. Ask me to analyze portfolio risks, search accounts, or execute batch playbooks.",
      actions: [
        { label: "Show top accounts at risk", query: "Show top accounts at risk" },
        { label: "What is revenue at risk?", query: "What is total revenue at risk?" },
        { label: "Execute Rate Matcher playbook", query: "Run Rate Matcher playbook" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg = { sender: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Simulate AI thinking and response based on query
    setTimeout(() => {
      let reply = "";
      let cards = null;
      let actionBtn = null;
      const lower = q.toLowerCase();

      if (lower.includes("top account") || lower.includes("high risk") || lower.includes("highest risk")) {
        const topHigh = [...customers].sort((a, b) => b.risk - a.risk).slice(0, 3);
        reply = `I found ${topHigh.length} accounts at elevated churn risk needing priority attention:`;
        cards = topHigh.map(c => ({
          title: c.name,
          subtitle: `${c.tier} · ${fmtINR(c.balance)} · Risk: ${c.risk}%`,
          badge: c.driver,
          actionLabel: "View Account",
          onClick: () => { onOpenCustomer(c); onClose(); }
        }));
        actionBtn = {
          label: `Queue Outreach for all ${topHigh.length} accounts`,
          onClick: () => { onQueueMultiple(topHigh.map(c => c.id)); }
        };
      } else if (lower.includes("revenue") || lower.includes("at risk") || lower.includes("balance")) {
        const highBalanceSum = customers.filter(c => c.risk >= 65).reduce((a, c) => a + c.balance, 0);
        reply = `Total Revenue at Risk (accounts scoring ≥ 65% risk) is **${fmtINR(highBalanceSum)}** across ${customers.filter(c => c.risk >= 65).length} accounts. 

Primary driver: **Rate shopping signal** accounting for 48% of risk exposure.`;
      } else if (lower.includes("playbook") || lower.includes("rate matcher")) {
        reply = `Executing **High-Value Rate Matcher Playbook** on matching Private & Premier Banking accounts...

Matched 2 target accounts: **Priya Kulkarni** and **Sana Sheikh**. Potential retained revenue: **₹18.4 Lakhs**.`;
        actionBtn = {
          label: "View AI Playbooks Hub",
          onClick: () => { onSelectSection("AI Playbooks"); onClose(); }
        };
      } else if (lower.includes("segment") || lower.includes("portfolio")) {
        reply = `Here is your portfolio risk breakdown:
• **High Risk (≥65%)**: ${customers.filter(c => c.risk >= 65).length} accounts
• **Watch List (35-64%)**: ${customers.filter(c => c.risk >= 35 && c.risk < 65).length} accounts
• **Stable (<35%)**: ${customers.filter(c => c.risk < 35).length} accounts`;
        actionBtn = {
          label: "Open Segment Matrix Hub",
          onClick: () => { onSelectSection("Segments"); onClose(); }
        };
      } else {
        reply = `I analyzed your query regarding "${q}". The AI retention engine recommends running targeted playbooks on high risk accounts and verifying Relationship Manager assignments.`;
      }

      setMessages(prev => [...prev, { sender: "ai", text: reply, cards, actionBtn }]);
    }, 400);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60, width: 400, maxWidth: "90vw", height: 560, background: "#fff", borderRadius: 14, boxShadow: "0 24px 60px rgba(0,0,0,.3)", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${COLOR.hair}` }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: COLOR.panel, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center" }}>
            <Sparkles size={16} color={COLOR.panel} />
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces", fontSize: 16 }}>Meridian Copilot</div>
            <div style={{ fontSize: 10.5, color: COLOR.brassLight }}>AI Retention Intelligence Assistant</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: 0, color: "#9AA6B8", cursor: "pointer" }}><X size={18} /></button>
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, padding: 16, overflowY: "auto", background: COLOR.paper, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: "flex", gap: 10, alignSelf: m.sender === "user" ? "flex-end" : "flex-start", maxWidth: "92%" }}>
            {m.sender === "ai" && (
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: COLOR.panel, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Bot size={14} color="#fff" />
              </div>
            )}
            <div>
              <div style={{ padding: "10px 14px", borderRadius: 10, background: m.sender === "user" ? COLOR.ink : "#fff", color: m.sender === "user" ? "#fff" : COLOR.ink, fontSize: 13, lineHeight: 1.5, border: m.sender === "ai" ? `1px solid ${COLOR.hair}` : 0, boxShadow: "0 2px 6px rgba(0,0,0,.04)" }}>
                {m.text}
              </div>

              {/* Action Cards */}
              {m.cards && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {m.cards.map((c, i) => (
                    <div key={i} style={{ padding: 10, background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <b>{c.title}</b>
                        <div style={{ color: COLOR.inkSoft, fontSize: 11 }}>{c.subtitle}</div>
                      </div>
                      <button onClick={c.onClick} style={{ padding: "5px 10px", background: COLOR.paper, border: `1px solid ${COLOR.hair}`, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        {c.actionLabel}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Single Action Button */}
              {m.actionBtn && (
                <button onClick={m.actionBtn.onClick} style={{ marginTop: 8, padding: "8px 14px", background: COLOR.brass, color: "#fff", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={14} /> {m.actionBtn.label}
                </button>
              )}

              {/* Suggestion Pills */}
              {m.actions && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {m.actions.map((act, i) => (
                    <button key={i} onClick={() => handleSend(act.query)} style={{ padding: "5px 10px", borderRadius: 14, background: "#fff", border: `1px solid ${COLOR.brassLight}`, color: COLOR.ink, fontSize: 11.5, cursor: "pointer" }}>
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ padding: 12, background: "#fff", borderTop: `1px solid ${COLOR.hair}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask Meridian Copilot..."
          style={{ flex: 1, padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12.5, outline: "none" }}
        />
        <button onClick={() => handleSend()} style={{ padding: "9px 14px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 6, cursor: "pointer", display: "grid", placeItems: "center" }}>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
