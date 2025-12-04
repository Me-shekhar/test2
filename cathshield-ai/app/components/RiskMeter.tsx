"use client";

import React from "react";
import { riskColors, riskLabels } from "@/lib/utils";

interface Props {
  riskBand: "green" | "yellow" | "red";
  score: number;
  maxScore?: number;
}

export default function RiskMeter({ riskBand, score, maxScore = 100 }: Props) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  const getBandPercentage = (band: "green" | "yellow" | "red") => {
    const ranges = {
      green: 33.33,
      yellow: 33.33,
      red: 33.34,
    };
    return ranges[band];
  };

  const colors = {
    green: riskColors.green,
    yellow: riskColors.yellow,
    red: riskColors.red,
  };

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Current CLABSI Risk</h3>

      {/* Segmented Gauge */}
      <div className="space-y-2">
        <div className="flex gap-2 h-8 rounded-full overflow-hidden border-2 border-gray-300">
          <div
            className="transition-all"
            style={{
              width: `${getBandPercentage("green")}%`,
              backgroundColor: colors.green,
            }}
          />
          <div
            className="transition-all"
            style={{
              width: `${getBandPercentage("yellow")}%`,
              backgroundColor: colors.yellow,
            }}
          />
          <div
            className="transition-all"
            style={{
              width: `${getBandPercentage("red")}%`,
              backgroundColor: colors.red,
            }}
          />
        </div>

        {/* Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>

      {/* Current Status */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors[riskBand] }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {riskLabels[riskBand]}
          </p>
          <p className="text-xs text-gray-500">
            Risk Score: <span className="font-bold">{score.toFixed(1)}</span>
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className={`p-3 rounded-lg text-sm ${
        riskBand === "green"
          ? "bg-green-50 text-green-800"
          : riskBand === "yellow"
          ? "bg-yellow-50 text-yellow-800"
          : "bg-red-50 text-red-800"
      }`}>
        {riskBand === "green" && (
          "✓ Current risk level acceptable. Continue standard protocols."
        )}
        {riskBand === "yellow" && (
          "⚠ Elevated risk. Increase monitoring frequency and reassess interventions."
        )}
        {riskBand === "red" && (
          "🚨 High risk. Escalate immediately and consider line replacement."
        )}
      </div>
    </div>
  );
}
