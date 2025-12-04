import { mockPatients, mockRiskCheckpoints, mockTractionEvents, mockAlerts } from "@/lib/mockData";
import { ApiResponse } from "@/types/models";

interface PatientDashboard {
  patient: typeof mockPatients[0];
  latest_checkpoint: typeof mockRiskCheckpoints[0] | null;
  recent_checkpoints: typeof mockRiskCheckpoints;
  traction_events_24h: typeof mockTractionEvents;
  active_alerts: typeof mockAlerts;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const patient = mockPatients.find((p) => p.id === id);

    if (!patient) {
      return Response.json(
        { success: false, error: "Patient not found" },
        { status: 404 }
      );
    }

    const recent_checkpoints = mockRiskCheckpoints
      .filter((cp) => cp.patient_id === id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    const traction_events_24h = mockTractionEvents
      .filter((te) => te.patient_id === id)
      .filter((te) => {
        const hoursDiff = (Date.now() - te.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 24;
      });

    const active_alerts = mockAlerts
      .filter((a) => a.patient_id === id && !a.acknowledged)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    const latest_checkpoint = recent_checkpoints[0] || null;

    const data: PatientDashboard = {
      patient,
      latest_checkpoint,
      recent_checkpoints,
      traction_events_24h,
      active_alerts,
    };

    const response: ApiResponse<PatientDashboard> = {
      success: true,
      data,
    };

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch patient dashboard",
      },
      { status: 500 }
    );
  }
}
