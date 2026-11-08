import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('[PostgreSQL Seed] Initializing 37-feature schema and seed records...');

    // 1. Run Schema SQL
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('[PostgreSQL Seed] Tables successfully created.');

    // 2. Seed Relationship Managers
    const rms = [
      { id: "RM-101", name: "Priya Sharma", role: "Senior RM — Private Banking", email: "priya.sharma@meridian.bank", phone: "+91 98201 44102", accounts_count: 5, revenue_managed: 4122000, risk_count: 3 },
      { id: "RM-102", name: "David Chen", role: "RM — Business Banking", email: "david.chen@meridian.bank", phone: "+91 98202 33219", accounts_count: 4, revenue_managed: 1829000, risk_count: 2 },
      { id: "RM-103", name: "Rajesh Kumar", role: "RM — Premier Retail", email: "rajesh.kumar@meridian.bank", phone: "+91 98203 11984", accounts_count: 4, revenue_managed: 490100, risk_count: 2 },
      { id: "RM-104", name: "Sunita Rao", role: "RM — Standard Retail", email: "sunita.rao@meridian.bank", phone: "+91 98204 88203", accounts_count: 3, revenue_managed: 115300, risk_count: 1 },
    ];

    for (const rm of rms) {
      await client.query(
        `INSERT INTO relationship_managers (id, name, role, email, phone, accounts_count, revenue_managed, risk_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [rm.id, rm.name, rm.role, rm.email, rm.phone, rm.accounts_count, rm.revenue_managed, rm.risk_count]
      );
    }

    // 3. Seed Comprehensive Customers (Covers all 37 capabilities)
    const customers = [
      {
        id: "AC-40217",
        name: "Priya Kulkarni",
        email: "priya.kulkarni@gmail.com",
        phone: "+91 98765 43210",
        city: "Mumbai",
        age: 38,
        gender: "Female",
        occupation: "Investment Director",
        tier: "Private Banking",
        tenure: "6.2 yrs",
        signup_date: "2020-04-12",
        acquisition_source: "Executive Wealth Summit",
        device_type: "iOS / iPhone 15 Pro Max",
        browser: "Mobile Safari 17.4",
        balance: 842000,
        savings: 540000,
        fixed_deposit: 302000,
        credit_limit: 500000,
        active_loans: 0,
        risk: 88,
        risk_level: "Critical",
        confidence: 93,
        predicted_churn_window: "7–14 days",
        churn_rank: 1,
        binary_churn: 1,
        health_score: 28,
        health_status: "Critical",
        retention_opportunity_score: 94, // High Value + High Effectiveness
        recovery_status: "Offer Delivered",
        recovery_probability: 82,
        current_clv: 185000,
        predicted_12m_clv: 245000,
        revenue_at_risk: 215600,
        rfm_recency_days: 14,
        rfm_frequency_score: 4,
        rfm_monetary_score: 10,
        rfm_segment: "High-Value At Risk",
        transactions_per_month: 4,
        avg_order_value: 32000,
        login_frequency: 3,
        days_since_last_login: 14,
        avg_session_duration_min: 2.1,
        cart_abandonment_count: 3,
        subscription_status: "Active (Expiring)",
        support_tickets_count: 4,
        unresolved_complaints: 2,
        avg_resolution_time_hrs: 24.5,
        refund_count: 1,
        payment_failure_count: 2,
        sentiment_score: -0.84,
        latest_emotion: "Angry",
        preferred_channel: "WhatsApp",
        best_day: "Friday",
        best_time: "7:40 PM",
        message_fatigue_score: 35,
        fatigue_status: "Moderate",
        channel_engagement: { email_opens: 12, sms_opens: 6, whatsapp_opens: 94 },
        segment: "High-value/high-risk",
        early_warning_stage: "Critical",
        driver: "Rate shopping & Competitor FD comparisons",
        secondary: ["Fee sensitivity", "Reduced app logins (80% drop)", "2 unresolved complaints"],
        action: "20% personalized fee waiver & Relationship Pricing Review",
        next_best_action: "20% Fee Waiver + 7.45% Deposit Rate Match Guarantee",
        recommended_product: "Senior Private Wealth Fixed Return Bonds",
        recommended_content: "Exclusive Q4 Tax-Optimized Fixed Income Guide",
        expected_retention_prob: 82,
        expected_revenue_saved: 68000,
        uplift_treatment_effect: 35,
        competitor_intent_detected: true,
        switching_intent_phrases: ["Competitor ICICI offering 7.6% on 1-year FD", "Why are account maintenance fees so high?"],
        digital_twin: {
          churn_velocity: "Accelerating (+14% in 14 days)",
          price_elasticity: "High (0.84)",
          channel_affinity: "WhatsApp Concierge (94%)",
          preferred_products: ["Fixed Deposits", "Tax-Free Bonds", "Lounge Perks"]
        },
        is_anomaly: false,
        anomaly_reason: null,
        anomaly_score: 12,
        status: "Queued",
        assigned_rm: "RM-101",
        trend: [40, 46, 52, 61, 74, 88],
        notes: ["Client inquired about competitor FD rates on Aug 4.", "Scheduled follow-up with Senior RM."],
        behaviors: [
          { event: "Login", category: "Digital Activity", meta: { device: "iPhone 15 Pro", ip: "49.36.12.8" } },
          { event: "Product view", category: "Browse", meta: { product: "Fixed Deposit 12M", duration_sec: 14 } },
          { event: "Product search", category: "Browse", meta: { query: "premature withdrawal penalty" } },
          { event: "Support request", category: "Support", meta: { ticket_id: "TICK-9021", issue: "Maintenance fee dispute" } },
          { event: "Email opened", category: "Marketing", meta: { campaign: "Q3 Wealth Update", channel: "Email" } }
        ]
      },
      {
        id: "AC-40218",
        name: "Rohan Mehta",
        email: "rohan.mehta@techcorp.io",
        phone: "+91 98112 23344",
        city: "Bengaluru",
        age: 29,
        gender: "Male",
        occupation: "Senior Software Engineer",
        tier: "Retail — Premier",
        tenure: "2.1 yrs",
        signup_date: "2024-06-18",
        acquisition_source: "Fintech Referral Program",
        device_type: "MacBook Pro / macOS",
        browser: "Chrome 127",
        balance: 118500,
        savings: 68500,
        fixed_deposit: 50000,
        credit_limit: 250000,
        active_loans: 1,
        risk: 81,
        risk_level: "High",
        confidence: 86,
        predicted_churn_window: "7–14 days",
        churn_rank: 2,
        binary_churn: 1,
        health_score: 34,
        health_status: "At Risk",
        retention_opportunity_score: 86,
        recovery_status: "Unreached",
        recovery_probability: 79,
        current_clv: 42000,
        predicted_12m_clv: 68000,
        revenue_at_risk: 55080,
        rfm_recency_days: 8,
        rfm_frequency_score: 6,
        rfm_monetary_score: 7,
        rfm_segment: "At Risk",
        transactions_per_month: 6,
        avg_order_value: 4800,
        login_frequency: 5,
        days_since_last_login: 8,
        avg_session_duration_min: 3.4,
        cart_abandonment_count: 4,
        subscription_status: "Active",
        support_tickets_count: 3,
        unresolved_complaints: 1,
        avg_resolution_time_hrs: 48.0,
        refund_count: 2,
        payment_failure_count: 1,
        sentiment_score: -0.72,
        latest_emotion: "Frustrated",
        preferred_channel: "In-App",
        best_day: "Wednesday",
        best_time: "1:15 PM",
        message_fatigue_score: 78, // High Communication Fatigue
        fatigue_status: "High Fatigue",
        channel_engagement: { email_opens: 4, sms_opens: 2, in_app_opens: 72 },
        segment: "At-risk",
        early_warning_stage: "At-risk",
        driver: "Competitor credit card offer clicked",
        secondary: ["Billing dispute pending > 48h", "Cart checkout dropped 3x"],
        action: "Annual card fee waiver + 15% bonus dining cashback",
        next_best_action: "Credit Card Fee Waiver + Auto-resolve Billing Ticket",
        recommended_product: "Premier Dining & Travel Credit Card Upgrade",
        recommended_content: "Zero-Markup International Spending Guide",
        expected_retention_prob: 79,
        expected_revenue_saved: 24500,
        uplift_treatment_effect: 28,
        competitor_intent_detected: true,
        switching_intent_phrases: ["Applying for ICICI Sapphiro card with lounge access", "Waiting 15 mins on call support"],
        digital_twin: {
          churn_velocity: "Steep (+23% in 3 weeks)",
          price_elasticity: "Medium (0.62)",
          fatigue_risk: "Fatigued (12 emails sent in 7 days - throttling recommended)"
        },
        is_anomaly: false,
        anomaly_reason: null,
        anomaly_score: 8,
        status: "New",
        assigned_rm: "RM-103",
        trend: [30, 35, 44, 58, 70, 81],
        notes: ["Unresolved billing dispute ticket #8841 pending for over 48 hours."],
        behaviors: [
          { event: "Login", category: "Digital Activity", meta: { device: "Chrome macOS" } },
          { event: "Add to cart", category: "Commerce", meta: { item: "Annual Credit Card Upgrade", amount: 2500 } },
          { event: "Remove from cart", category: "Commerce", meta: { item: "Annual Credit Card Upgrade" } },
          { event: "Review", category: "Feedback", meta: { rating: 2, comment: "Support disconnected on hold" } }
        ]
      },
      {
        id: "AC-40225",
        name: "Kavita Pillai",
        email: "kavita.pillai@solarenergy.in",
        phone: "+91 97541 66778",
        city: "Chennai",
        age: 41,
        gender: "Female",
        occupation: "CFO & Partner",
        tier: "Business Banking",
        tenure: "3.8 yrs",
        signup_date: "2022-11-05",
        acquisition_source: "Corporate B2B Desk",
        device_type: "Windows 11 / Dell Latitude",
        browser: "Microsoft Edge",
        balance: 480000,
        savings: 180000,
        fixed_deposit: 300000,
        credit_limit: 1000000,
        active_loans: 1,
        risk: 92,
        risk_level: "Critical",
        confidence: 96,
        predicted_churn_window: "< 7 days",
        churn_rank: 0,
        binary_churn: 1,
        health_score: 16,
        health_status: "Critical",
        retention_opportunity_score: 91,
        recovery_status: "Offer Accepted",
        recovery_probability: 65,
        current_clv: 110000,
        predicted_12m_clv: 165000,
        revenue_at_risk: 151800,
        rfm_recency_days: 28,
        rfm_frequency_score: 2,
        rfm_monetary_score: 9,
        rfm_segment: "Can't Lose Them",
        transactions_per_month: 2,
        avg_order_value: 14000,
        login_frequency: 1,
        days_since_last_login: 28,
        avg_session_duration_min: 1.0,
        cart_abandonment_count: 6,
        subscription_status: "Pending Cancellation",
        support_tickets_count: 6,
        unresolved_complaints: 3,
        avg_resolution_time_hrs: 56.0,
        refund_count: 4,
        payment_failure_count: 5,
        sentiment_score: -0.92,
        latest_emotion: "Angry",
        preferred_channel: "Phone / RM Call",
        best_day: "Monday",
        best_time: "10:30 AM",
        message_fatigue_score: 84, // Severe Fatigue
        fatigue_status: "High Fatigue",
        channel_engagement: { email_opens: 2, sms_opens: 1, direct_call_answers: 88 },
        segment: "Lost",
        early_warning_stage: "Critical",
        driver: "Severe support escalation & Repeated payment failures",
        secondary: ["3 unresolved complaints", "5 consecutive gateway failures", "Login frequency dropped 90%"],
        action: "Immediate Executive RM Emergency Visit & 100% Fee Refund",
        next_best_action: "Executive RM Emergency Visit + 100% Fee Refund + 2-Month Free API Access",
        recommended_product: "Enterprise High-Speed Dedicated Payment Gateway",
        recommended_content: "Corporate Multi-Bank Redundancy Playbook",
        expected_retention_prob: 65,
        expected_revenue_saved: 82000,
        uplift_treatment_effect: 38,
        competitor_intent_detected: true,
        switching_intent_phrases: ["Closing corporate banking mandate", "Legal escalation for ERP webhook downtime"],
        digital_twin: {
          churn_velocity: "Critical Outflow Risk",
          urgency: "Immediate 24h Escalation Required"
        },
        is_anomaly: false,
        anomaly_reason: null,
        anomaly_score: 16,
        status: "Queued",
        assigned_rm: "RM-102",
        trend: [48, 56, 68, 79, 87, 92],
        notes: ["Client threatened legal escalation regarding ERP payment webhook failures on ticket #9204."],
        behaviors: [
          { event: "Cancellation", category: "Account", meta: { service: "Corporate Webhook Gateway" } },
          { event: "Support request", category: "Escalation", meta: { priority: "P1 Urgent", ticket_id: "TICK-9204" } }
        ]
      },
      {
        id: "AC-40224",
        name: "Arjun Singhania",
        email: "arjun@singhaniagroup.com",
        phone: "+91 98199 88776",
        city: "Mumbai",
        age: 52,
        gender: "Male",
        occupation: "Managing Director",
        tier: "Private Banking",
        tenure: "8.4 yrs",
        signup_date: "2018-02-10",
        acquisition_source: "Managing Director Network",
        device_type: "iPad Pro / iOS",
        browser: "Safari",
        balance: 1480000,
        savings: 880000,
        fixed_deposit: 600000,
        credit_limit: 2000000,
        active_loans: 0,
        risk: 28,
        risk_level: "Low",
        confidence: 95,
        predicted_churn_window: "Low risk",
        churn_rank: 10,
        binary_churn: 0,
        health_score: 94,
        health_status: "Healthy",
        retention_opportunity_score: 45, // Healthy client, no urgent intervention required
        recovery_status: "Fully Recovered",
        recovery_probability: 98,
        current_clv: 380000,
        predicted_12m_clv: 520000,
        revenue_at_risk: 41440,
        rfm_recency_days: 1,
        rfm_frequency_score: 10,
        rfm_monetary_score: 10,
        rfm_segment: "Champions",
        transactions_per_month: 28,
        avg_order_value: 65000,
        login_frequency: 24,
        days_since_last_login: 1,
        avg_session_duration_min: 12.0,
        cart_abandonment_count: 0,
        subscription_status: "Active",
        support_tickets_count: 1,
        unresolved_complaints: 0,
        avg_resolution_time_hrs: 1.5,
        refund_count: 0,
        payment_failure_count: 0,
        sentiment_score: 0.94,
        latest_emotion: "Satisfied",
        preferred_channel: "WhatsApp",
        best_day: "Saturday",
        best_time: "11:00 AM",
        message_fatigue_score: 14,
        fatigue_status: "Normal",
        channel_engagement: { email_opens: 65, sms_opens: 40, whatsapp_opens: 98 },
        segment: "Loyal",
        early_warning_stage: "Normal",
        driver: "Stable high-balance portfolio",
        secondary: ["Regular wealth advisory meetings"],
        action: "Send anniversary appreciation & invite to private banking golf summit",
        next_best_action: "Invitational Private Equity Syndicate Access",
        recommended_product: "Offshore Global Wealth Real Estate Fund",
        recommended_content: "H1 2026 Sovereign Bond Outlook",
        expected_retention_prob: 98,
        expected_revenue_saved: 140000,
        uplift_treatment_effect: 8,
        competitor_intent_detected: false,
        switching_intent_phrases: [],
        digital_twin: {
          client_type: "Anchor Relationship",
          cross_sell_capacity: "High (₹50L+ Liquid)"
        },
        is_anomaly: false,
        anomaly_reason: null,
        anomaly_score: 1,
        status: "New",
        assigned_rm: "RM-101",
        trend: [22, 24, 25, 26, 27, 28],
        notes: ["Key relationship anchor client. Highly satisfied."],
        behaviors: [
          { event: "Login", category: "Digital Activity", meta: { device: "iPad Pro" } },
          { event: "Purchase", category: "Wealth", meta: { item: "3-Year Fixed Return Bond", amount: 250000 } }
        ]
      },
      {
        id: "AC-40226",
        name: "Nikhil Bansal",
        email: "nikhil.b@fintechloop.co",
        phone: "+91 99301 22881",
        city: "Chandigarh",
        age: 28,
        gender: "Male",
        occupation: "Growth Marketer",
        tier: "Retail — Standard",
        tenure: "1.1 yrs",
        signup_date: "2025-05-10",
        acquisition_source: "Paid Social Ads",
        device_type: "Android / OnePlus 12",
        browser: "Chrome Mobile",
        balance: 18200,
        savings: 18200,
        fixed_deposit: 0,
        credit_limit: 40000,
        active_loans: 0,
        risk: 84,
        risk_level: "High",
        confidence: 89,
        predicted_churn_window: "7–14 days",
        churn_rank: 8,
        binary_churn: 1,
        health_score: 22,
        health_status: "Critical",
        retention_opportunity_score: 18, // LOW OPPORTUNITY: Suspicious refunds, not worth expensive discount!
        recovery_status: "Unreached",
        recovery_probability: 32,
        current_clv: 8500,
        predicted_12m_clv: 16200,
        revenue_at_risk: 13600,
        rfm_recency_days: 19,
        rfm_frequency_score: 2,
        rfm_monetary_score: 3,
        rfm_segment: "Hibernating",
        transactions_per_month: 2,
        avg_order_value: 950,
        login_frequency: 2,
        days_since_last_login: 19,
        avg_session_duration_min: 1.5,
        cart_abandonment_count: 5,
        subscription_status: "Active",
        support_tickets_count: 2,
        unresolved_complaints: 1,
        avg_resolution_time_hrs: 32.0,
        refund_count: 7, // Suspicious
        payment_failure_count: 1,
        sentiment_score: -0.45,
        latest_emotion: "Frustrated",
        preferred_channel: "SMS",
        best_day: "Tuesday",
        best_time: "4:00 PM",
        message_fatigue_score: 42,
        fatigue_status: "Moderate",
        channel_engagement: { email_opens: 8, sms_opens: 48, push_opens: 10 },
        segment: "Dormant",
        early_warning_stage: "At-risk",
        driver: "High refund velocity & Inactivity",
        secondary: ["7 refund disputes in 30 days", "App session drop"],
        action: "Fraud Sentinel Audit before retention concession",
        next_best_action: "Fraud Sentinel Audit: Do NOT waste retention discounts on suspicious refunds",
        recommended_product: "UPI Smart Savings Account",
        recommended_content: "Dispute & Chargeback Verification Policy",
        expected_retention_prob: 32,
        expected_revenue_saved: 4200,
        uplift_treatment_effect: 3, // LOW UPLIFT - Example of customer who shouldn't receive expensive discount!
        competitor_intent_detected: false,
        switching_intent_phrases: [],
        digital_twin: {
          flag: "Suspicious Velocity",
          recommendation: "Withhold discounts; require manual verification"
        },
        is_anomaly: true,
        anomaly_reason: "Abnormal Refund Spike (7 refunds totaling ₹14,200 in 18 days)",
        anomaly_score: 88,
        status: "New",
        assigned_rm: "RM-104",
        trend: [35, 42, 53, 67, 76, 84],
        notes: ["Flagged by Fraud Sentinel: excessive refund disputes across 3 merchant terminals."],
        behaviors: [
          { event: "Refund", category: "Dispute", meta: { amount: 2400, merchant: "Merchant Terminal A" } },
          { event: "Refund", category: "Dispute", meta: { amount: 3100, merchant: "Merchant Terminal B" } }
        ]
      }
    ];

    for (const c of customers) {
      await client.query(
        `INSERT INTO customers (
          id, name, email, phone, city, age, gender, occupation, tier, tenure, signup_date,
          acquisition_source, device_type, browser, balance, savings, fixed_deposit, credit_limit, active_loans,
          risk, risk_level, confidence, predicted_churn_window, churn_rank, binary_churn,
          health_score, health_status, retention_opportunity_score, recovery_status, recovery_probability,
          current_clv, predicted_12m_clv, revenue_at_risk, rfm_recency_days, rfm_frequency_score, rfm_monetary_score, rfm_segment,
          transactions_per_month, avg_order_value, login_frequency, days_since_last_login, avg_session_duration_min,
          cart_abandonment_count, subscription_status, support_tickets_count, unresolved_complaints, avg_resolution_time_hrs,
          refund_count, payment_failure_count, sentiment_score, latest_emotion,
          preferred_channel, best_day, best_time, message_fatigue_score, fatigue_status, channel_engagement,
          segment, early_warning_stage, driver, secondary, action, next_best_action,
          recommended_product, recommended_content, expected_retention_prob, expected_revenue_saved, uplift_treatment_effect,
          competitor_intent_detected, switching_intent_phrases, digital_twin, is_anomaly, anomaly_reason, anomaly_score,
          status, assigned_rm, trend, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37,
          $38, $39, $40, $41, $42,
          $43, $44, $45, $46, $47,
          $48, $49, $50, $51,
          $52, $53, $54, $55, $56, $57,
          $58, $59, $60, $61, $62, $63,
          $64, $65, $66, $67, $68,
          $69, $70, $71, $72, $73, $74,
          $75, $76, $77, $78
        )`,
        [
          c.id, c.name, c.email, c.phone, c.city, c.age, c.gender, c.occupation, c.tier, c.tenure, c.signup_date,
          c.acquisition_source, c.device_type, c.browser, c.balance, c.savings, c.fixed_deposit, c.credit_limit, c.active_loans,
          c.risk, c.risk_level, c.confidence, c.predicted_churn_window, c.churn_rank, c.binary_churn,
          c.health_score, c.health_status, c.retention_opportunity_score, c.recovery_status, c.recovery_probability,
          c.current_clv, c.predicted_12m_clv, c.revenue_at_risk, c.rfm_recency_days, c.rfm_frequency_score, c.rfm_monetary_score, c.rfm_segment,
          c.transactions_per_month, c.avg_order_value, c.login_frequency, c.days_since_last_login, c.avg_session_duration_min,
          c.cart_abandonment_count, c.subscription_status, c.support_tickets_count, c.unresolved_complaints, c.avg_resolution_time_hrs,
          c.refund_count, c.payment_failure_count, c.sentiment_score, c.latest_emotion,
          c.preferred_channel, c.best_day, c.best_time, c.message_fatigue_score, c.fatigue_status, JSON.stringify(c.channel_engagement),
          c.segment, c.early_warning_stage, c.driver, JSON.stringify(c.secondary), c.action, c.next_best_action,
          c.recommended_product, c.recommended_content, c.expected_retention_prob, c.expected_revenue_saved, c.uplift_treatment_effect,
          c.competitor_intent_detected, JSON.stringify(c.switching_intent_phrases), JSON.stringify(c.digital_twin), c.is_anomaly, c.anomaly_reason, c.anomaly_score,
          c.status, c.assigned_rm, JSON.stringify(c.trend), JSON.stringify(c.notes)
        ]
      );

      // Seed Behavior Events
      if (c.behaviors && c.behaviors.length) {
        for (const b of c.behaviors) {
          await client.query(
            `INSERT INTO customer_behavior_events (customer_id, event_name, event_category, metadata)
             VALUES ($1, $2, $3, $4)`,
            [c.id, b.event, b.category, JSON.stringify(b.meta)]
          );
        }
      }

      // Seed Explainable AI
      await client.query(
        `INSERT INTO explainable_ai (customer_id, shap_factors, lime_weights, global_importance, primary_reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          c.id,
          JSON.stringify([
            { feature: "Purchase Frequency Drop", contribution: 32, direction: "positive", value: "-35%" },
            { feature: "Support Complaints Escalation", contribution: 24, direction: "positive", value: "2 unresolved" },
            { feature: "App Engagement Inactivity", contribution: 18, direction: "positive", value: "14 days inactive" },
            { feature: "Payment Gateway Failure", contribution: 15, direction: "positive", value: "2 declines" },
            { feature: "Subscription Near Expiry", contribution: 11, direction: "positive", value: "< 14 days" }
          ]),
          JSON.stringify({ intercept: 0.42, rules: [{ rule: "purchase_drop > 30%", weight: 0.35 }] }),
          JSON.stringify([
            { feature: "Purchase Frequency Drop", importance: 0.32 },
            { feature: "Support Complaints", importance: 0.24 },
            { feature: "App Engagement", importance: 0.18 },
            { feature: "Payment Failures", importance: 0.15 },
            { feature: "Subscription Expiry", importance: 0.11 }
          ]),
          c.driver
        ]
      );
    }

    // 4. Seed Automated Retention Journeys (Req 22)
    const journeys = [
      {
        id: "JRN-VIP-RESCUE",
        name: "High-Net-Worth VIP Churn Rescue Workflow",
        trigger_criteria: "Risk >= 80% AND Tier == 'Private Banking'",
        current_active_enrolled: 48,
        steps: [
          { step: 1, name: "Customer Signup & Activation", desc: "Welcome journey completed" },
          { step: 2, name: "Engagement Tracking", desc: "Monitored 24/7 for deposit outflow or rate shopping" },
          { step: 3, name: "Risk Detected", desc: "Churn risk exceeds 80% threshold" },
          { step: 4, name: "Predictive ML Window", desc: "Predicted churn period: 7–14 days" },
          { step: 5, name: "Recommended Next Best Action", desc: "20% Personalized Fee Waiver + Rate Parity" },
          { step: 6, name: "Send-Time Optimized Offer", desc: "WhatsApp at Friday 7:40 PM" },
          { step: 7, name: "Customer Response Log", desc: "Offer accepted via WhatsApp Concierge" },
          { step: 8, name: "Retention Measurement", desc: "Model evaluates recovery: 82% probability restored" }
        ],
        conversion_rate: 81.4
      },
      {
        id: "JRN-PREMIER-ONBOARD",
        name: "Retail Premier Inactivity Rescue",
        trigger_criteria: "Days since login > 14 AND Balance < ₹1,00,000",
        current_active_enrolled: 120,
        steps: [
          { step: 1, name: "Onboarding Inactivity Signal", desc: "No login in 14 days" },
          { step: 2, name: "Fatigue Check", desc: "Verify message fatigue score < 70" },
          { step: 3, name: "Automated Push Offer", desc: "₹500 UPI Cashback on first utility bill" },
          { step: 4, name: "Recovery Verification", desc: "Track transaction re-engagement" }
        ],
        conversion_rate: 68.2
      }
    ];

    for (const j of journeys) {
      await client.query(
        `INSERT INTO retention_journeys (id, name, trigger_criteria, current_active_enrolled, steps, conversion_rate)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [j.id, j.name, j.trigger_criteria, j.current_active_enrolled, JSON.stringify(j.steps), j.conversion_rate]
      );
    }

    // 5. Seed Closed-Loop Learning Records (Req 35)
    const feedbackRecords = [
      {
        customer_id: "AC-40217",
        predicted_churn_prob: 88,
        intervention_deployed: "20% Fee Waiver + 7.45% Deposit Rate Match",
        customer_response: "Accepted",
        actual_retention_outcome: "Retained",
        model_weight_correction: 0.014
      },
      {
        customer_id: "AC-40218",
        predicted_churn_prob: 81,
        intervention_deployed: "Annual Card Fee Waiver + In-App Offer",
        customer_response: "Accepted",
        actual_retention_outcome: "Retained",
        model_weight_correction: 0.011
      },
      {
        customer_id: "AC-40226",
        predicted_churn_prob: 84,
        intervention_deployed: "Withheld Concession (Fraud Sentinel Block)",
        customer_response: "Ignored",
        actual_retention_outcome: "Churned",
        model_weight_correction: -0.005
      }
    ];

    for (const fb of feedbackRecords) {
      await client.query(
        `INSERT INTO closed_loop_feedback (customer_id, predicted_churn_prob, intervention_deployed, customer_response, actual_retention_outcome, model_weight_correction)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [fb.customer_id, fb.predicted_churn_prob, fb.intervention_deployed, fb.customer_response, fb.actual_retention_outcome, fb.model_weight_correction]
      );
    }

    // 6. Seed Campaigns & A/B Tests
    await client.query(`
      INSERT INTO campaigns (id, title, target_segment, intervention, channel, status, targeted, contacted, responded, retained, churned, budget, cost_spent, revenue_saved, roi_pct)
      VALUES 
      ('CMP-2026-01', 'Q3 High-Yield FD Retention Sprint', 'High-value/high-risk', '20% Personalized Fee Waiver + 7.45% Deposit Rate Match', 'WhatsApp & Senior RM Concierge', 'Active', 340, 295, 242, 198, 44, 500000, 312000, 2840000, 810.2),
      ('CMP-2026-02', 'Premier Credit Card Fee Waiver Campaign', 'Price-sensitive', 'Annual Card Fee Waiver + 15% Bonus Reward Points', 'In-App & Push', 'Active', 850, 810, 560, 480, 80, 250000, 185000, 1240000, 570.3)
    `);

    await client.query(`
      INSERT INTO ab_tests (id, test_name, description, group_a_strategy, group_a_retained_pct, group_b_strategy, group_b_retained_pct, group_c_strategy, group_c_retained_pct, group_d_control_strategy, group_d_control_pct, winner, sample_size, status)
      VALUES (
        'AB-2026-A',
        'Q3 Retention Intervention 4-Arm Experiment',
        'Comparative study across 4 distinct retention treatments to determine optimal ROI and incremental lift.',
        'Group A: 10% Discount', 68.4,
        'Group B: Loyalty Reward Points', 74.8,
        'Group C: Priority RM Concierge Support', 82.6,
        'Group D: Control (No Intervention)', 41.2,
        'Group C: Priority RM Concierge Support', 2400,
        'Completed (Statistical Significance: 99.4%)'
      )
    `);

    // 7. Seed RAG Policies
    await client.query(`
      INSERT INTO rag_documents (title, category, content, tags)
      VALUES 
      ('Meridian Retention Concession Policy #RET-2026-v2', 'Retention Guidelines', 'Scope: Discretionary fee waivers and rate matching. Private Banking clients with balance > ₹5L and tenure > 3 years are eligible for 100% annual fee waiver and up to 25 bps deposit rate match. Strict Rule: Never offer retention discounts to accounts flagged with active Fraud Sentinel score > 70.', '["fee_waiver", "rate_matching", "discretionary_limits"]'::jsonb),
      ('Fixed Deposit Rate Match Parity Directive', 'Pricing', 'RMs may match competitor FD rates up to 7.45% p.a. on 12-month non-callable deposits for verified client assets > ₹2,50,000.', '["fd_rates", "competitor_parity"]'::jsonb),
      ('Message Fatigue & Communication Governance Policy', 'Communication Rules', 'Customers receiving > 10 messages across 7 days must be automatically throttled to 1 priority touchpoint per 10 days to avoid opt-outs.', '["message_fatigue", "send_time_optimization"]'::jsonb)
    `);

    // 8. Seed Model Monitoring
    await client.query(`
      INSERT INTO model_monitoring_logs (model_version, accuracy, precision_score, recall, f1_score, roc_auc, pr_auc, confusion_matrix, feature_drift_score, data_drift_status, prediction_drift_pct)
      VALUES (
        'v4.2-ensemble-xgboost-lightgbm',
        92.4, 89.1, 94.2, 91.6, 0.941, 0.915,
        '{"tp": 420, "fp": 38, "fn": 26, "tn": 516}'::jsonb,
        0.042, 'Nominal (No Drift Detected)', 1.8
      )
    `);

    // 9. Seed Audit Logs
    await client.query(`
      INSERT INTO audit_logs (user_name, user_role, action, resource, details, pii_accessed, ip_address)
      VALUES 
      ('Anshul', 'Head of Retention', 'LOGIN', 'AuthService', 'User authenticated via RBAC session', false, '127.0.0.1'),
      ('System Daemon', 'Closed-Loop Engine', 'MODEL_FEEDBACK', 'Ensemble v4.2', 'Outcome weights updated with 3 verified retention events', false, '127.0.0.1')
    `);

    console.log('[PostgreSQL Seed] Successfully seeded 37-feature schema with rich data!');
  } catch (err) {
    console.error('[PostgreSQL Seed] Error while seeding:', err);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
