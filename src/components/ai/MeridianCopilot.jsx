import { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
import { Sparkles, X, Send, Bot, User, ArrowRight, CheckCircle2, ShieldAlert, FileText, ExternalLink } from "lucide-react";
import { COLOR } from "../../constants/theme";
import { fmtINR } from "../../utils/helpers";
import { queryCopilotAi } from "../../api/client";

export default function MeridianCopilot({ 
  isOpen, 
  onClose, 
  customers = [], 
  playbooks = [], 
  onOpenCustomer, 
  onQueueMultiple, 
  onSelectSection, 
  initialQuery = "" 
}) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Meridian Copilot — your GenAI Customer Retention Specialist & Policy Assistant. I am grounded on our real-time PostgreSQL customer database and Meridian retention policies (#RET-2026-v2). How can I assist you?",
      citations: ["Policy #RET-2026-v2: Discretionary Fee Waivers", "SLA Escalation Matrix v4.1"],
      actions: [
        { label: "Why are customers leaving this month?", query: "Why are customers leaving this month?" },
        { label: "Which customers should we contact first?", query: "Which customers should we contact first?" },
        { label: "What is revenue at risk?", query: "What is total revenue at risk?" },
        { label: "What is our deposit rate match policy?", query: "What is our fixed deposit rate match policy?" },
        { label: "Show high CLV and high churn risk accounts", query: "Show customers with high CLV and high churn risk" }
=======
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
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
      ]
    }
  ]);
  const [input, setInput] = useState("");
<<<<<<< HEAD
  const [isTyping, setIsTyping] = useState(false);
=======
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
<<<<<<< HEAD
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
=======
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg = { sender: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
<<<<<<< HEAD
    setIsTyping(true);

    try {
      // 1. Try querying backend API for RAG answer
      const apiRes = await queryCopilotAi(q);
      if (apiRes && apiRes.answer) {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: apiRes.answer,
            citations: apiRes.citations || [],
            actionBtn: apiRes.suggestedActions?.length ? {
              label: apiRes.suggestedActions[0],
              onClick: () => {
                if (apiRes.suggestedActions[0].includes("Risk Ledger") || apiRes.suggestedActions[0].includes("Customer")) {
                  onSelectSection("Customer 360");
                } else if (apiRes.suggestedActions[0].includes("Simulator")) {
                  onSelectSection("What-If Simulator");
                } else if (apiRes.suggestedActions[0].includes("Queue")) {
                  const topRisk = customers.filter(c => c.risk >= 65).map(c => c.id);
                  onQueueMultiple(topRisk);
                }
                onClose();
              }
            } : null
          }
        ]);
        return;
      }
    } catch (e) {
      // fall through to local smart generator
    }

    // 2. Intelligent local fallback logic
