// Mock data for development and demonstration
import {
  Patient,
  Consent,
  ImageCapture,
  RiskCheckpoint,
  TractionEvent,
  Alert,
  WardMetrics,
} from "@/types/models";

export const mockPatients: Patient[] = [
  {
    id: "patient_001",
    bed_number: "101",
    initials: "MR",
    insertion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    patient_factors: {
      agitation_delirium: true,
      extremes_of_age_weight: false,
      comorbidities: true,
      immune_nutrition_status: false,
    },
    expected_admission_length_days: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "patient_002",
    bed_number: "102",
    initials: "RN",
    insertion_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    patient_factors: {
      agitation_delirium: false,
      extremes_of_age_weight: true,
      comorbidities: false,
      immune_nutrition_status: true,
    },
    expected_admission_length_days: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "patient_003",
    bed_number: "103",
    initials: "SK",
    insertion_date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    patient_factors: {
      agitation_delirium: false,
      extremes_of_age_weight: false,
      comorbidities: false,
      immune_nutrition_status: false,
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const mockConsents: Consent[] = [
  {
    id: "consent_001",
    patient_id: "patient_001",
    consent_given: true,
    consent_language_used: "English",
    consent_timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "consent_002",
    patient_id: "patient_002",
    consent_given: true,
    consent_language_used: "Kannada",
    consent_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export const mockRiskCheckpoints: RiskCheckpoint[] = [
  {
    id: "checkpoint_001",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    early_risk_score: 35.5,
    late_risk_score: 72.3,
    integrated_risk_score: 60.8,
    risk_band: "yellow",
    event_type: null,
    clisa_score: 5.2,
    clisa_category: "moderate",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "checkpoint_002",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    early_risk_score: 28.0,
    late_risk_score: 65.0,
    integrated_risk_score: 52.2,
    risk_band: "yellow",
    event_type: "dressing_change",
    clisa_score: 4.1,
    clisa_category: "moderate",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "checkpoint_003",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    early_risk_score: 25.3,
    late_risk_score: 58.5,
    integrated_risk_score: 45.1,
    risk_band: "green",
    event_type: null,
    clisa_score: 3.5,
    clisa_category: "low",
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: "checkpoint_004",
    patient_id: "patient_002",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    early_risk_score: 18.5,
    late_risk_score: 22.0,
    integrated_risk_score: 19.5,
    risk_band: "green",
    event_type: null,
    clisa_score: 1.8,
    clisa_category: "low",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export const mockTractionEvents: TractionEvent[] = [
  {
    id: "traction_001",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    severity: "yellow",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "traction_002",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    severity: "yellow",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "traction_003",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    severity: "red",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "alert_001",
    patient_id: "patient_001",
    type: "traction",
    message: "1 RED traction alert(s) detected in last 24 hours",
    severity: "critical",
    recommended_action:
      "Immediately check IV line, stabilize catheter, assess for dislodgement",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    acknowledged: false,
  },
  {
    id: "alert_002",
    patient_id: "patient_001",
    type: "high_clabsi",
    message: "High CLABSI risk with deteriorating trend",
    severity: "warning",
    recommended_action: "Increase monitoring, review insertion technique",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
    acknowledged: true,
  },
];

export const mockWardMetrics: WardMetrics = {
  id: "ward_001",
  ward_id: "ICU-A",
  date: new Date(),
  clabsi_cases: 2,
  total_central_line_days: 47,
  dressing_change_count: 8,
  catheter_change_count: 2,
  clabsi_rate: 4.26, // (2 / 47) * 100
  created_at: new Date(),
};

export const mockImageCaptures: ImageCapture[] = [
  {
    id: "image_001",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    image_type: "catheter_site",
    image_url:
      "https://via.placeholder.com/400x300?text=Catheter+Site+Image",
    notes: "Slight redness around insertion site, moisture visible",
    capture_status: "success",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "image_002",
    patient_id: "patient_001",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    image_type: "traction_module",
    image_url:
      "https://via.placeholder.com/400x300?text=Traction+Module+Image",
    notes: "Device functioning normally",
    capture_status: "success",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];
