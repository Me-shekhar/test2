"use client";

import React, { useState } from "react";
import { getClisaTable } from "@/services/riskCalculator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClisaTableModal({ isOpen, onClose }: Props) {
  const table = getClisaTable();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            CLISA Reference Table
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {table.map((row, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  row.color === "green"
                    ? "bg-green-50 border-green-200"
                    : row.color === "yellow"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-block px-3 py-1 bg-white rounded font-bold text-sm"
                        style={{
                          color:
                            row.color === "green"
                              ? "#10b981"
                              : row.color === "yellow"
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        {row.score_range}
                      </span>
                      <h3 className="text-lg font-bold">{row.category}</h3>
                    </div>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Recommendation:</span>{" "}
                      {row.recommendation}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Action:</span>{" "}
                      {row.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
