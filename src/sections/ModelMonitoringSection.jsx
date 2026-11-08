import { useState } from "react";
import { LineChart, CheckCircle2, AlertTriangle, ShieldCheck, Activity, RefreshCw } from "lucide-react";
import { COLOR } from "../constants/theme";

export default function ModelMonitoringSection() {
  const metrics = {
    version: "v4.2-ensemble-xgboost-lightgbm",
    lastRetrained: "August 3, 2026",
    accuracy: "92.4%",
    precision: "89.1%",
    recall: "94.2%",
    f1: "91.6%",
    rocAuc: "0.941",
    prAuc: "0.915",
    confusionMatrix: {
      tp: 420, // True Positives: Predicted Churn & Actually Churned
      fp: 38,  // False Positives: Predicted Churn but Retained
      fn: 26,  // False Negatives: Predicted Retained but Churned
      tn: 516  // True Negatives: Predicted Retained & Retained
    },
    featureDrift: [
      { feature: "competitor_page_views", psi: 0.042, status: "Nominal (< 0.1)" },
      { feature: "login_frequency_drop", psi: 0.038, status: "Nominal (< 0.1)" },
      { feature: "payment_failure_count", psi: 0.051, status: "Nominal (< 0.1)" },
      { feature: "unresolved_tickets_48h", psi: 0.062, status: "Nominal (< 0.1)" }
    ]
  };

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <div style={{ fontFamily: "Fraunces", fontSize: 24, color: COLOR.ink, fontWeight: 600 }}>
          Production ML Model Monitoring & Drift Watch
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkSoft, marginTop: 4 }}>
          Continuous performance evaluation, ROC-AUC calibration, confusion matrix metrics, and Population Stability Index (PSI) drift monitoring.
        </div>
      </div>

      {/* Model Metadata Banner */}
      <div style={{ background: COLOR.panel, color: "#fff", borderRadius: 8, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: COLOR.brassLight, fontWeight: 700, textTransform: "uppercase" }}>Active Model Registry</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F3F1E9", marginTop: 2 }}>{metrics.version}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Last Automated Retraining: {metrics.lastRetrained}</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ padding: "8px 14px", background: COLOR.panelSoft, borderRadius: 6, border: `1px solid ${COLOR.hairDark}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>DATA DRIFT</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4ADE80", marginTop: 2 }}>Nominal (No Drift)</div>
          </div>
          <div style={{ padding: "8px 14px", background: COLOR.panelSoft, borderRadius: 6, border: `1px solid ${COLOR.hairDark}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>PREDICTION DRIFT</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: COLOR.brassLight, marginTop: 2 }}>1.8% (Healthy)</div>
          </div>
        </div>
      </div>

      {/* Primary Classification Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {[
          { label: "Accuracy", val: metrics.accuracy, desc: "Overall correctness" },
          { label: "Precision", val: metrics.precision, desc: "Churn prediction purity" },
          { label: "Recall (Sensitivity)", val: metrics.recall, desc: "At-risk accounts caught", highlight: true },
          { label: "F1 Score", val: metrics.f1, desc: "Harmonic mean" },
          { label: "ROC-AUC", val: metrics.rocAuc, desc: "Discrimination threshold", highlight: true },
          { label: "PR-AUC", val: metrics.prAuc, desc: "Precision-recall curve" }
        ].map(m => (
          <div key={m.label} style={{ background: "#fff", border: `1px solid ${m.highlight ? COLOR.brass : COLOR.hair}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10.5, color: COLOR.inkSoft, fontWeight: 700, textTransform: "uppercase" }}>{m.label}</div>
            <div style={{ fontFamily: "Fraunces", fontSize: 22, fontWeight: 700, color: m.highlight ? COLOR.brass : COLOR.ink, marginTop: 4 }}>
              {m.val}
            </div>
            <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Confusion Matrix & Feature Drift Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 18 }}>
        {/* 2x2 Confusion Matrix */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
            Model Confusion Matrix (Evaluated on 1,000 Validation Cases)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 8, textAlign: "center", fontSize: 11.5 }}>
            <div></div>
            <div style={{ fontWeight: 700, color: COLOR.inkSoft, paddingBottom: 6 }}>Predicted Churn</div>
            <div style={{ fontWeight: 700, color: COLOR.inkSoft, paddingBottom: 6 }}>Predicted Retain</div>

            <div style={{ fontWeight: 700, color: COLOR.inkSoft, display: "grid", placeItems: "center" }}>
              Actual Churn
            </div>
            <div style={{ padding: "16px 12px", background: "rgba(62,107,82,.1)", border: `1.5px solid ${COLOR.stable}`, borderRadius: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.stable }}>{metrics.confusionMatrix.tp}</div>
              <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>True Positive (Hit)</div>
            </div>
            <div style={{ padding: "16px 12px", background: "rgba(178,58,50,.08)", border: `1px solid rgba(178,58,50,.2)`, borderRadius: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.risk }}>{metrics.confusionMatrix.fn}</div>
              <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>False Negative (Miss)</div>
            </div>

            <div style={{ fontWeight: 700, color: COLOR.inkSoft, display: "grid", placeItems: "center" }}>
              Actual Retain
            </div>
            <div style={{ padding: "16px 12px", background: "rgba(245,124,0,.08)", border: `1px solid rgba(245,124,0,.2)`, borderRadius: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#C05621" }}>{metrics.confusionMatrix.fp}</div>
              <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>False Positive (Alarm)</div>
            </div>
            <div style={{ padding: "16px 12px", background: "rgba(62,107,82,.1)", border: `1.5px solid ${COLOR.stable}`, borderRadius: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLOR.stable }}>{metrics.confusionMatrix.tn}</div>
              <div style={{ fontSize: 10, color: COLOR.inkSoft, marginTop: 2 }}>True Negative (Correct)</div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 11, color: COLOR.inkSoft, lineHeight: 1.4 }}>
            💡 High <b>Recall (94.2%)</b> ensures virtually zero churned accounts slip through unnoticed without alert triggers.
          </div>
        </div>

        {/* Population Stability Index (PSI) Feature Drift */}
        <div style={{ background: "#fff", border: `1px solid ${COLOR.hair}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: COLOR.ink, marginBottom: 14 }}>
            Feature Drift Tracking (Population Stability Index - PSI)
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {metrics.featureDrift.map(fd => (
              <div key={fd.feature} style={{ padding: "12px 14px", background: COLOR.paperRaised, borderRadius: 6, border: `1px solid ${COLOR.hair}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <code style={{ fontSize: 12, fontWeight: 600, color: COLOR.ink }}>{fd.feature}</code>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLOR.stable }}>
                    PSI: {fd.psi} ({fd.status})
                  </span>
                </div>
                <div style={{ width: "100%", height: 6, background: COLOR.paper, borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ width: `${fd.psi * 800}%`, height: "100%", background: COLOR.stable, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(62,107,82,.08)", border: `1px solid rgba(62,107,82,.2)`, borderRadius: 6, fontSize: 11, color: COLOR.stable }}>
            ✓ All feature distributions remain well below the 0.1 PSI threshold. No dataset shift detected.
          </div>
        </div>
      </div>
    </div>
  );
}

