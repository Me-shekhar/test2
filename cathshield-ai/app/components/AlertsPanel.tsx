"use client";

import React, { useState } from "react";
import { Alert } from "@/types/models";
import { formatTime } from "@/lib/utils";

interface Props {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

export default function AlertsPanel({ alerts, onAcknowledge }: Props) {
  const [filter, setFilter] = useState<"all" | "unacknowledged" | "critical">(
    "unacknowledged"
  );

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "unacknowledged") return !a.acknowledged;
    if (filter === "critical") return a.severity === "critical";
    return true;
  });

  const severityColors = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    critical: "bg-red-50 border-red-200 text-red-900",
  };

  const severityBadges = {
    info: "badge-yellow",
    warning: "badge-yellow",
    critical: "badge-red",
  };

  const alertTypeIcons: Record<string, string> = {
    traction: "⚡",
    dressing_failure: "🩹",
    high_clabsi: "🔴",
    high_clisa: "⚠️",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Clinical Alerts {filteredAlerts.length > 0 && `(${filteredAlerts.length})`}
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["unacknowledged", "critical", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="card text-center text-gray-500 py-8">
          <p>No alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card border-l-4 transition ${severityColors[alert.severity]} ${
                alert.severity === "critical" ? "border-l-red-600" : "border-l-yellow-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {alertTypeIcons[alert.type] || "🔔"}
                    </span>
                    <div>
                      <p className="font-bold text-lg">{alert.message}</p>
                      <p className="text-xs text-gray-600">
                        {formatTime(alert.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm mb-3">
                    <span className="font-semibold">Action:</span>{" "}
                    {alert.recommended_action}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={severityBadges[alert.severity]}>
                      {alert.severity.toUpperCase()}
                    </span>
                    {alert.acknowledged && (
                      <span className="inline-block px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs font-semibold">
                        ✓ Acknowledged
                      </span>
                    )}
                  </div>
                </div>

                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="btn-secondary ml-4 whitespace-nowrap"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
