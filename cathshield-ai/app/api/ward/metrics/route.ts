import { ApiResponse, WardMetrics } from "@/types/models";
import { mockWardMetrics, mockRiskCheckpoints, mockImageCaptures, mockPatients } from "@/lib/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ward_id = searchParams.get("ward_id") || "ICU-A";
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Aggregate metrics from mock data
    const dressing_changes = mockImageCaptures.filter(
      (img) => img.image_type === "catheter_site" && img.capture_status === "success"
    ).length;

    // Count catheter changes from event_type in checkpoints
    const catheter_changes = mockRiskCheckpoints.filter(
      (cp) => cp.event_type === "catheter_change"
    ).length;

    // Count patients with red risk band (high CLABSI risk)
    const high_risk_patients = new Set(
      mockRiskCheckpoints
        .filter((cp) => cp.risk_band === "red")
        .map((cp) => cp.patient_id)
    ).size;

    const metrics: WardMetrics = {
      id: `ward_${Date.now()}`,
      ward_id,
      date: new Date(date),
      clabsi_cases: high_risk_patients,
      total_central_line_days: mockPatients.reduce((sum, p) => {
        const now = new Date();
        const diffMs = now.getTime() - p.insertion_date.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return sum + Math.max(1, days);
      }, 0),
      dressing_change_count: dressing_changes,
      catheter_change_count: catheter_changes,
      created_at: new Date(),
    };

    // Calculate CLABSI rate
    metrics.clabsi_rate =
      metrics.total_central_line_days > 0
        ? (metrics.clabsi_cases / metrics.total_central_line_days) * 1000
        : 0;

    const response: ApiResponse<WardMetrics> = {
      success: true,
      data: metrics,
    };

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch ward metrics",
      },
      { status: 500 }
    );
  }
}
