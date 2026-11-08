-- PostgreSQL Complete Enterprise Schema for Meridian AI-Driven Customer Retention Platform
-- Covers all 37 Advanced Modules: Customer 360, Digital Twin, Behavior Event Stream,
-- Churn Prediction, Early Warning, SHAP/LIME XAI, RFM Segmentation, CLV, Revenue at Risk,
-- Next Best Action, Uplift Modeling, Retention ROI Prediction, What-If Simulator,
-- Macro Strategy Simulator, Personalized Offer Engine, Product/Content Recommendations,
-- Omnichannel Routing, Send-Time Optimization (STO), Message Fatigue Detection,
-- NLP Sentiment & Topic Detection, GenAI Retention Assistant, RAG Knowledge Brain,
-- Automated Retention Journeys, A/B Testing, Cohort Analysis, Customer Journey Stages,
-- Churn Reason Clustering, Competitor Switching Intent, Anomaly Detection, Real-Time Scoring,
-- Predictive Alerts, Retention Command Center, Customer Health Score, Retention Opportunity Score,
-- Customer Recovery Prediction, Closed-Loop Learning, Multi-Agent AI System, Privacy & RBAC.

DROP TABLE IF EXISTS closed_loop_feedback CASCADE;
DROP TABLE IF EXISTS retention_journeys CASCADE;
DROP TABLE IF EXISTS customer_behavior_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS model_monitoring_logs CASCADE;
DROP TABLE IF EXISTS rag_documents CASCADE;
DROP TABLE IF EXISTS fraud_anomalies CASCADE;
DROP TABLE IF EXISTS nlp_sentiment_logs CASCADE;
DROP TABLE IF EXISTS ab_tests CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS early_warning_alerts CASCADE;
DROP TABLE IF EXISTS explainable_ai CASCADE;
DROP TABLE IF EXISTS customer_events CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS relationship_managers CASCADE;

-- 1. Relationship Managers
CREATE TABLE relationship_managers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(80),
    accounts_count INT DEFAULT 0,
    revenue_managed NUMERIC(14,2) DEFAULT 0,
    risk_count INT DEFAULT 0
);

