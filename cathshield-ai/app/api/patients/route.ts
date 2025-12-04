import { mockPatients } from "@/lib/mockData";
import { ApiResponse, Patient } from "@/types/models";

// GET /api/patients - List all patients
export async function GET() {
  try {
    // In production, fetch from database
    const response: ApiResponse<Patient[]> = {
      success: true,
      data: mockPatients,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to fetch patients",
      },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create new patient
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newPatient: Patient = {
      id: `patient_${Date.now()}`,
      bed_number: body.bed_number,
      initials: body.initials,
      insertion_date: new Date(body.insertion_date),
      patient_factors: body.patient_factors,
      expected_admission_length_days: body.expected_admission_length_days,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // In production, save to database
    // await db.patients.insert(newPatient);

    const response: ApiResponse<Patient> = {
      success: true,
      data: newPatient,
      message: "Patient created successfully",
    };
    return Response.json(response, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to create patient",
      },
      { status: 400 }
    );
  }
}
