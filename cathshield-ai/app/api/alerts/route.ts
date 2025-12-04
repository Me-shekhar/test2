import { ApiResponse, Alert } from "@/types/models";
import { mockAlerts } from "@/lib/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");
    const unacknowledged_only = searchParams.get("unacknowledged_only") === "true";

    let alerts = mockAlerts;

    if (patient_id) {
      alerts = alerts.filter((a) => a.patient_id === patient_id);
    }

    if (unacknowledged_only) {
      alerts = alerts.filter((a) => !a.acknowledged);
    }

    const response: ApiResponse<Alert[]> = {
      success: true,
      data: alerts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()),
    };

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch alerts",
      },
      { status: 500 }
    );
  }
}