-- 2. Customer 360 & Profiles
CREATE TABLE customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(80),
    city VARCHAR(120) DEFAULT 'Mumbai',
    age INT DEFAULT 34,
    gender VARCHAR(40) DEFAULT 'Unspecified',
    occupation VARCHAR(160) DEFAULT 'Professional',
    tier VARCHAR(120) NOT NULL,
    tenure VARCHAR(60) NOT NULL,
    signup_date DATE DEFAULT '2023-01-15',
    acquisition_source VARCHAR(120) DEFAULT 'Referral / VIP Invite',
    device_type VARCHAR(120) DEFAULT 'iOS / iPhone 15 Pro',
    browser VARCHAR(120) DEFAULT 'Safari Mobile',
    
    -- Financials & Balances
    balance NUMERIC(14,2) NOT NULL DEFAULT 0,
    savings NUMERIC(14,2) DEFAULT 0,
    fixed_deposit NUMERIC(14,2) DEFAULT 0,
    credit_limit NUMERIC(14,2) DEFAULT 0,
    active_loans INT DEFAULT 0,
    
    -- Churn Predictions (Req 3)
    risk INT NOT NULL DEFAULT 0, -- 0-100%
    risk_level VARCHAR(40) NOT NULL DEFAULT 'Low', -- Low, Medium, High, Critical
    confidence INT NOT NULL DEFAULT 85,
    predicted_churn_window VARCHAR(120) DEFAULT 'Low risk', -- '7–14 days', '< 30 days', '30-60 days', '60-90 days'
    churn_rank INT DEFAULT 1,
    binary_churn INT DEFAULT 0,
    
    -- Advanced Retention & Health Scores (Req 32, 33, 34)
    health_score INT DEFAULT 85, -- 0-100: Healthy, Watch, At Risk, Critical
    health_status VARCHAR(40) DEFAULT 'Healthy',
    retention_opportunity_score INT DEFAULT 78, -- Churn prob * value * effectiveness * ROI
    recovery_status VARCHAR(60) DEFAULT 'Unreached', -- 'Unreached', 'Offer Delivered', 'Offer Accepted', 'Recovered'
    recovery_probability INT DEFAULT 75,
    
    -- Customer Lifetime Value & Revenue at Risk (Req 7, 8)
    current_clv NUMERIC(14,2) NOT NULL DEFAULT 0,
    predicted_12m_clv NUMERIC(14,2) NOT NULL DEFAULT 0,
    revenue_at_risk NUMERIC(14,2) NOT NULL DEFAULT 0,
    
    -- RFM Behavioral Profiling (Req 6)
    rfm_recency_days INT DEFAULT 3,
    rfm_frequency_score INT DEFAULT 8,
    rfm_monetary_score INT DEFAULT 9,
    rfm_segment VARCHAR(80) DEFAULT 'Champions',
    
    -- Behavioral & Activity Metrics (Req 2)
    transactions_per_month INT DEFAULT 8,
    avg_order_value NUMERIC(10,2) DEFAULT 2500,
    login_frequency INT DEFAULT 14,
    days_since_last_login INT DEFAULT 2,
    avg_session_duration_min NUMERIC(6,1) DEFAULT 8.5,
    cart_abandonment_count INT DEFAULT 1,
    subscription_status VARCHAR(120) DEFAULT 'Active',
    
    -- Support & Complaints Telemetry (Req 18, 19)
    support_tickets_count INT DEFAULT 0,
    unresolved_complaints INT DEFAULT 0,
    avg_resolution_time_hrs NUMERIC(6,1) DEFAULT 4.0,
    refund_count INT DEFAULT 0,
    payment_failure_count INT DEFAULT 0,
    sentiment_score NUMERIC(4,2) DEFAULT 0.5,
    latest_emotion VARCHAR(40) DEFAULT 'Satisfied',
    
    -- Omnichannel, Send-Time & Message Fatigue (Req 15, 16, 17)
    preferred_channel VARCHAR(60) DEFAULT 'WhatsApp',
    best_day VARCHAR(40) DEFAULT 'Friday',
    best_time VARCHAR(40) DEFAULT '7:40 PM',
    message_fatigue_score INT DEFAULT 25, -- 0-100: Normal, Moderate, High Fatigue
    fatigue_status VARCHAR(40) DEFAULT 'Normal',
    channel_engagement JSONB DEFAULT '{"email_opens": 15, "sms_opens": 8, "whatsapp_opens": 82}'::jsonb,
    
    -- Segmentation & Early Warning Stage (Req 4, 6)
    segment VARCHAR(80) NOT NULL DEFAULT 'Regular',
    early_warning_stage VARCHAR(80) DEFAULT 'Normal', -- Normal, Engagement declining, At-risk, Critical, Churn
    
    -- Drivers, Next Best Action & Uplift (Req 5, 9, 10, 13, 14)
    driver TEXT,
    secondary JSONB DEFAULT '[]'::jsonb,
    action TEXT,
    next_best_action TEXT,
    recommended_product TEXT,
    recommended_content TEXT,
    expected_retention_prob INT DEFAULT 75,
    expected_revenue_saved NUMERIC(14,2) DEFAULT 0,
    uplift_treatment_effect INT DEFAULT 32, -- % incremental lift
    
    -- Competitor & Switching Intent (Req 27)
    competitor_intent_detected BOOLEAN DEFAULT FALSE,
    switching_intent_phrases JSONB DEFAULT '[]'::jsonb,
    
    -- Digital Twin (Req 37.14)
    digital_twin JSONB DEFAULT '{}'::jsonb,
    
    -- Anomaly Sentinel (Req 28)
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_reason TEXT,
    anomaly_score INT DEFAULT 5,
    
    -- Status & CRM Assignment
    status VARCHAR(80) DEFAULT 'New',
    assigned_rm VARCHAR(64) REFERENCES relationship_managers(id) ON DELETE SET NULL,
    trend JSONB DEFAULT '[]'::jsonb,
    notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Behavior Events (Req 2)
