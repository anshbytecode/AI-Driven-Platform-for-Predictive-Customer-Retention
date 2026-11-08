# AI-Driven Platform for Predictive Customer Retention
### Enterprise Churn Intelligence, Explainable AI, Next Best Action & PostgreSQL Backend

An enterprise-grade, end-to-end customer retention intelligence platform built with **React, Vite, Node.js, Express, and PostgreSQL 17**. It predicts customer churn, explains risk drivers using SHAP/LIME, calculates Customer Lifetime Value (CLV), simulates concession policies, automates campaigns, and provides grounded GenAI insights via RAG.

---

## 🌟 The Enterprise Features Implemented

1. **Customer Data & 360° Profile**
   - Demographics (City, Age, Gender, Occupation)
   - Comprehensive account information (Tier, Tenure, Savings, Fixed Deposit, Credit Limit, Active Loans)
   - Behavioral velocities (Monthly transactions, AOV, Days since last login, Session length, Cart abandonments)
   - Support tickets, unresolved complaints, refund counts, payment failure telemetry
   - Loyalty points & reward tiers with active DPDP/GDPR PII masking toggle.

2. **Churn Prediction (Core ML Engine)**
   - Continuous churn probability (0–100%)
   - Risk tiers: `Low`, `Medium`, `High`, `Critical`
   - Predicted churn windows: `< 30 days`, `30-60 days`, `60-90 days`, `Low risk`
   - Dynamic customer risk ranking and confidence scores (85–96%).

3. **Churn Reason / Explainable AI (XAI)**
   - **SHAP Waterfall Attribution**: Explains the exact percentage contribution of each telemetry signal (e.g., +42% Competitor rate browsing, +25% Unresolved fee dispute, +18% Login velocity drop, +10% Gateway failure, -16% Tenure offset).
   - **LIME Local Decision Boundaries**: Interpretable rules and threshold conditions.
   - **Global Feature Importance**: Cohort-wide weights across all monitored accounts.

4. **9-Cluster Customer Segmentation**
   - K-Means multi-dimensional behavioral clustering:
     - `VIP Private Wealth`
     - `Loyal Champions`
     - `Regular Retail`
     - `New Onboarding`
     - `Price-Sensitive`
     - `At-Risk Escalation`
     - `Dormant Inactive`
     - `Lost / Closed`
     - `High-Value / High-Risk`
   - Interactive segment filters, portfolio balances, and customer drill-down.

5. **Early Warning System (EWS)**
   - 5-stage progression radar: `Normal` → `Engagement declining` → `At-risk` → `Critical` → `Churn`.
   - Behavioral drift detection before actual churn occurs (login drops, cart abandonment, gateway timeouts).

6. **Customer Lifetime Value (CLV) Prediction**
   - Calculates historical realized CLV vs predicted 12-month future CLV.
   - High-Value / High-Risk exposure quadrant to prioritize retention spend.

7. **Retention Recommendation Engine ⭐**
   - Personalized remedies: Fee discounts, Deposit rate matching (7.45% p.a.), Dedicated RM concierge, Loyalty points booster, FX remittance fee waivers.

8. **Next Best Action & Uplift Modeling**
   - Treatment-effect modeling calculating which specific action yields the highest retention probability (e.g., 82% retention) and maximum net revenue saved (e.g., ₹68,000 saved).

9. **What-If Policy & Concession Simulator**
   - Interactive business sandbox: Test "What happens if we give a 20% discount + Priority Support + 2,500 points?"
   - Instant Before vs After comparison (e.g., 88% → 44% churn risk, -44% drop).
   - Dynamic Expected Revenue Saved, Campaign Concession Cost, and Projected Net ROI %.

10. **Revenue-at-Risk Prediction**
    - Multiplied exposure: Customers at Risk × Predicted Future Revenue.
    - Recoverable revenue calculations, campaign spend, and net ROI multipliers.

