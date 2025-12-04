// Patient model
export interface PatientFactors {
  agitation_delirium: boolean;
  extremes_of_age_weight: boolean;
  comorbidities: boolean;
  immune_nutrition_status: boolean;
}

export interface Patient {
  id: string;
  bed_number: string;
  initials: string;
  insertion_date: Date;
  patient_factors: PatientFactors;
  expected_admission_length_days?: number;
  created_at: Date;
  updated_at: Date;
}

// Consent model
export type ConsentLanguage = "English" | "Kannada" | "Both" | "Other";

export interface Consent {
  id: string;
  patient_id: string;
  consent_given: boolean;
  consent_language_used: ConsentLanguage;
  consent_timestamp: Date;
  created_at: Date;
}

// Image Capture model
export type ImageType = "catheter_site" | "traction_module";
export type CaptureStatus = "success" | "failed";

export interface ImageCapture {
  id: string;
  patient_id: string;
  timestamp: Date;
  image_type: ImageType;
  image_url: string;
  notes?: string;
  capture_status: CaptureStatus;
  created_at: Date;
}

// Risk Checkpoint model
export type RiskBand = "green" | "yellow" | "red";
export type EventType = null | "dressing_change" | "catheter_change";

export interface RiskCheckpoint {
  id: string;
  patient_id: string;
  timestamp: Date;
  early_risk_score: number;
  late_risk_score: number;
  integrated_risk_score: number;
  risk_band: RiskBand;
  event_type: EventType;
  clisa_score?: number;
  clisa_category?: "low" | "moderate" | "high";
  created_at: Date;
}

// Traction Event model
export type TractionSeverity = "yellow" | "red";

export interface TractionEvent {
  id: string;
  patient_id: string;
  timestamp: Date;
  severity: TractionSeverity;
  created_at: Date;
}

// Alert model
export type AlertType = "traction" | "dressing_failure" | "high_clabsi" | "high_clisa";
export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  patient_id: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  recommended_action: string;
  created_at: Date;
  acknowledged: boolean;
}

// Ward Metrics model
export interface WardMetrics {
  id: string;
  ward_id: string;
  date: Date;
  clabsi_cases: number;
  total_central_line_days: number;
  dressing_change_count: number;
  catheter_change_count: number;
  clabsi_rate?: number;
  created_at: Date;
}

// API Response models
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
