"use client";

export interface PatientIdentificationData {
  bed_number: string;
  initials: string;
  insertion_date: string;
  agitation_delirium: boolean;
  extremes_of_age_weight: boolean;
  comorbidities: boolean;
  immune_nutrition_status: boolean;
}

interface Props {
  onSave: (data: PatientIdentificationData) => void;
  loading?: boolean;
}

export default function PatientIdentificationScreen({
  onSave,
  loading = false,
}: Props) {
  const [formData, setFormData] = React.useState<PatientIdentificationData>({
    bed_number: "",
    initials: "",
    insertion_date: new Date().toISOString().split("T")[0],
    agitation_delirium: false,
    extremes_of_age_weight: false,
    comorbidities: false,
    immune_nutrition_status: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bed_number.trim() || !formData.initials.trim()) {
      alert("Please fill in bed number and initials");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Patient Identification
          </h1>
          <p className="text-gray-600 mb-8">
            Enter patient details and risk factors
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Basic Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bed Number *
                  </label>
                  <input
                    type="text"
                    name="bed_number"
                    value={formData.bed_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Initials *
                  </label>
                  <input
                    type="text"
                    name="initials"
                    value={formData.initials}
                    onChange={handleInputChange}
                    placeholder="e.g., MR"
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IV Insertion Date *
                  </label>
                  <input
                    type="date"
                    name="insertion_date"
                    value={formData.insertion_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Patient Factors */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Patient Risk Factors
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select all that apply
              </p>

              <div className="space-y-3">
                {[
                  {
                    key: "agitation_delirium",
                    label: "Agitation / Delirium",
                    description:
                      "Restlessness, confusion, self-pulling behavior, high traction/dislodgement risk",
                  },
                  {
                    key: "extremes_of_age_weight",
                    label: "Age & Weight Extremes",
                    description:
                      "Neonates, frail elderly, or low body weight",
                  },
                  {
                    key: "comorbidities",
                    label: "Comorbidities",
                    description:
                      "Diabetes, malignancy, CKD, GI disorders, hemodialysis",
                  },
                  {
                    key: "immune_nutrition_status",
                    label: "Immune Status & Nutrition",
                    description:
                      "Immunosuppression, anemia, malnutrition, TPN use",
                  },
                ].map(({ key, label, description }) => (
                  <label
                    key={key}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={key}
                      checked={
                        formData[key as keyof typeof formData] as boolean
                      }
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-700">{label}</p>
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-8"
            >
              {loading ? "Saving..." : "Save Patient Baseline"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React from "react";
