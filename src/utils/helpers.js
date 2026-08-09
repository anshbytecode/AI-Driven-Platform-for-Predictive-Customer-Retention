import { COLOR } from "../constants/theme";

export const toneColor = (tone) =>
  tone === "risk" ? COLOR.risk : tone === "mid" ? COLOR.mid : COLOR.stable;

export const getSegment = (risk, thresholds) =>
  risk >= thresholds.high ? "high" : risk >= thresholds.mid ? "medium" : "low";

export const segLabel = (s) =>
  s === "high" ? "High" : s === "medium" ? "Watch" : "Stable";

export const fmtINR = (n) => "₹" + (n || 0).toLocaleString("en-IN");

export function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function generateScript(customer, channel = "email") {
  if (!customer) return "";
  const firstName = customer.name.split(" ")[0];
  const rmName = "Priya Sharma";

  if (channel === "email") {
    return `Subject: Special Relationship Pricing & Portfolio Review for ${customer.name}

Dear ${firstName},

Thank you for being a valued ${customer.tier} client with Meridian Bank for over ${customer.tenure}.

We noticed your recent interest in higher-yield deposit options and premium features. As part of our priority retention commitment, I have personally unlocked a exclusive relationship rate review for your account (${customer.id}).

Key Offer Highlights:
• +0.45% bonus yield on Fixed Deposits above ₹1,00,000
• 100% annual fee waiver on your premier credit card
• Dedicated 24/7 Relationship Manager support line

Would you have 5 minutes this Thursday for a brief call to finalize this upgrade?

Warm regards,
${rmName}
Senior Relationship Manager | Meridian Private & Priority Banking`;
  }

  if (channel === "sms") {
    return `Hi ${firstName}, Meridian Bank is pleased to offer you an exclusive +0.45% bonus yield on Fixed Deposits & zero fee waiver on account ${customer.id}. Reply YES to speak with your RM ${rmName}. Opt-out reply STOP.`;
  }

  return `[RM CALL SCRIPT]
Caller: ${rmName} (Senior RM)
Customer: ${customer.name} (${customer.tier})
Account ID: ${customer.id} | Balance: ${fmtINR(customer.balance)}

1. GREETING & CONTEXT:
"Hello ${firstName}, this is ${rmName} from Meridian Priority Banking. I'm reaching out personally because you've been a key client with us for over ${customer.tenure}."

2. ADDRESS FLAG (${customer.driver}):
"We noticed recent activity regarding rate comparisons and fee charges on your account. I wanted to proactively ensure you are receiving our top tier rates and zero-fee benefits."

3. PRESENT INCENTIVE:
"I have authorization today to match your deposit yield up to 7.85% p.a. and waive all maintenance fees."

4. NEXT STEPS:
Log client feedback in Meridian Dashboard under ${customer.id}.`;
}

