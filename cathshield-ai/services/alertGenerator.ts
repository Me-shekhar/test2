// Alert generation and management logic
import {
  Alert,
  AlertType,
  AlertSeverity,
  RiskCheckpoint,
  TractionEvent,
} from "@/types/models";
import { v4 as uuidv4 } from "uuid";

export interface AlertTriggerInput {
  patient_id: string;
  recent_checkpoints: RiskCheckpoint[];
  recent_traction_events: TractionEvent[];
  dressing_failure: boolean;
  clisa_score?: number;
}

export function generateAlerts(input: AlertTriggerInput): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  // Check for traction/dislodgement alerts
  const recentTractionRed = input.recent_traction_events.filter(
    (e) => e.severity === "red"
  ).length;
  const recentTractionYellow = input.recent_traction_events.filter(
    (e) => e.severity === "yellow"
  ).length;

  if (recentTractionRed > 0) {
    alerts.push({
      id: uuidv4(),
      patient_id: input.patient_id,
      type: "traction",
      message: `${recentTractionRed} RED traction alert(s) detected in last 24 hours - HIGH venous trauma risk`,
      severity: "critical",
      recommended_action:
        "Immediately check IV line, stabilize catheter, assess for dislodgement or venous injury",
      created_at: now,
      acknowledged: false,
    });
  } else if (recentTractionYellow >= 3) {
    alerts.push({
      id: uuidv4(),
      patient_id: input.patient_id,
      type: "traction",
      message: `${recentTractionYellow} YELLOW traction alerts in last 24 hours`,
      severity: "warning",
      recommended_action:
        "Monitor IV line closely, educate patient on avoiding traction, consider arm immobilization",
      created_at: now,
      acknowledged: false,
    });
  }

  // Check for dressing failure
  if (input.dressing_failure) {
    alerts.push({
      id: uuidv4(),
      patient_id: input.patient_id,
      type: "dressing_failure",
      message: "Dressing failure detected - moisture, blood, or air gap present",
      severity: "warning",
      recommended_action:
        "Change dressing immediately using aseptic technique, assess insertion site",
      created_at: now,
      acknowledged: false,
    });
  }

  // Check CLISA score
  if (input.clisa_score !== undefined && input.clisa_score > 6.5) {
    alerts.push({
      id: uuidv4(),
      patient_id: input.patient_id,
      type: "high_clisa",
      message: `High CLISA score (${input.clisa_score}) - elevated infection risk`,
      severity: "critical",
      recommended_action:
        "Escalate to infection control, consider catheter replacement, senior physician review",
      created_at: now,
      acknowledged: false,
    });
  }

  // Check CLABSI risk from recent checkpoints
  const latestCheckpoint = input.recent_checkpoints[0];
  if (latestCheckpoint && latestCheckpoint.risk_band === "red") {
    // Check if trend is worsening
    const trend = analyzeTrend(input.recent_checkpoints);
    if (trend === "deteriorating") {
      alerts.push({
        id: uuidv4(),
        patient_id: input.patient_id,
        type: "high_clabsi",
        message: `High CLABSI risk with deteriorating trend - immediate intervention needed`,
        severity: "critical",
        recommended_action:
          "Senior review, consider line removal, infection control consultation, prophylactic cultures",
        created_at: now,
        acknowledged: false,
      });
    } else {
      alerts.push({
        id: uuidv4(),
        patient_id: input.patient_id,
        type: "high_clabsi",
        message: `High CLABSI risk detected`,
        severity: "warning",
        recommended_action:
          "Increase monitoring, review insertion technique, optimize dressing and flushing protocols",
        created_at: now,
        acknowledged: false,
      });
    }
  }

  return alerts;
}

function analyzeTrend(
  checkpoints: RiskCheckpoint[]
): "improving" | "stable" | "deteriorating" {
  if (checkpoints.length < 2) return "stable";

  const recent = checkpoints.slice(0, 3).reverse(); // Last 3 checkpoints
  let deteriorating = 0;
  let improving = 0;

  for (let i = 1; i < recent.length; i++) {
    if (recent[i].integrated_risk_score > recent[i - 1].integrated_risk_score) {
      deteriorating++;
    } else {
      improving++;
    }
  }

  if (deteriorating > improving) return "deteriorating";
  if (improving > deteriorating) return "improving";
  return "stable";
}

export function acknowledgeAlert(alertId: string): void {
  // This would update the database
  // Implementation depends on your DB setup
}
