import { useState } from "react";
import { MessageSquareHeart, Frown, Smile, Meh, AlertCircle, Sparkles, Filter, ChevronRight } from "lucide-react";
import { COLOR } from "../constants/theme";
import Tag from "../components/ui/Tag";

export default function NlpSentimentSection({ customers = [], onOpenCustomer }) {
  const [filterTopic, setFilterTopic] = useState("all");
  const [filterEmotion, setFilterEmotion] = useState("all");

  const logs = [
    {
      id: "TICK-9021",
      customer_id: "AC-40217",
      customer_name: "Priya Kulkarni",
      tier: "Private Banking",
      risk: 88,
      channel: "Support Ticket #9021",
      date: "Aug 4, 2026",
      text: "Why am I being charged an unexpected ₹2,400 maintenance fee? HDFC and ICICI offer zero-fee premier accounts with superior 7.4% deposit rates. If this is not corrected immediately, I will close my deposit account.",
      sentiment: "Negative",
      emotion: "Angry",
      score: -0.84,
      topics: ["Pricing", "Fee Sensitivity", "Competitor Comparison"],
      churn_impact: "Critical (+42% Churn Acceleration)"
    },
    {
      id: "FB-8841",
      customer_id: "AC-40218",
      customer_name: "Rohan Mehta",
      tier: "Retail — Premier",
      risk: 81,
      channel: "In-App Feedback",
      date: "Aug 1, 2026",
      text: "I tried calling support twice regarding the billing dispute on my card statement. Both times the call disconnected after 15 minutes on hold. Unacceptable response time.",
      sentiment: "Negative",
      emotion: "Frustrated",
      score: -0.72,
      topics: ["Support", "Resolution Time", "Call Center UX"],
      churn_impact: "High (+30% Churn Acceleration)"
    },
    {
      id: "TICK-9112",
      customer_id: "AC-40220",
      customer_name: "Vikram Nair",
      tier: "Business Banking",
      risk: 69,
      channel: "Corporate Email Ticket",
      date: "Aug 3, 2026",
      text: "Our international vendor payment bounced because of an unexpected exchange rate discrepancy. We lost crucial shipment clearance time. Please verify why the FX rate was higher than quoted.",
      sentiment: "Negative",
      emotion: "Frustrated",
      score: -0.65,
      topics: ["Payment", "FX Transfer", "Product Quality"],
      churn_impact: "High (+27% Churn Acceleration)"
    },
    {
      id: "NPS-7820",
      customer_id: "AC-40224",
      customer_name: "Arjun Singhania",
      tier: "Private Banking",
      risk: 28,
      channel: "RM Annual Review Survey",
      date: "Jul 28, 2026",
      text: "Priya Sharma and the Private Banking team have provided top-notch service. Very satisfied with our portfolio yield and quarterly reviews.",
      sentiment: "Positive",
      emotion: "Satisfied",
      score: 0.94,
      topics: ["Relationship Manager", "Service Quality", "Wealth Returns"],
      churn_impact: "Low (-22% Churn Mitigation)"
    }
  ];

  const emotionColors = {
    Angry: COLOR.risk,
    Frustrated: "#E65100",
    Satisfied: COLOR.stable,
    Neutral: COLOR.inkSoft
  };

  const topicsSummary = [
    { topic: "Pricing & Rate Shopping", count: 18, riskCorrelation: "Critical (+38%)" },
    { topic: "Support Resolution SLA", count: 14, riskCorrelation: "High (+29%)" },
    { topic: "Payment Gateway Failures", count: 9, riskCorrelation: "High (+24%)" },
    { topic: "App UX & Digital Navigation", count: 6, riskCorrelation: "Medium (+12%)" },
    { topic: "Product Breadth & Perks", count: 5, riskCorrelation: "Low (+5%)" }
  ];

  const filteredLogs = logs.filter(l => {
    const matchTopic = filterTopic === "all" || l.topics.includes(filterTopic);
    const matchEmotion = filterEmotion === "all" || l.emotion === filterEmotion;
    return matchTopic && matchEmotion;
  });

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          NLP & Sentiment Intelligence
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Transformer-based text analysis extracting customer emotion and underlying grievances directly correlated with churn trajectory.
        </div>
      </div>

      {/* Aggregate Emotion & Topic Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
        {/* Topic Breakdown */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
            Extracted Discussion Topics & Churn Correlation
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topicsSummary.map(t => (
              <div key={t.topic} style={{ padding: "10px 14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: COLOR.ink }}>{t.topic}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLOR.risk }}>{t.riskCorrelation}</span>
                </div>
                <div style={{ fontSize: 11, color: COLOR.inkSoft, marginTop: 4 }}>
                  Detected in <b>{t.count} conversations</b> across current month.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion Distribution */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
            Customer Sentiment Distribution
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Satisfied (Positive)", pct: 45, color: COLOR.stable },
              { label: "Neutral / Inquiries", pct: 20, color: COLOR.blue },
              { label: "Frustrated (Support Lags)", pct: 22, color: "#E65100" },
              { label: "Angry (Disputes / Rate Churn)", pct: 13, color: COLOR.risk }
            ].map(e => (
              <div key={e.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: COLOR.ink }}>{e.label}</span>
                  <span style={{ fontWeight: 700, color: e.color }}>{e.pct}%</span>
                </div>
                <div style={{ width: "100%", height: 8, background: COLOR.paper, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${e.pct}%`, height: "100%", background: e.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22, padding: "12px 14px", background: "rgba(178,58,50,.06)", border: `1px solid rgba(178,58,50,.2)`, borderRadius: 6, fontSize: 11.5, color: COLOR.ink }}>
            🔥 <b>Empirical Finding:</b> Accounts exhibiting <i>Angry</i> sentiment combined with billing fee disputes have an 88% 30-day churn likelihood if unaddressed within 48h.
          </div>
        </div>
      </div>

      {/* Real Customer Transcript Feed */}
      <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink }}>
            Analyzed Customer Transcripts & Tickets ({filteredLogs.length})
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={filterEmotion}
              onChange={e => setFilterEmotion(e.target.value)}
              style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 6, border: `1px solid ${COLOR.hair}`, background: "#fff", outline: "none" }}
            >
              <option value="all">All Emotions</option>
              <option value="Angry">Angry</option>
              <option value="Frustrated">Frustrated</option>
              <option value="Satisfied">Satisfied</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredLogs.map(log => {
            const cust = customers.find(c => c.id === log.customer_id);

            return (
              <div
                key={log.id}
                onClick={() => cust && onOpenCustomer(cust)}
                style={{
                  padding: "14px 16px",
                  background: COLOR.paperRaised,
                  borderRadius: 6,
                  border: `1px solid ${COLOR.hair}`,
                  cursor: cust ? "pointer" : "default"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: COLOR.ink }}>{log.customer_name}</span>
                    <span style={{ fontSize: 11, color: COLOR.inkSoft, marginLeft: 8 }}>({log.customer_id}) • {log.channel} • {log.date}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: `${emotionColors[log.emotion]}18`,
                      color: emotionColors[log.emotion]
                    }}>
                      Emotion: {log.emotion}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: COLOR.risk }}>
                      {log.churn_impact}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: COLOR.ink, fontStyle: "italic", lineHeight: 1.5, background: "#fff", padding: "10px 12px", borderRadius: 4, border: `1px solid ${COLOR.hair}` }}>
                  "{log.text}"
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {log.topics.map(t => (
                      <span key={t} style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 4, background: COLOR.paper, color: COLOR.inkSoft, fontWeight: 600 }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {cust && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLOR.brass, display: "flex", alignItems: "center", gap: 3 }}>
                      View Customer 360 Profile <ChevronRight size={13} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

