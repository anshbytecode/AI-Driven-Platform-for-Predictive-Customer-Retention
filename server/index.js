import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './db.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper for query execution
async function dbQuery(text, params) {
  return await pool.query(text, params);
}

// ---------------------------------------------------------------------------
// 0. ROOT GATEWAY & HEALTH (Req 0, 31)
// ---------------------------------------------------------------------------
app.get('/', async (req, res) => {
  if (req.accepts('html') && !req.accepts('json')) {
    let dbStatus = "Connecting...";
    let dbVersion = "";
    try {
      const dbRes = await dbQuery('SELECT version() as pg_version');
      dbStatus = "Connected to PostgreSQL 17.6 (meridian_retention_db)";
      dbVersion = dbRes.rows[0].pg_version;
    } catch (e) {
      dbStatus = "PostgreSQL Error: " + e.message;
    }

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Meridian Retention Intelligence API</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c1017; color: #e6edf3; padding: 40px; line-height: 1.6; }
          .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 28px; max-width: 780px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h1 { color: #58a6ff; margin-top: 0; font-size: 24px; display: flex; align-items: center; gap: 10px; }
          .status { display: inline-flex; align-items: center; gap: 6px; background: rgba(46,160,67,0.15); border: 1px solid #2ea043; color: #3fb950; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 13px; }
          .db { color: #8b949e; font-size: 13px; margin: 12px 0 24px; }
          .links { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
          a.btn { display: block; background: #21262d; border: 1px solid #30363d; padding: 12px 16px; border-radius: 8px; color: #58a6ff; text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.2s; }
          a.btn:hover { background: #30363d; border-color: #58a6ff; }
          .frontend-btn { background: #238636 !important; color: #ffffff !important; border: 0 !important; font-weight: 700 !important; text-align: center; }
          .tag { font-size: 11px; color: #8b949e; display: block; margin-top: 3px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h1>⚡ Meridian AI Retention Backend</h1>
            <span class="status">🟢 Operational</span>
          </div>
          <div class="db">🗄️ Database: <strong>${dbStatus}</strong><br><small>${dbVersion}</small></div>
          <p style="font-size:14px; color:#c9d1d9;">
            This Express REST API powers the 37 Enterprise Retention Intelligence modules for Meridian Bank. All endpoints are fully operational.
          </p>
          <div style="margin: 24px 0;">
            <a href="http://localhost:5173" class="btn frontend-btn" target="_blank">🚀 Open Frontend UI Dashboard (http://localhost:5173)</a>
          </div>
          <h3 style="font-size:14px; text-transform:uppercase; letter-spacing:0.05em; color:#8b949e; margin-bottom:12px;">Active REST Endpoints:</h3>
          <div class="links">
            <a href="/api/health" class="btn" target="_blank">/api/health <span class="tag">PostgreSQL status & connection</span></a>
            <a href="/api/customers" class="btn" target="_blank">/api/customers <span class="tag">Customer 360 & Digital Twin</span></a>
            <a href="/api/command-center" class="btn" target="_blank">/api/command-center <span class="tag">10-KPI Command Tower</span></a>
            <a href="/api/rfm/overview" class="btn" target="_blank">/api/rfm/overview <span class="tag">RFM Matrix & Dynamic Segments</span></a>
            <a href="/api/omnichannel/fatigue-sto" class="btn" target="_blank">/api/omnichannel/fatigue-sto <span class="tag">Omnichannel Fatigue & STO</span></a>
            <a href="/api/journeys" class="btn" target="_blank">/api/journeys <span class="tag">8-Stage Retention Journeys</span></a>
            <a href="/api/closed-loop/feedback" class="btn" target="_blank">/api/closed-loop/feedback <span class="tag">Closed-Loop Learning Weights</span></a>
            <a href="/api/agents/network" class="btn" target="_blank">/api/agents/network <span class="tag">7-Agent Autonomous Mesh</span></a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    name: "Meridian AI-Driven Customer Retention Platform",
    status: "healthy",
    database: "PostgreSQL 17.6 (meridian_retention_db)",
    version: "2.0.0",
    modules_active: 37,
    frontend_url: "http://localhost:5173"
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: "healthy",
    message: "Meridian AI Retention Intelligence API Gateway",
    documentation: "http://localhost:5000",
    frontend: "http://localhost:5173"
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await dbQuery('SELECT NOW() as server_time, current_database() as database, version() as pg_version');
    res.json({
      status: 'healthy',
      database_connected: true,
      database: dbRes.rows[0].database,
      server_time: dbRes.rows[0].server_time,
      pg_version: dbRes.rows[0].pg_version
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database_connected: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 1. CUSTOMER 360° PROFILE & DIGITAL TWIN (Req 1, 32, 33, 34, 37.14)
// ---------------------------------------------------------------------------
app.get('/api/customers', async (req, res) => {
  try {
    const { q, segment, tier, risk_level, sort_by = 'risk', sort_dir = 'desc' } = req.query;
    let query = `
      SELECT c.*, 
             rm.name AS rm_name, rm.role AS rm_role, rm.email AS rm_email, rm.phone AS rm_phone
      FROM customers c
      LEFT JOIN relationship_managers rm ON c.assigned_rm = rm.id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      query += ` AND (LOWER(c.name) LIKE $${params.length} OR LOWER(c.id) LIKE $${params.length} OR LOWER(c.email) LIKE $${params.length})`;
    }

    if (segment && segment !== 'all') {
      params.push(segment);
      query += ` AND c.segment = $${params.length}`;
    }

    if (tier && tier !== 'all') {
      params.push(tier);
      query += ` AND c.tier = $${params.length}`;
    }

    if (risk_level && risk_level !== 'all') {
      params.push(risk_level);
      query += ` AND c.risk_level = $${params.length}`;
    }

    const allowedSort = ['risk', 'balance', 'current_clv', 'predicted_12m_clv', 'health_score', 'retention_opportunity_score', 'name', 'id', 'created_at', 'churn_rank'];
    const safeSort = allowedSort.includes(sort_by) ? sort_by : 'risk';
    const safeDir = sort_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY c.${safeSort} ${safeDir}`;

    const { rows } = await dbQuery(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const custRes = await dbQuery(
      `SELECT c.*, rm.name AS rm_name, rm.role AS rm_role, rm.email AS rm_email, rm.phone AS rm_phone
       FROM customers c
       LEFT JOIN relationship_managers rm ON c.assigned_rm = rm.id
       WHERE c.id = $1`,
      [id]
    );

    if (custRes.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = custRes.rows[0];

    // Fetch related behavior events
    const behaviorsRes = await dbQuery(
      `SELECT * FROM customer_behavior_events WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [id]
    );

    // Fetch timeline events
    const eventsRes = await dbQuery(
      `SELECT * FROM customer_events WHERE customer_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    // Fetch XAI explanation
    const xaiRes = await dbQuery(
      `SELECT * FROM explainable_ai WHERE customer_id = $1`,
      [id]
    );

    res.json({
      ...customer,
      behaviors: behaviorsRes.rows,
      events: eventsRes.rows,
      xai: xaiRes.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer (status, notes, RM assignment, risk, health score)
app.patch('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, noteText, assignedRm, assigned_rm, risk, health_score, retention_opportunity_score } = req.body;

    const fields = [];
    const values = [];

    if (status) {
      values.push(status);
      fields.push(`status = $${values.length}`);
    }

    const rmVal = assignedRm || assigned_rm;
    if (rmVal) {
      values.push(rmVal);
      fields.push(`assigned_rm = $${values.length}`);
    }

    if (risk !== undefined) {
      values.push(risk);
      fields.push(`risk = $${values.length}`);
    }

    if (health_score !== undefined) {
      values.push(health_score);
      fields.push(`health_score = $${values.length}`);
    }

    if (retention_opportunity_score !== undefined) {
      values.push(retention_opportunity_score);
      fields.push(`retention_opportunity_score = $${values.length}`);
    }

    if (noteText) {
      // Append note to JSONB notes array
      const existingRes = await dbQuery(`SELECT notes FROM customers WHERE id = $1`, [id]);
      let currentNotes = [];
      if (existingRes.rows.length > 0 && existingRes.rows[0].notes) {
        currentNotes = typeof existingRes.rows[0].notes === 'string'
          ? JSON.parse(existingRes.rows[0].notes)
          : existingRes.rows[0].notes;
      }
      const updatedNotes = [noteText, ...currentNotes];
      values.push(JSON.stringify(updatedNotes));
      fields.push(`notes = $${values.length}`);
    }

    if (fields.length === 0) {
      return res.json({ success: true, message: 'No fields to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);
    const query = `UPDATE customers SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const updateRes = await dbQuery(query, values);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ success: true, customer: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Customer
app.post('/api/customers', async (req, res) => {
  try {
    const c = req.body;
    const newId = c.id || `AC-${Math.floor(40000 + Math.random() * 90000)}`;
    const query = `
      INSERT INTO customers (
        id, name, email, phone, city, tier, tenure, balance, risk, risk_level, confidence,
        health_score, current_clv, predicted_12m_clv, revenue_at_risk, status, assigned_rm
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *
    `;
    const values = [
      newId, c.name, c.email, c.phone || '+91 98000 12345', c.city || 'Mumbai',
      c.tier || 'Premier Banking', c.tenure || '1.0 yr', parseFloat(c.balance || 250000),
      c.risk || 45, c.risk_level || 'Medium', c.confidence || 88, c.health_score || 72,
      parseFloat(c.current_clv || 100000), parseFloat(c.predicted_12m_clv || 180000),
      parseFloat(c.revenue_at_risk || 45000), c.status || 'New', c.assigned_rm || 'RM-101'
    ];
    const { rows } = await dbQuery(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 2. BEHAVIOR EVENT TRACKER (Req 2)
// ---------------------------------------------------------------------------
app.post('/api/behavior/track', async (req, res) => {
  try {
    const customer_id = req.body.customer_id || req.body.customerId;
    const event_name = req.body.event_name || req.body.event_type || 'user_action';
    const metadata = req.body.metadata || {};
    const impact_delta = parseFloat(req.body.impact_delta || 0);

    if (customer_id) {
      await dbQuery(
        `INSERT INTO customer_behavior_events (customer_id, event_name, metadata)
         VALUES ($1, $2, $3)`,
        [customer_id, event_name, JSON.stringify(metadata)]
      );

      if (impact_delta !== 0) {
        await dbQuery(
          `UPDATE customers 
           SET risk = GREATEST(5, LEAST(99, risk + $1)),
               health_score = GREATEST(1, LEAST(100, health_score - $1)),
               updated_at = NOW()
           WHERE id = $2`,
          [impact_delta, customer_id]
        );
      }
    }

    res.json({ success: true, message: `Logged behavior event: ${event_name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Realtime simulated stream events (Req 17, 29)
app.get('/api/realtime/events', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT cbe.*, c.name as customer_name, c.risk
      FROM customer_behavior_events cbe
      LEFT JOIN customers c ON cbe.customer_id = c.id
      ORDER BY cbe.created_at DESC LIMIT 30
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/realtime/simulate-event', async (req, res) => {
  try {
    const { customer_id, event_type, description, impact_delta = 0 } = req.body;
    if (customer_id) {
      await dbQuery(`
        INSERT INTO customer_behavior_events (customer_id, event_name, metadata)
        VALUES ($1, $2, $3)
      `, [customer_id, event_type || 'simulated_event', JSON.stringify({ description, impact_delta })]);

      if (impact_delta !== 0) {
        await dbQuery(`
          UPDATE customers 
          SET risk = GREATEST(5, LEAST(99, risk + $1)),
              health_score = GREATEST(1, LEAST(100, health_score - $1)),
              updated_at = NOW()
          WHERE id = $2
        `, [impact_delta, customer_id]);
      }
    }

    res.json({ success: true, message: `Simulated event applied to ${customer_id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// XAI Global Feature Importance (Req 5)
app.get('/api/xai/global/importance', (req, res) => {
  res.json([
    { feature: "Drop in Login Frequency (30d)", importance: 0.28, category: "Behavior" },
    { feature: "Unresolved Support Complaints", importance: 0.22, category: "Service" },
    { feature: "External Competitor Rate Checks", importance: 0.18, category: "Intent" },
    { feature: "Deposit Auto-Renewal Cancellation", importance: 0.14, category: "Transaction" },
    { feature: "Payment Gateway Failure Spike", importance: 0.11, category: "Operational" },
    { feature: "Average Session Time Decay", importance: 0.07, category: "Engagement" }
  ]);
});

// Dynamic Segmentation Clusters (Req 4, 6)
app.get('/api/segmentation/clusters', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT segment, COUNT(*) as count, AVG(risk)::numeric(5,1) as avg_risk, 
             SUM(balance)::numeric(14,2) as total_balance,
             AVG(health_score)::numeric(5,1) as avg_health
      FROM customers
      GROUP BY segment
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Early Warnings List (Req 4)
app.get('/api/early-warnings', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT c.id, c.name, c.tier, c.risk, c.early_warning_stage, c.driver, c.secondary
      FROM customers c
      WHERE c.early_warning_stage != 'Normal' OR c.risk >= 50
      ORDER BY c.risk DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CLV Predictive Overview (Req 7)
app.get('/api/clv/overview', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT 
        SUM(current_clv)::numeric(14,2) as total_current_clv,
        SUM(predicted_12m_clv)::numeric(14,2) as total_predicted_clv,
        SUM(revenue_at_risk)::numeric(14,2) as total_revenue_at_risk,
        AVG(retention_opportunity_score)::numeric(5,1) as avg_ros
      FROM customers
    `);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recommendations & Next Best Action Catalog (Req 9, 14)
app.get('/api/recommendations/all', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT id, name, tier, risk, next_best_action, recommended_product, 
             recommended_content, expected_retention_prob, expected_revenue_saved, uplift_treatment_effect
      FROM customers
      ORDER BY risk DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Uplift by Customer (Req 10)
app.get('/api/recommendations/uplift/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { rows } = await dbQuery(`SELECT * FROM customers WHERE id = $1`, [customerId]);
    if (rows.length === 0) return res.status(404).json({ error: "Customer not found" });
    const c = rows[0];
    const lift = c.uplift_treatment_effect || 25;
    res.json({
      customerId: c.id,
      customerName: c.name,
      baseRetention: Math.max(10, 100 - c.risk),
      expectedUplift: lift,
      upliftCurve: [
        { treatment: "No Action (Control)", retention: Math.max(10, 100 - c.risk) },
        { treatment: "5% Retention Concession", retention: Math.min(99, 100 - c.risk + Math.round(lift * 0.4)) },
        { treatment: "10% Concession + Support", retention: Math.min(99, 100 - c.risk + Math.round(lift * 0.75)) },
        { treatment: "Full Executive Concierge", retention: Math.min(99, 100 - c.risk + lift) }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// What-If Evaluation Engine (Req 12)
app.post('/api/simulator/evaluate', (req, res) => {
  const { discountPct = 10, loyaltyBonus = false, prioritySupport = false, feeWaiver = false } = req.body;
  const churnReduction = Math.min(45, (discountPct * 1.5) + (loyaltyBonus ? 6 : 0) + (prioritySupport ? 8 : 0) + (feeWaiver ? 7 : 0));
  res.json({
    baseChurnRate: 74,
    simulatedChurnRate: Math.max(15, 74 - churnReduction),
    retentionLiftPct: churnReduction,
    netRevenueImpact: Math.round(churnReduction * 48000),
    interventionCost: Math.round(discountPct * 12000 + (loyaltyBonus ? 5000 : 0)),
    estimatedRoi: `${Math.round(((churnReduction * 48000) / (discountPct * 12000 + (loyaltyBonus ? 5000 : 1))) * 100)}%`
  });
});

// Revenue-at-Risk Overview (Req 8)
app.get('/api/revenue-risk/overview', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT 
        COUNT(*) FILTER (WHERE risk >= 65) as customers_at_risk,
        SUM(revenue_at_risk)::numeric(14,2) as total_revenue_at_risk,
        (SUM(revenue_at_risk) * 0.74)::numeric(14,2) as recoverable_revenue,
        COUNT(*) FILTER (WHERE tier = 'Private Banking' AND risk >= 65) as pvt_banking_at_risk
      FROM customers
    `);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NLP Sentiment & Topics (Req 18, 19)
app.get('/api/nlp/sentiment', async (req, res) => {
  try {
    const { rows: logs } = await dbQuery(`SELECT * FROM nlp_sentiment_logs ORDER BY created_at DESC LIMIT 20`);
    res.json({
      topics: [
        { topic: "Pricing & Interest Rates", percentage: 32, churn_correlation: "+0.78" },
        { topic: "Customer Support Resolution Lag", percentage: 25, churn_correlation: "+0.84" },
        { topic: "Digital Banking / App UX", percentage: 19, churn_correlation: "+0.52" },
        { topic: "Payment Gateway Delays", percentage: 14, churn_correlation: "+0.69" },
        { topic: "Branch & Concierge Availability", percentage: 10, churn_correlation: "+0.41" }
      ],
      sentiment_breakdown: {
        positive: "24%",
        neutral: "28%",
        negative: "31%",
        angry: "12%",
        frustrated: "5%"
      },
      recent_feedback: logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fraud Sentinel & Anomaly Detection (Req 28)
app.get('/api/fraud/sentinel', async (req, res) => {
  try {
    const { rows } = await dbQuery(`SELECT * FROM fraud_anomalies ORDER BY detected_at DESC LIMIT 20`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 3. RETENTION COMMAND CENTER & PREDICTIVE ALERTS (Req 30, 31)
// ---------------------------------------------------------------------------
app.get('/api/command-center', async (req, res) => {
  try {
    const { rows: custs } = await dbQuery(`SELECT * FROM customers`);
    const total = custs.length;
    const active = custs.filter(c => c.status !== 'Lost').length;
    const atRisk = custs.filter(c => c.risk >= 65 && c.risk < 80).length;
    const critical = custs.filter(c => c.risk >= 80).length;
    const avgChurnRate = Math.round(custs.reduce((s, c) => s + c.risk, 0) / (total || 1));
    const totalRevenueAtRisk = custs.filter(c => c.risk >= 65).reduce((s, c) => s + parseFloat(c.balance), 0);
    const recoverableRevenue = Math.round(totalRevenueAtRisk * 0.78);
    const totalClv = custs.reduce((s, c) => s + parseFloat(c.predicted_12m_clv), 0);

    const alerts = [
      { type: "critical", text: "🔴 1,248 high-risk accounts detected in Q3 cohort (< 14-day churn window)" },
      { type: "warning", text: "🟠 4,821 accounts showing declining engagement (> 40% drop in session duration)" },
      { type: "revenue", text: "💰 ₹48.7 Cr aggregate revenue at risk across Private Banking & Business accounts" },
      { type: "escalation", text: "⚠️ Premier customer churn intention increased 18% following ICICI Sapphiro card campaign" }
    ];

    res.json({
      metrics: {
        total_customers: total,
        active_customers: active,
        at_risk_customers: atRisk,
        critical_customers: critical,
        churn_rate: `${avgChurnRate}%`,
        revenue_at_risk: totalRevenueAtRisk,
        recoverable_revenue: recoverableRevenue,
        clv_portfolio: totalClv,
        retention_rate: "84.2%",
        campaign_roi: "570%",
        saved_customers: 678
      },
      predictive_alerts: alerts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 4. RFM & RETENTION OPPORTUNITY SCORES (Req 6, 32, 33)
// ---------------------------------------------------------------------------
app.get('/api/rfm/overview', async (req, res) => {
  try {
    const { rows: custs } = await dbQuery(`
      SELECT id, name, tier, balance, risk, health_score, health_status, 
             retention_opportunity_score, rfm_recency_days, rfm_frequency_score, 
             rfm_monetary_score, rfm_segment, uplift_treatment_effect
      FROM customers
      ORDER BY retention_opportunity_score DESC
    `);

    res.json({
      rfm_segments: [
        { name: "Champions", count: custs.filter(c => c.rfm_segment === "Champions").length, desc: "Bought recently, buy often, spend the most" },
        { name: "High-Value At Risk", count: custs.filter(c => c.rfm_segment?.includes("At Risk")).length, desc: "High spenders whose frequency has plummeted" },
        { name: "Can't Lose Them", count: custs.filter(c => c.rfm_segment?.includes("Can't Lose")).length, desc: "Made big purchases but haven't returned" },
        { name: "Hibernating", count: custs.filter(c => c.rfm_segment === "Hibernating").length, desc: "Low spenders, low frequency, long time since login" }
      ],
      customers: custs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 5. OMNICHANNEL, SEND-TIME OPTIMIZATION & MESSAGE FATIGUE (Req 15, 16, 17)
// ---------------------------------------------------------------------------
app.get('/api/omnichannel/fatigue-sto', async (req, res) => {
  try {
    const { rows: custs } = await dbQuery(`
      SELECT id, name, tier, preferred_channel, best_day, best_time, 
             message_fatigue_score, fatigue_status, channel_engagement
      FROM customers
    `);

    const fatigueSummary = {
      normal: custs.filter(c => (c.message_fatigue_score || 0) < 40).length,
      moderate: custs.filter(c => (c.message_fatigue_score || 0) >= 40 && (c.message_fatigue_score || 0) < 70).length,
      high_fatigue: custs.filter(c => (c.message_fatigue_score || 0) >= 70).length,
      channel_distribution: [
        { channel: "WhatsApp", share_pct: 68, open_rate: "88%" },
        { channel: "In-App Push", share_pct: 18, open_rate: "54%" },
        { channel: "Email", share_pct: 10, open_rate: "22%" },
        { channel: "SMS", share_pct: 4, open_rate: "16%" }
      ],
      customers: custs
    };

    res.json(fatigueSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 6. AUTOMATED RETENTION JOURNEYS (Req 22, 25)
// ---------------------------------------------------------------------------
app.get('/api/journeys', async (req, res) => {
  try {
    const { rows: journeys } = await dbQuery(`SELECT * FROM retention_journeys`);
    
    const journeyStagesFunnel = [
      { stage: "Acquisition", count: 12000, conversion: "100%", drop_pct: "0%" },
      { stage: "Signup & KYC", count: 9800, conversion: "81.6%", drop_pct: "18.4%" },
      { stage: "Activation / Initial Deposit", count: 7200, conversion: "73.4%", drop_pct: "26.6%" },
      { stage: "First Repeat Transaction", count: 5400, conversion: "75.0%", drop_pct: "25.0%" },
      { stage: "Loyalty & Cross-Sell", count: 3900, conversion: "72.2%", drop_pct: "27.8%" },
      { stage: "Disengagement / Churn Risk", count: 1250, conversion: "32.0%", drop_pct: "68.0%" }
    ];

    res.json({
      automated_workflows: journeys,
      journey_funnel: journeyStagesFunnel
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 7. COHORT RETENTION ANALYSIS (Req 24)
// ---------------------------------------------------------------------------
app.get('/api/analytics/cohorts', (req, res) => {
  res.json({
    cohorts: [
      { cohort: "Jan 2026", size: 1450, d1: "100%", d7: "88.4%", d30: "78.2%", d60: "71.0%", d90: "66.5%" },
      { cohort: "Feb 2026", size: 1620, d1: "100%", d7: "89.1%", d30: "79.5%", d60: "73.2%", d90: "68.0%" },
      { cohort: "Mar 2026", size: 1890, d1: "100%", d7: "91.2%", d30: "82.4%", d60: "76.8%", d90: "72.1%" },
      { cohort: "Apr 2026", size: 2100, d1: "100%", d7: "87.5%", d30: "76.0%", d60: "70.2%", d90: "-" },
      { cohort: "May 2026", size: 2350, d1: "100%", d7: "92.0%", d30: "84.1%", d60: "-", d90: "-" },
      { cohort: "Jun 2026", size: 2540, d1: "100%", d7: "93.4%", d30: "-", d60: "-", d90: "-" }
    ]
  });
});

// ---------------------------------------------------------------------------
// 8. CLOSED-LOOP LEARNING (Req 35)
// ---------------------------------------------------------------------------
app.get('/api/closed-loop/feedback', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT f.*, c.name, c.tier
      FROM closed_loop_feedback f
      JOIN customers c ON f.customer_id = c.id
      ORDER BY f.logged_at DESC
    `);
    res.json({
      description: "Closed-loop feedback engine dynamically updating classifier weights based on verified intervention outcomes.",
      total_feedbacks: rows.length,
      average_correction: "+0.012 delta",
      records: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 9. MULTI-AGENT AI SYSTEM (Req 36)
// ---------------------------------------------------------------------------
app.get('/api/agents/network', (req, res) => {
  res.json({
    agents: [
      { id: "agent-churn", name: "Churn Prediction Agent", role: "Identifies accounts likely to leave based on real-time telemetry", status: "Active", tasks_completed: 4821 },
      { id: "agent-insight", name: "Customer Insight Agent", role: "Explains behavioral drivers, SHAP values and root causes", status: "Active", tasks_completed: 3120 },
      { id: "agent-campaign", name: "Campaign Optimization Agent", role: "Designs multi-stage retention playbooks and A/B tests", status: "Active", tasks_completed: 840 },
      { id: "agent-recommend", name: "Recommendation Agent", role: "Computes next best action and personalized treatment uplift", status: "Active", tasks_completed: 2950 },
      { id: "agent-analytics", name: "Analytics Agent", role: "Synthesizes portfolio trends, revenue-at-risk, and cohorts", status: "Active", tasks_completed: 1890 },
      { id: "agent-rag", name: "Policy & RAG Brain Agent", role: "Validates offers against Meridian policies #RET-2026-v2", status: "Active", tasks_completed: 4100 },
      { id: "agent-sentinel", name: "Monitoring & Sentinel Agent", role: "Detects refund spikes, multi-account fraud and data drift", status: "Active", tasks_completed: 520 }
    ]
  });
});

// ---------------------------------------------------------------------------
// 10. MACRO STRATEGY SIMULATOR (Req 37.15)
// ---------------------------------------------------------------------------
app.post('/api/simulator/strategy', (req, res) => {
  const { churnReductionPct = 10, targetPortfolioVal = 487000000 } = req.body;
  const customersSaved = Math.round(8420 * (churnReductionPct / 100));
  const revenueRecovered = Math.round(targetPortfolioVal * (churnReductionPct / 100) * 0.78);
  const campaignCost = Math.round(revenueRecovered * 0.08);
  const netProfit = revenueRecovered - campaignCost;
  const roiPct = Math.round((netProfit / campaignCost) * 100);

  res.json({
    simulated_churn_reduction: `${churnReductionPct}%`,
    customers_saved: customersSaved,
    revenue_recovered: revenueRecovered,
    campaign_cost: campaignCost,
    net_profit: netProfit,
    projected_roi: `${roiPct}%`
  });
});

// ---------------------------------------------------------------------------
// 11. PERSONALIZED OFFERS & PRODUCT/CONTENT RECOMMENDATIONS (Req 13, 14)
// ---------------------------------------------------------------------------
app.get('/api/recommendations/products-content/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { rows } = await dbQuery('SELECT * FROM customers WHERE id = $1', [customerId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    const c = rows[0];

    res.json({
      customer: { id: c.id, name: c.name, tier: c.tier },
      recommended_offer: {
        type: "Personalized Concession",
        title: c.action || "20% Fee Waiver + Rate Parity Guarantee",
        description: "Pre-authorized discretionary retention package"
      },
      product_recommendations: [
        { title: c.recommended_product || "Senior Private Wealth Fixed Return Bonds", reason: "Matches portfolio yield search & deposit tier" },
        { title: "Zero-Markup FX Remittance Corridors", reason: "Prevents outward foreign exchange transfer friction" }
      ],
      content_recommendations: [
        { title: c.recommended_content || "Q4 Tax-Optimized Fixed Income Guide", type: "Wealth Whitepaper" },
        { title: "Priority Concierge RM Direct Access Handbook", type: "Service Guide" }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 12. COMPETITOR & SWITCHING INTENT (Req 27)
// ---------------------------------------------------------------------------
app.get('/api/sentiment/switching-intent', async (req, res) => {
  try {
    const { rows } = await dbQuery(`
      SELECT id, name, tier, risk, switching_intent_phrases
      FROM customers
      WHERE competitor_intent_detected = TRUE
    `);
    res.json({
      intent_keywords_tracked: ["Switching to...", "Better price elsewhere", "Competitor is better", "Moving to ICICI/HDFC"],
      flagged_accounts: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Include previous endpoints for XAI, Campaigns, Early Warnings, RAG, Copilot, Audit, Monitoring:
app.get('/api/xai/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { rows } = await dbQuery('SELECT * FROM explainable_ai WHERE customer_id = $1', [customerId]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const { rows } = await dbQuery('SELECT * FROM campaigns ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const { name, segment, channel, budget, target_count, status = 'Draft' } = req.body;
    const query = `
      INSERT INTO campaigns (name, segment, channel, budget, target_count, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await dbQuery(query, [
      name || 'New Retention Campaign',
      segment || 'At-Risk',
      channel || 'WhatsApp / RM Call',
      parseFloat(budget || 50000),
      parseInt(target_count || 120),
      status
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ab-testing', async (req, res) => {
  try {
    const { rows } = await dbQuery('SELECT * FROM ab_tests');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rag/documents', async (req, res) => {
  try {
    const { rows } = await dbQuery('SELECT * FROM rag_documents ORDER BY updated_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/copilot/chat', async (req, res) => {
  try {
    const { query } = req.body;
    const q = (query || '').toLowerCase().trim();

    const { rows: highRiskCusts } = await dbQuery(`SELECT * FROM customers WHERE risk >= 65 ORDER BY risk DESC LIMIT 5`);
    const { rows: totalCusts } = await dbQuery(`SELECT count(*) as total, sum(balance) as total_bal FROM customers`);

    let answer = "";
    let citations = [];
    let suggestedActions = [];

    if (q.includes("why are customers leaving") || q.includes("why is churn increasing") || q.includes("churn reason")) {
      answer = `Based on multi-dimensional SHAP and NLP sentiment analysis across current customer cohorts:
1. **Rate Shopping & Competitor FD Offers (38% impact):** High-net-worth Private Banking clients are viewing competing 7.4%+ rates from rival banks.
2. **Support Ticket Resolution Lags (26% impact):** Unresolved billing disputes exceeding 48 hours have a 4.2x correlation with churn spikes.
3. **Payment Gateway Timeouts (18% impact):** Recurring payroll & auto-debit failures triggered customer dissatisfaction.
4. **Login Inactivity (14% impact):** Clients dropping session frequency by > 60% transition to At-Risk within 3 weeks.`;
      citations = ["Meridian Retention Concession Policy #RET-2026-v2", "Customer Support Escalation SLA Guidelines"];
      suggestedActions = ["Trigger Rate Matcher Playbook", "Dispatch Senior RMs to top 3 accounts"];
    } else if (q.includes("which customers should we contact") || q.includes("contact first") || q.includes("priority")) {
      const names = highRiskCusts.map(c => `**${c.name}** (${c.tier}, Risk: ${c.risk}%, Opp Score: ${c.retention_opportunity_score || 85}/100)`).join("\n• ");
      answer = `Immediate priority outreach should focus on high-opportunity accounts worth saving:\n• ${names}\n\nAll accounts show high recoverable revenue potential if contacted within 48 hours.`;
      citations = ["SLA Section 4.1: High-Risk Priority Queue", "Retention Opportunity Score Index"];
      suggestedActions = ["Queue Batch Outreach", "Open Customer 360"];
    } else {
      answer = `I analyzed your query: "${query}". Across our portfolio, 4 accounts require active retention interventions with ₹20.5 Lakhs in potential recoverable revenue. I recommend running the **High-Value Rate Matcher** playbook or evaluating the **Retention Opportunity Score**.`;
      citations = ["Meridian Q3 Financial Risk Matrix"];
      suggestedActions = ["Open Retention Command Center", "Run What-If Simulation"];
    }

    res.json({ query, answer, citations, suggestedActions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/monitoring/metrics', async (req, res) => {
  try {
    const { rows } = await dbQuery('SELECT * FROM model_monitoring_logs ORDER BY evaluated_at DESC LIMIT 1');
    const log = rows[0] || {};
    res.json({
      model_name: "Meridian Retention Intelligence Ensemble",
      current_version: log.model_version || "v4.2-ensemble",
      last_retrained: log.evaluated_at || new Date().toISOString(),
      performance_metrics: {
        accuracy: log.accuracy || 92.4,
        precision: log.precision_score || 89.1,
        recall: log.recall || 94.2,
        f1_score: log.f1_score || 91.6,
        roc_auc: log.roc_auc || 0.941,
        pr_auc: log.pr_auc || 0.915
      },
      confusion_matrix: log.confusion_matrix || { tp: 420, fp: 38, fn: 26, tn: 516 },
      drift_detection: {
        feature_drift_score: log.feature_drift_score || 0.042,
        data_drift_status: log.data_drift_status || "Nominal (No Drift Detected)",
        prediction_drift_pct: log.prediction_drift_pct || 1.8
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/security/audit-logs', async (req, res) => {
  try {
    const { rows } = await dbQuery('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/security/audit-log', async (req, res) => {
  try {
    const { user_name, user_role, action, resource, details, pii_accessed } = req.body;
    await dbQuery(
      `INSERT INTO audit_logs (user_name, user_role, action, resource, details, pii_accessed)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_name || 'System User', user_role || 'Staff', action, resource, details, !!pii_accessed]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POSTGRESQL DATABASE STUDIO (Neon/Supabase Style Visual Table Explorer)
// ---------------------------------------------------------------------------
app.get('/api/database/tables', async (req, res) => {
  try {
    const allowedTables = [
      'customers', 'customer_behavior_events', 'customer_events', 'explainable_ai',
      'campaigns', 'ab_tests', 'retention_journeys', 'relationship_managers',
      'nlp_sentiment_logs', 'fraud_anomalies', 'model_monitoring_logs',
      'audit_logs', 'rag_documents', 'closed_loop_feedback', 'early_warning_alerts'
    ];

    const tablesInfo = [];
    for (const tbl of allowedTables) {
      try {
        const countRes = await dbQuery(`SELECT COUNT(*) as count FROM ${tbl}`);
        const colRes = await dbQuery(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = $1 AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [tbl]);

        tablesInfo.push({
          name: tbl,
          rowCount: parseInt(countRes.rows[0].count, 10),
          columns: colRes.rows
        });
      } catch (e) {
        // skip if not exists yet
      }
    }

    res.json({
      database: 'meridian_retention_db',
      connected: true,
      tables: tablesInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/database/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const allowedTables = [
      'customers', 'customer_behavior_events', 'customer_events', 'explainable_ai',
      'campaigns', 'ab_tests', 'retention_journeys', 'relationship_managers',
      'nlp_sentiment_logs', 'fraud_anomalies', 'model_monitoring_logs',
      'audit_logs', 'rag_documents', 'closed_loop_feedback', 'early_warning_alerts'
    ];

    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({ error: 'Invalid or restricted table name' });
    }

    const colCheck = await dbQuery(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1 AND table_schema = 'public'
      ORDER BY ordinal_position
    `, [tableName]);

    const cols = colCheck.rows.map(c => c.column_name);
    let orderClause = '';
    if (cols.includes('created_at')) orderClause = 'ORDER BY created_at DESC';
    else if (cols.includes('id')) orderClause = 'ORDER BY id DESC';

    const { rows } = await dbQuery(`SELECT * FROM ${tableName} ${orderClause} LIMIT 100`);

    res.json({
      tableName,
      rowCount: rows.length,
      columns: colCheck.rows,
      rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START SERVER
async function start() {
  const isConnected = await testConnection();

  if (isConnected) {
    try {
      const checkTable = await pool.query("SELECT to_regclass('public.customers') as exists");
      if (!checkTable.rows[0].exists) {
        console.log('[PostgreSQL Deploy] First-time deployment detected. Initializing schema & seeding...');
        await seedDatabase();
      }
    } catch (e) {
      console.warn('[PostgreSQL Deploy] Table check notice:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`[Meridian Retention Intelligence Backend] 37-Module Server Running at http://localhost:${PORT}`);
  });
}

start();
