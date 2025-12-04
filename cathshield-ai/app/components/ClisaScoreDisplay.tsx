"use client";

import React from "react";
import { riskColors, riskLabels } from "@/lib/utils";
import { getClisaTable } from "@/services/riskCalculator";

interface Props {
  clisaScore: number;
  clisaCategory: "low" | "moderate" | "high";
  riskBand: "green" | "yellow" | "red";
  recommendation: string;
  onViewTable: () => void;
}

export default function ClisaScoreDisplay({
  clisaScore,
  clisaCategory,
  riskBand,
  recommendation,
  onViewTable,
}: Props) {
  const getScoreColor = (score: number) => {
    if (score <= 2.5) return "green";
    if (score <= 6.5) return "yellow";
    return "red";
  };

  const badgeClass = {
    green: "badge-green",
    yellow: "badge-yellow",
    red: "badge-red",
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`card ${getScoreColor(clisaScore) === "green" ? "risk-green" : getScoreColor(clisaScore) === "yellow" ? "risk-yellow" : "risk-red"} border-2`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">CLISA Score</h2>
          <div className={`text-5xl font-bold ${
            getScoreColor(clisaScore) === "green"
              ? "text-green-600"
              : getScoreColor(clisaScore) === "yellow"
              ? "text-yellow-600"
              : "text-red-600"
          }`}>
            {clisaScore}
            <span className="text-xl">/10</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className={badgeClass[getScoreColor(clisaScore) as keyof typeof badgeClass]}>
            {riskLabels[getScoreColor(clisaScore) as keyof typeof riskLabels]}
          </span>
          <span className="text-sm font-semibold capitalize">
            {clisaCategory} Risk
          </span>
        </div>

        {/* Recommendation */}
        <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Recommended Action:
          </p>
          <p className="text-gray-700">{recommendation}</p>
        </div>

        <button
          onClick={onViewTable}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
        >
          View CLISA Reference Table →
        </button>
      </div>

      {/* Score Interpretation Guide */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          CLISA Score Interpretation
        </h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="badge-green mr-3">0 - 2.5</span>
            <div>
              <p className="font-semibold text-gray-800">Low Risk</p>
              <p className="text-sm text-gray-600">
                Observe regularly. Standard care protocol.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="badge-yellow mr-3">2.6 - 6.5</span>
            <div>
              <p className="font-semibold text-gray-800">Moderate Risk</p>
              <p className="text-sm text-gray-600">
                Change dressing within 24 hours. Monitor closely for deterioration.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="badge-red mr-3">&gt; 6.5</span>
            <div>
              <p className="font-semibold text-gray-800">High Risk</p>
              <p className="text-sm text-gray-600">
                Escalate to infection control. Consider catheter replacement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
