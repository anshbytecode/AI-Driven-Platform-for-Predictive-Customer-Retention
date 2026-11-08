import { COLOR } from "../constants/theme";

export const toneColor = (tone) =>
  tone === "risk" ? COLOR.risk : tone === "mid" ? COLOR.mid : COLOR.stable;

export const getSegment = (risk, thresholds) =>
  risk >= thresholds.high ? "high" : risk >= thresholds.mid ? "medium" : "low";

export const segLabel = (s) =>
  s === "high" ? "High" : s === "medium" ? "Watch" : "Stable";

export const fmtINR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

export const fmtLakh = (n) => {
  const val = (n || 0) / 100000;
  return `₹${val.toFixed(1)} L`;
};

export function maskEmail(email, enabled = true) {
  if (!enabled || !email) return email || "";
  const parts = email.split("@");
  if (parts.length < 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

export function maskPhone(phone, enabled = true) {
  if (!enabled || !phone) return phone || "";
  return phone.replace(/(\+?\d{2,3}\s?\d{2})\d+(\d{4})/, "$1*****$2");
}

export function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function generateScript(customer, channel = "email") {
  if (!customer) return "";
  const firstName = customer.name.split(" ")[0];
  const rmName = customer.rm_name || "Priya Sharma";

  if (channel === "email") {
    return `Subject: Special Relationship Pricing & Portfolio Review for ${customer.name}

Dear ${firstName},

Thank you for being a valued ${customer.tier} client with Meridian Bank for over ${customer.tenure}.

We noticed your recent interest in higher-yield deposit options and premium features. As part of our priority retention commitment, I have personally unlocked an exclusive relationship rate review for your account (${customer.id}).

Key Offer Highlights:
• +0.45% bonus yield on Fixed Deposits above ₹1,00,000 (Guaranteed 7.45% p.a.)
• 100% annual fee waiver on your premier credit card
• Dedicated 24/7 Relationship Manager support line (${customer.rm_phone || '+91 98201 44102'})

Would you have 5 minutes this Thursday for a brief call to finalize this upgrade?

Warm regards,
${rmName}
Senior Relationship Manager | Meridian Private & Priority Banking`;
  }

  if (channel === "sms") {
    return `Hi ${firstName}, Meridian Bank is pleased to offer you an exclusive +0.45% bonus yield on Fixed Deposits & zero fee waiver on account ${customer.id}. Reply YES to speak with your RM ${rmName}. Opt-out reply STOP.`;
  }

  return `[RM CALL SCRIPT]
Caller: ${rmName} (${customer.rm_role || 'Senior RM'})
Customer: ${customer.name} (${customer.tier})
Account ID: ${customer.id} | Balance: ${fmtINR(customer.balance)}
Current Churn Risk: ${customer.risk}% (${customer.risk_level || 'High'})

1. GREETING & CONTEXT:
"Hello ${firstName}, this is ${rmName} from Meridian Priority Banking. I'm reaching out personally because you've been a key client with us for over ${customer.tenure}."

2. ADDRESS FLAG (${customer.driver}):
"We noticed recent activity regarding rate comparisons and fee charges on your account. I wanted to proactively ensure you are receiving our top tier rates and zero-fee benefits."

3. PRESENT INCENTIVE:
"I have authorization today to match your deposit yield up to 7.45% p.a., waive pending maintenance fees, and assign you priority concierge routing."

4. NEXT STEPS:
Log client feedback in Meridian Dashboard under ${customer.id}.`;
}
