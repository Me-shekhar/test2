// CLISA scoring and risk calculation logic
import { PatientFactors, RiskBand, RiskCheckpoint } from "@/types/models";

interface ClisaInput {
  dressing_failure: boolean;
  blood_present: boolean;
  sweat_present: boolean;
  moisture_present: boolean;
  white_patches: boolean;
  air_gap: boolean;
  patient_factors: PatientFactors;
}

interface ClisaResult {
  score: number;
  category: "low" | "moderate" | "high";
  recommendation: string;
}

// CLISA Score Calculation (0-10 scale)
export function computeClisaScore(input: ClisaInput): ClisaResult {
  let score = 0;

  // Dressing assessment (0-4 points)
  if (input.dressing_failure) score += 2;
  if (input.blood_present) score += 1;
  if (input.sweat_present) score += 0.5;
  if (input.moisture_present) score += 0.5;
  if (input.white_patches) score += 1;
  if (input.air_gap) score += 1;

  // Patient factors (0-6 points)
  const factorCount = Object.values(input.patient_factors).filter(
    (v) => v === true
  ).length;
  score += factorCount * 1.5;

  // Determine category and recommendation
  const category =
    score <= 2.5 ? "low" : score <= 6.5 ? "moderate" : "high";

  const clisaTable: Record<string, string> = {
    low: "Observe regularly. Standard care protocol.",
    moderate:
      "Change dressing within 24 hours. Monitor closely for deterioration.",
    high: "Escalate to infection control. Consider catheter replacement. Immediate action required.",
  };

  return {
    score: parseFloat(score.toFixed(2)),
    category,
    recommendation: clisaTable[category],
  };
}

// Get CLISA reference table
export function getClisaTable() {
  return [
    {
      score_range: "0 - 2.5",
      category: "Low Risk",
      color: "green",
      recommendation: "Observe regularly. Standard care protocol.",
      action: "Continue standard monitoring",
    },
    {
      score_range: "2.6 - 6.5",
      category: "Moderate Risk",
      color: "yellow",
      recommendation: "Change dressing within 24 hours. Monitor closely.",
      action: "Schedule dressing change",
    },
    {
      score_range: "> 6.5",
      category: "High Risk",
      color: "red",
      recommendation:
        "Escalate to infection control. Consider catheter replacement.",
      action: "Immediate escalation required",
    },
  ];
}

// Risk Band mapping (AI-based cutoffs)
export function getRiskBand(score: number): RiskBand {
  // Placeholder for AI/ML-based cutoffs
  // These can be updated based on real ML model predictions
  if (score <= 25) return "green";
  if (score <= 60) return "yellow";
  return "red";
}

interface EarlyRiskInput {
  clisa_score: number;
  dressing_failure: boolean;
  dwell_time_hours: number;
  patient_factors: PatientFactors;
}

interface RiskOutput {
  score: number;
  level: RiskBand;
  message: string;
}

// Early CLABSI Risk (0-3 days)
export function calculateEarlyClabsiRisk(input: EarlyRiskInput): RiskOutput {
  let score = 0;

  // CLISA score contribution (0-40 points)
  score += (input.clisa_score / 10) * 40;

  // Dressing failure (0-20 points)
  if (input.dressing_failure) score += 20;

  // Patient factors (0-20 points)
  const factorCount = Object.values(input.patient_factors).filter(
    (v) => v === true
  ).length;
  score += factorCount * 5;

  // Dwell time contribution (0-20 points) - early phase has lower weight
  if (input.dwell_time_hours > 72) score += 10;

  const level = getRiskBand(score);
  const messages: Record<RiskBand, string> = {
    green:
      "Low early CLABSI risk. Continue standard monitoring and care practices.",
    yellow:
      "Moderate early CLABSI risk. Increase monitoring frequency and dressing checks.",
    red: "High early CLABSI risk. Escalate care, consider specialist review.",
  };

  return {
    score: parseFloat(score.toFixed(2)),
    level,
    message: messages[level],
  };
}

interface LateRiskInput {
  early_risk_score: number;
  dwell_time_hours: number;
  traction_events_24h: number;
  traction_severity_red_count: number;
  patient_factors: PatientFactors;
  recent_trend: "improving" | "stable" | "deteriorating";
}

// Late CLABSI Risk (>3 days)
export function calculateLateClabsiRisk(input: LateRiskInput): RiskOutput {
  let score = input.early_risk_score * 0.6; // Carry forward early risk

  // Dwell time risk (0-30 points)
  if (input.dwell_time_hours > 72) score += 15;
  if (input.dwell_time_hours > 168) score += 20; // >7 days significantly increases risk

  // Traction/venous trauma risk (0-25 points)
  score += input.traction_events_24h * 2;
  score += input.traction_severity_red_count * 5;

  // Patient factors (0-20 points)
  const factorCount = Object.values(input.patient_factors).filter(
    (v) => v === true
  ).length;
  score += factorCount * 5;

  // Trend deterioration (0-15 points)
  if (input.recent_trend === "deteriorating") score += 15;
  if (input.recent_trend === "stable") score += 5;

  const level = getRiskBand(score);
  const messages: Record<RiskBand, string> = {
    green: "Low late CLABSI risk. Maintain current care protocol.",
    yellow:
      "Moderate late CLABSI risk. Increase daily assessments and consider prophylactic measures.",
    red: "High late CLABSI risk. Consider line replacement and escalate to infection prevention team.",
  };

  return {
    score: parseFloat(score.toFixed(2)),
    level,
    message: messages[level],
  };
}

// Calculate integrated risk for current checkpoint
export function calculateIntegratedRisk(
  early_score: number,
  late_score: number,
  dwell_hours: number
): number {
  if (dwell_hours <= 72) {
    return early_score; // Use early risk for first 3 days
  }
  // Weighted combination for late phase
  return early_score * 0.4 + late_score * 0.6;
}