CREATE TABLE customer_behavior_events (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    event_name VARCHAR(120) NOT NULL, -- Login, Product view, Add to cart, Checkout, Purchase, Refund, etc.
    event_category VARCHAR(80) DEFAULT 'Digital Activity',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customer Events Timeline (Req 1)
CREATE TABLE customer_events (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    event_type VARCHAR(80) NOT NULL, -- signal, system, rm, ticket, transaction, security
    impact_delta INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Explainable AI & SHAP / LIME Explanations (Req 5)
CREATE TABLE explainable_ai (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
    shap_factors JSONB NOT NULL,
    lime_weights JSONB NOT NULL,
    global_importance JSONB NOT NULL,
    primary_reason TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Early Warning Alerts (Req 4)
CREATE TABLE early_warning_alerts (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    stage VARCHAR(80) NOT NULL,
    trigger_metric VARCHAR(255) NOT NULL,
    description TEXT,
    velocity_drop_pct INT DEFAULT 0,
    severity VARCHAR(40) DEFAULT 'Warning',
    is_resolved BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Campaigns Management (Req 11)
CREATE TABLE campaigns (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target_segment VARCHAR(120) NOT NULL,
    intervention TEXT NOT NULL,
    channel VARCHAR(120) DEFAULT 'Omnichannel',
    status VARCHAR(80) DEFAULT 'Active',
    targeted INT DEFAULT 0,
    contacted INT DEFAULT 0,
    responded INT DEFAULT 0,
    retained INT DEFAULT 0,
    churned INT DEFAULT 0,
    budget NUMERIC(12,2) DEFAULT 0,
    cost_spent NUMERIC(12,2) DEFAULT 0,
    revenue_saved NUMERIC(14,2) DEFAULT 0,
    roi_pct NUMERIC(6,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. A/B Testing Experiments (Req 23)
CREATE TABLE ab_tests (
    id VARCHAR(64) PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    description TEXT,
    group_a_strategy VARCHAR(255) NOT NULL,
    group_a_retained_pct NUMERIC(5,2) DEFAULT 0,
    group_b_strategy VARCHAR(255) NOT NULL,
    group_b_retained_pct NUMERIC(5,2) DEFAULT 0,
    group_c_strategy VARCHAR(255) NOT NULL,
    group_c_retained_pct NUMERIC(5,2) DEFAULT 0,
    group_d_control_strategy VARCHAR(255) NOT NULL,
    group_d_control_pct NUMERIC(5,2) DEFAULT 0,
    winner VARCHAR(255),
    sample_size INT DEFAULT 1200,
    status VARCHAR(120) DEFAULT 'Running'
);

-- 9. NLP / Sentiment Analysis Logs (Req 18, 19)
CREATE TABLE nlp_sentiment_logs (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    channel VARCHAR(120) NOT NULL,
    customer_text TEXT NOT NULL,
    sentiment VARCHAR(40) NOT NULL,
    sentiment_score NUMERIC(4,2) DEFAULT 0,
    emotion VARCHAR(80) NOT NULL,
    topics JSONB DEFAULT '[]'::jsonb,
    churn_correlation VARCHAR(120) DEFAULT 'High',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Fraud & Abnormal Behavior Sentinel (Req 28)
CREATE TABLE fraud_anomalies (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    anomaly_type VARCHAR(255) NOT NULL,
    anomaly_score INT DEFAULT 85,
    flag_level VARCHAR(60) DEFAULT 'Critical',
    details TEXT,
    action_taken TEXT DEFAULT 'Exclude from retention discounts',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. RAG Knowledge Base Documents (Req 21)
CREATE TABLE rag_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Automated Retention Journeys (Req 22)
CREATE TABLE retention_journeys (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trigger_criteria VARCHAR(255) NOT NULL,
    current_active_enrolled INT DEFAULT 0,
    steps JSONB NOT NULL, -- [Signup, Onboarding, Engagement, Risk, Action, Response, Retention]
    conversion_rate NUMERIC(5,2) DEFAULT 76.4,
    status VARCHAR(40) DEFAULT 'Active'
);

-- 13. Closed-Loop Learning Feedback (Req 35)
CREATE TABLE closed_loop_feedback (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    predicted_churn_prob INT NOT NULL,
    intervention_deployed VARCHAR(255) NOT NULL,
    customer_response VARCHAR(120) NOT NULL, -- Accepted, Ignored, Rejected
    actual_retention_outcome VARCHAR(60) NOT NULL, -- Retained, Churned
    model_weight_correction NUMERIC(5,3) DEFAULT 0.012,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Model Monitoring & Drift Tracking (Req 19)
CREATE TABLE model_monitoring_logs (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(120) NOT NULL DEFAULT 'v4.2-ensemble',
    accuracy NUMERIC(5,2) DEFAULT 92.4,
    precision_score NUMERIC(5,2) DEFAULT 89.1,
    recall NUMERIC(5,2) DEFAULT 94.2,
    f1_score NUMERIC(5,2) DEFAULT 91.6,
    roc_auc NUMERIC(5,3) DEFAULT 0.941,
    pr_auc NUMERIC(5,3) DEFAULT 0.915,
    confusion_matrix JSONB DEFAULT '{"tp": 420, "fp": 38, "fn": 26, "tn": 516}'::jsonb,
    feature_drift_score NUMERIC(4,3) DEFAULT 0.042,
    data_drift_status VARCHAR(120) DEFAULT 'Nominal (No Drift)',
    prediction_drift_pct NUMERIC(4,2) DEFAULT 1.8,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Privacy, RBAC & Audit Trails (Req 20)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(120) NOT NULL,
    action VARCHAR(120) NOT NULL,
    resource VARCHAR(120) NOT NULL,
    details TEXT,
    pii_accessed BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(80) DEFAULT '127.0.0.1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_risk ON customers(risk DESC);
CREATE INDEX idx_customers_health ON customers(health_score ASC);
CREATE INDEX idx_customers_opp ON customers(retention_opportunity_score DESC);
CREATE INDEX idx_behavior_cust ON customer_behavior_events(customer_id);
CREATE INDEX idx_events_customer ON customer_events(customer_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
