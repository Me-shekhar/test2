import { ApiResponse, RiskCheckpoint } from "@/types/models";
import {
  calculateEarlyClabsiRisk,
  calculateLateClabsiRisk,
  calculateIntegratedRisk,
  computeClisaScore,
} from "@/services/riskCalculator";
import { calculateDwellTime } from "@/lib/utils";
import { mockPatients, mockRiskCheckpoints, mockTractionEvents } from "@/lib/mockData";

interface RiskCalculationInput {
  patient_id: string;
  dressing_failure: boolean;
  blood_present: boolean;
  sweat_present: boolean;
  moisture_present: boolean;
  white_patches: boolean;
  air_gap: boolean;
}

export async function POST(request: Request) {
  try {
    const body: RiskCalculationInput = await request.json();
    const patient = mockPatients.find((p) => p.id === body.patient_id);

    if (!patient) {
      return Response.json(
        { success: false, error: "Patient not found" },
        { status: 404 }
      );
    }

    // Calculate CLISA score
    const clisaResult = computeClisaScore({
      dressing_failure: body.dressing_failure,
      blood_present: body.blood_present,
      sweat_present: body.sweat_present,
      moisture_present: body.moisture_present,
      white_patches: body.white_patches,
      air_gap: body.air_gap,
      patient_factors: patient.patient_factors,
    });

    const dwell_hours = calculateDwellTime(patient.insertion_date);

    // Calculate early risk
    const earlyRisk = calculateEarlyClabsiRisk({
      clisa_score: clisaResult.score,
      dressing_failure: body.dressing_failure,
      dwell_time_hours: dwell_hours,
      patient_factors: patient.patient_factors,
    });

    // Get traction events in last 24 hours
    const now = new Date();
    const traction_24h = mockTractionEvents.filter((te) => {
      const hoursDiff = (now.getTime() - te.timestamp.getTime()) / (1000 * 60 * 60);
      return te.patient_id === body.patient_id && hoursDiff <= 24;
    });

    const traction_red_count = traction_24h.filter((t) => t.severity === "red").length;

    // Calculate late risk
    const lateRisk = calculateLateClabsiRisk({
      early_risk_score: earlyRisk.score,
      dwell_time_hours: dwell_hours,
      traction_events_24h: traction_24h.length,
      traction_severity_red_count: traction_red_count,
      patient_factors: patient.patient_factors,
      recent_trend: "stable",
    });

    // Calculate integrated risk
    const integrated_score = calculateIntegratedRisk(
      earlyRisk.score,
      lateRisk.score,
      dwell_hours
    );

    const checkpoint: RiskCheckpoint = {
      id: `checkpoint_${Date.now()}`,
      patient_id: body.patient_id,
      timestamp: new Date(),
      early_risk_score: earlyRisk.score,
      late_risk_score: lateRisk.score,
      integrated_risk_score: integrated_score,
      risk_band: integrated_score <= 25 ? "green" : integrated_score <= 60 ? "yellow" : "red",
      event_type: null,
      clisa_score: clisaResult.score,
      clisa_category: clisaResult.category,
      created_at: new Date(),
    };

    const response: ApiResponse<RiskCheckpoint> = {
      success: true,
      data: checkpoint,
      message: "Risk assessment calculated",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error("Risk calculation error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to calculate risk",
      },
      { status: 400 }
    );
  }
}