=======

    // Simulate AI thinking and response based on query
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
    setTimeout(() => {
      let reply = "";
      let cards = null;
      let actionBtn = null;
<<<<<<< HEAD
      let citations = [];
      const lower = q.toLowerCase();

      if (lower.includes("leave") || lower.includes("leaving") || lower.includes("why is churn increasing") || lower.includes("why are customers")) {
        reply = `Based on multi-dimensional SHAP and NLP sentiment analysis across current customer cohorts:
1. **Rate Shopping & Competitor FD Offers (38% impact):** High-net-worth Private Banking clients are viewing competing 7.4%+ rates from rival banks.
2. **Support Ticket Resolution Lags (26% impact):** Unresolved billing disputes exceeding 48 hours have a 4.2x correlation with churn spikes.
3. **Payment Gateway Timeouts (18% impact):** Recurring payroll & auto-debit failures triggered customer dissatisfaction.
4. **Login Inactivity (14% impact):** Clients dropping session frequency by > 60% transition to At-Risk within 3 weeks.`;
        citations = ["Meridian Retention Concession Policy #RET-2026-v2", "Customer Support Escalation SLA Guidelines"];
        actionBtn = {
          label: "View Explainable AI (SHAP) Breakdown",
          onClick: () => { onSelectSection("Explainable AI"); onClose(); }
        };
      } else if (lower.includes("contact first") || lower.includes("which customer") || lower.includes("priority")) {
        const topHigh = [...customers].sort((a, b) => b.risk - a.risk).slice(0, 3);
        reply = `Immediate priority outreach should focus on the top ${topHigh.length} accounts experiencing critical risk escalation:`;
=======
      const lower = q.toLowerCase();

      if (lower.includes("top account") || lower.includes("high risk") || lower.includes("highest risk")) {
        const topHigh = [...customers].sort((a, b) => b.risk - a.risk).slice(0, 3);
        reply = `I found ${topHigh.length} accounts at elevated churn risk needing priority attention:`;
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
        cards = topHigh.map(c => ({
          title: c.name,
          subtitle: `${c.tier} · ${fmtINR(c.balance)} · Risk: ${c.risk}%`,
          badge: c.driver,
          actionLabel: "View Account",
          onClick: () => { onOpenCustomer(c); onClose(); }
        }));
<<<<<<< HEAD
        citations = ["SLA Section 4.1: High-Risk Account Priority Queue"];
        actionBtn = {
          label: `Queue Priority Outreach for all ${topHigh.length} accounts`,
          onClick: () => { onQueueMultiple(topHigh.map(c => c.id)); }
        };
      } else if (lower.includes("clv") || lower.includes("high clv")) {
        const highClvRisk = customers.filter(c => c.risk >= 65).sort((a, b) => b.predicted_12m_clv - a.predicted_12m_clv).slice(0, 3);
        reply = `Found **${highClvRisk.length} High-Value / High-Risk Accounts** where predicted 12-month CLV is at severe risk:`;
        cards = highClvRisk.map(c => ({
          title: c.name,
          subtitle: `Risk: ${c.risk}% · Predicted CLV: ${fmtINR(c.predicted_12m_clv || c.balance * 0.7)}`,
          badge: c.driver,
          actionLabel: "Action Account",
          onClick: () => { onOpenCustomer(c); onClose(); }
        }));
        citations = ["CLV Growth Model v4.2"];
        actionBtn = {
          label: "Open CLV & Next Best Action Hub",
          onClick: () => { onSelectSection("CLV & Next Best Action"); onClose(); }
        };
      } else if (lower.includes("policy") || lower.includes("rate match") || lower.includes("guideline") || lower.includes("fee waiver")) {
        reply = `Grounded Policy Directive (Policy #RET-2026-v2):
• **Private Banking:** Eligible for up to 100% annual fee waiver and 25 bps deposit rate match (up to 7.45%) on balances > ₹5,00,000 upon Senior RM sign-off.
• **Premier Retail:** Up to ₹2,500 fee adjustments authorized without branch manager escalation.
• **Exclusion Rule:** Accounts with active Fraud Sentinel score > 70 are strictly excluded from retention concessions.`;
        citations = ["Meridian Retention Concession & Fee Waiver Policy", "Fraud Prevention & Campaign Exclusion Protocol"];
        actionBtn = {
          label: "Open What-If Simulator",
          onClick: () => { onSelectSection("What-If Simulator"); onClose(); }
        };
      } else {
        const totalRiskBal = customers.filter(c => c.risk >= 65).reduce((s, c) => s + c.balance, 0);
        reply = `Total Revenue at Risk across flagged accounts is **${fmtINR(totalRiskBal)}**. 

Our treatment uplift model estimates **₹${Math.round(totalRiskBal * 0.78).toLocaleString('en-IN')} recoverable** through proactive deposit rate matching and priority RM service.`;
        citations = ["Q3 Retention Performance Summary"];
        actionBtn = {
          label: "Explore Campaign Funnels",
          onClick: () => { onSelectSection("Campaigns & A/B"); onClose(); }
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: "ai", text: reply, cards, actionBtn, citations }]);
    }, 450);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 55, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,24,38,.45)", backdropFilter: "blur(2px)" }} />
      
      <div style={{
        position: "relative",
        width: 480,
        maxWidth: "96vw",
        height: "100%",
        background: COLOR.paperRaised,
        boxShadow: "-8px 0 32px rgba(0,0,0,.25)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", background: COLOR.panel, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`, display: "grid", placeItems: "center" }}>
              <Bot size={18} color={COLOR.panel} />
            </div>
            <div>
              <div style={{ fontFamily: "Fraunces", fontSize: 16, color: "#F3F1E9", fontWeight: 600 }}>Meridian Copilot</div>
              <div style={{ fontSize: 10.5, color: COLOR.brassLight }}>GenAI Customer Insights & Grounded RAG</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, color: "#94A3B8", cursor: "pointer" }}><X size={20} /></button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, padding: 18, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: m.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "88%",
                padding: "12px 16px",
                borderRadius: m.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: m.sender === "user" ? COLOR.ink : "#fff",
                color: m.sender === "user" ? "#fff" : COLOR.ink,
                fontSize: 12.5,
                lineHeight: 1.5,
                border: m.sender === "user" ? 0 : `1px solid ${COLOR.hair}`,
                boxShadow: "0 2px 6px rgba(0,0,0,.04)"
              }}>
                <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>

                {/* Grounded Policy Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${COLOR.hair}`, fontSize: 10.5, color: COLOR.inkSoft }}>
                    <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4, color: COLOR.brass }}>
                      <FileText size={11} /> Grounded Policy Citations (RAG):
                    </div>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {m.citations.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cards if any */}
                {m.cards && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {m.cards.map((c, cIdx) => (
                      <div key={cIdx} style={{ padding: "8px 10px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 12 }}>{c.title}</div>
                          <div style={{ fontSize: 10.5, color: COLOR.inkSoft }}>{c.subtitle}</div>
                        </div>
                        <button onClick={c.onClick} style={{ padding: "4px 8px", background: COLOR.ink, color: "#fff", border: 0, borderRadius: 4, fontSize: 10.5, fontWeight: 600, cursor: "pointer" }}>
                          {c.actionLabel}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                {m.actionBtn && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={m.actionBtn.onClick}
                      style={{
                        padding: "6px 12px",
                        background: `linear-gradient(135deg, ${COLOR.brassLight}, ${COLOR.brass})`,
                        color: "#fff",
                        border: 0,
                        borderRadius: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      {m.actionBtn.label} →
                    </button>
                  </div>
                )}

                {/* Preset Prompt Pills */}
                {m.actions && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {m.actions.map(act => (
                      <button
                        key={act.label}
                        onClick={() => handleSend(act.query)}
                        style={{
                          textAlign: "left",
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: `1px solid ${COLOR.hair}`,
                          background: COLOR.paperRaised,
                          fontSize: 11,
                          color: COLOR.ink,
                          cursor: "pointer",
                          fontWeight: 500,
                          transition: "background .12s"
                        }}
                      >
                        ⚡ {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLOR.inkSoft, fontSize: 11.5, fontStyle: "italic" }}>
              <Bot size={14} color={COLOR.brass} /> Meridian Copilot is consulting RAG policy database...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: 14, background: "#fff", borderTop: `1px solid ${COLOR.hair}`, display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask Copilot (e.g. 'Why is churn increasing?')..."
            style={{ flex: 1, padding: "9px 14px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, fontSize: 12, outline: "none" }}
          />
          <button
            onClick={() => handleSend()}
            style={{
              padding: "0 16px",
              background: COLOR.ink,
              color: "#fff",
              border: 0,
              borderRadius: 6,
              cursor: "pointer",
              display: "grid",
              placeItems: "center"
            }}
          >
            <Send size={15} color={COLOR.brassLight} />
          </button>
        </div>
=======
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
>>>>>>> 9e878aba1ab9205deea900f3c6716300711f862d
      </div>
    </div>
  );
}