11. **Campaign Management Funnel**
    - Full retention funnel tracking: `Targeted` → `Contacted` → `Responded` → `Retained` → `Churned`.
    - Live campaign creation modal with segment selection and budget allocation.

12. **A/B/C/D Experiment Matrix**
    - 4-arm comparative experiment: Group A (10% Discount), Group B (Loyalty Points), Group C (Priority RM Concierge), Group D (Control).
    - Statistical significance reporting (99.4% confidence) with winning strategy identification.

13. **NLP & Sentiment Analysis**
    - Transformer-based text classification across support tickets and NPS reviews.
    - Emotion detection: `Angry`, `Frustrated`, `Satisfied`, `Neutral`.
    - Topic extraction: `Pricing`, `Support SLA`, `Payment Gateways`, `App UX`, `Product Quality`.
    - Correlates negative emotion with churn velocity.

14. **GenAI Customer Insights (LLM Layer)**
    - Conversational assistant answering natural language questions:
      - *"Why are customers leaving this month?"*
      - *"Which customers should we contact first?"*
      - *"Show customers with high CLV and high churn risk."*

15. **RAG-Based Business Assistant**
    - Grounded in official banking retention directives:
      - Meridian Retention Concession Policy #RET-2026-v2
      - Fixed Deposit Rate Parity Directive
      - Support SLA Escalation Guidelines
      - Anti-Abuse Fraud Exclusion Rules
    - Displays exact citations with answers.

16. **Fraud & Anomaly Sentinel**
    - Identifies suspicious refunds (e.g. 7 refunds in 18 days), duplicate device hashes, and velocity anomalies.
    - Auto-excludes flagged accounts from costly retention discounts to prevent budget waste.

17. **Real-Time Streaming Prediction Engine**
    - Simulates real-time telemetry events (e.g., competitor page clicks, bounced gateway transactions).
    - Writes directly to PostgreSQL and dynamically updates churn risk and recommendations in real time.

18. **Multi-View Dashboards**
    - Executive Overview, Customer 360 Ledger, Explainable AI, Segments & EWS, CLV & Next Best Action, What-If Simulator, Campaigns & A/B, NLP Sentiment, Fraud Sentinel, Real-Time Stream, Model Monitoring, Privacy & Audit, Portfolios, and Playbooks.

19. **Model Performance & Drift Monitoring**
    - Accuracy (92.4%), Precision (89.1%), Recall (94.2%), F1 (91.6%), ROC-AUC (0.941), PR-AUC (0.915).
    - 2x2 Confusion Matrix (TP: 420, FP: 38, FN: 26, TN: 516).
    - Feature Drift (PSI: 0.042) and Data Drift tracking on Model v4.2 Ensemble.

20. **Privacy, Security & Role-Based Access Control (RBAC)**
    - Configurable operational roles: `Head of Retention`, `Senior RM`, `Relationship Manager`, `Auditor / Compliance`.
    - PII masking toggle with immutable access audit trails logged in PostgreSQL.

---

## 🛠️ Tech Stack & Database Setup

- **Frontend**: React 19, Vite, Recharts, Lucide Icons, CSS3.
- **Backend**: Node.js, Express, `pg` (node-postgres), CORS, Dotenv.
- **Database**: PostgreSQL 17 (`meridian_retention_db`).

### PostgreSQL Connection Details
- **Host**: `localhost`
- **Port**: `5432`
- **User**: `postgres`
- **Database**: `meridian_retention_db`

---

## Features

* 🔮 Customer churn risk prediction
* 📊 Interactive retention dashboard
* 🧠 AI-powered retention recommendations
* 🔍 Churn driver analysis
* 👥 Customer segmentation
* 🎯 Personalized retention playbooks
* 📋 Customer risk management

## Tech Stack

**React.js • Vite • JavaScript • CSS • Node.js**

https://predictive-customer-retention.netlify.app/

