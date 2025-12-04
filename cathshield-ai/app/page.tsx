"use client";

import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import PatientIdentificationScreen from "./components/PatientIdentificationScreen";
import AudioConsentModule from "./components/AudioConsentModule";
import ImageCaptureScreen from "./components/ImageCaptureScreen";
import ClisaScoreDisplay from "./components/ClisaScoreDisplay";
import TrendPlot from "./components/TrendPlot";
import RiskMeter from "./components/RiskMeter";
import AlertsPanel from "./components/AlertsPanel";
import ClisaTableModal from "./components/ClisaTableModal";
import { mockPatients, mockRiskCheckpoints, mockAlerts } from "@/lib/mockData";
import { computeClisaScore } from "@/services/riskCalculator";

type AppStep = "landing" | "patient-id" | "consent" | "image-capture" | "dashboard";

export default function Home() {
  const [step, setStep] = useState<AppStep>("landing");
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [showClisaTable, setShowClisaTable] = useState(false);
  const [clisaResult, setClisaResult] = React.useState<{
    score: number;
    category: "low" | "moderate" | "high";
    recommendation: string;
  }>({
    score: 4.2,
    category: "moderate",
    recommendation: "Change dressing within 24 hours. Monitor closely.",
  });

  const patientCheckpoints = mockRiskCheckpoints.filter(
    (cp) => cp.patient_id === selectedPatient.id
  );

  const patientAlerts = mockAlerts.filter(
    (a) => a.patient_id === selectedPatient.id
  );

  const latestCheckpoint = patientCheckpoints[0];

  const handlePatientSave = (data: any) => {
    setStep("consent");
  };

  const handleConsentSubmit = () => {
    setStep("image-capture");
  };

  const handleImageCapture = (data: any) => {
    // In production, calculate CLISA based on image analysis
    const mockClisaInput = {
      dressing_failure: false,
      blood_present: false,
      sweat_present: true,
      moisture_present: true,
      white_patches: false,
      air_gap: false,
      patient_factors: selectedPatient.patient_factors,
    };

    const result = computeClisaScore(mockClisaInput);
    setClisaResult(result);
    setStep("dashboard");
  };

  return (
    <main>
      {step === "landing" && (
        <LandingPage onEnter={() => setStep("patient-id")} />
      )}

      {step === "patient-id" && (
        <PatientIdentificationScreen onSave={handlePatientSave} />
      )}

      {step === "consent" && (
        <AudioConsentModule onConsentSubmitted={handleConsentSubmit} />
      )}

      {step === "image-capture" && (
        <ImageCaptureScreen onCaptureComplete={handleImageCapture} />
      )}

      {step === "dashboard" && (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Patient Dashboard
              </h1>
              <p className="text-gray-600">
                Bed {selectedPatient.bed_number} • {selectedPatient.initials} •{" "}
                {patientCheckpoints.length} checkpoints
              </p>
            </div>

            {/* CLISA Score & Risk Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ClisaScoreDisplay
                  clisaScore={clisaResult.score}
                  clisaCategory={clisaResult.category}
                  riskBand={
                    clisaResult.score <= 2.5
                      ? "green"
                      : clisaResult.score <= 6.5
                      ? "yellow"
                      : "red"
                  }
                  recommendation={clisaResult.recommendation}
                  onViewTable={() => setShowClisaTable(true)}
                />
              </div>
              <div>
                {latestCheckpoint && (
                  <RiskMeter
                    riskBand={latestCheckpoint.risk_band}
                    score={latestCheckpoint.integrated_risk_score}
                  />
                )}
              </div>
            </div>

            {/* Trend Plot */}
            <div className="mb-6">
              <TrendPlot checkpoints={patientCheckpoints} />
            </div>

            {/* Alerts */}
            <div className="mb-6">
              <AlertsPanel
                alerts={patientAlerts}
                onAcknowledge={(alertId) => {
                  console.log("Acknowledge alert:", alertId);
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep("patient-id")}
                className="btn-secondary"
              >
                ← Back to Patient Selection
              </button>
              <button
                onClick={() => setStep("image-capture")}
                className="btn-primary"
              >
                📷 Schedule Next Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLISA Table Modal */}
      <ClisaTableModal
        isOpen={showClisaTable}
        onClose={() => setShowClisaTable(false)}
      />
    </main>
  );
}
