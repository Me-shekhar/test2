"use client";

import React from "react";
import { WardMetrics } from "@/types/models";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { riskColors } from "@/lib/utils";

interface Props {
  wardMetrics: WardMetrics;
}

export default function WardDashboard({ wardMetrics }: Props) {
    const rate = wardMetrics.clabsi_rate ?? 0;
    const clabsiRisk =
      rate <= 2
        ? "green"
        : rate <= 5
        ? "yellow"
        : "red";

  const chartData = [
    {
      name: "Dressing Changes",
      count: wardMetrics.dressing_change_count,
      fill: riskColors.yellow,
    },
    {
      name: "Catheter Changes",
      count: wardMetrics.catheter_change_count,
      fill: riskColors.red,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ward Dashboard</h1>
        <p className="text-gray-600">
          Ward: <span className="font-semibold">{wardMetrics.ward_id}</span>
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CLABSI Cases */}
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">CLABSI Cases (High Risk)</p>
          <p className="text-4xl font-bold text-gray-800">
            {wardMetrics.clabsi_cases}
          </p>
        </div>

        {/* Central Line Days */}
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Central Line Days</p>
          <p className="text-4xl font-bold text-gray-800">
            {wardMetrics.total_central_line_days}
          </p>
        </div>

        {/* CLABSI Rate */}
        <div
          className={`card ${
            clabsiRisk === "green"
              ? "risk-green"
              : clabsiRisk === "yellow"
              ? "risk-yellow"
              : "risk-red"
          } border-2`}
        >
          <p className="text-sm mb-1 font-semibold">CLABSI Rate (per 1000 line-days)</p>
          <p className="text-4xl font-bold">
            {wardMetrics.clabsi_rate?.toFixed(2) || "0.00"}
          </p>
        </div>

        {/* Dressing Usage */}
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Dressing Changes</p>
          <p className="text-4xl font-bold text-gray-800">
            {wardMetrics.dressing_change_count}
          </p>
        </div>
      </div>

      {/* Intervention Timeline */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Intervention Timeline
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={riskColors.yellow} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Assessment */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Ward Risk Assessment
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-semibold text-blue-900">
              Total Patients with Central Lines: {wardMetrics.total_central_line_days}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              clabsiRisk === "green"
                ? "bg-green-50 border border-green-200"
                : clabsiRisk === "yellow"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p className={`text-sm font-semibold ${
              clabsiRisk === "green"
                ? "text-green-900"
                : clabsiRisk === "yellow"
                ? "text-yellow-900"
                : "text-red-900"
            }`}>
              {clabsiRisk === "green" && "✓ CLABSI rate is within acceptable range"}
              {clabsiRisk === "yellow" && "⚠ CLABSI rate is elevated - monitor closely"}
              {clabsiRisk === "red" && "🚨 High CLABSI rate - urgent intervention needed"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes for HAI/Quality Reporting */}
      <div className="card bg-indigo-50 border-indigo-200">
        <p className="text-sm text-indigo-900">
          <span className="font-semibold">For NABH/JCI Quality Reporting:</span>
          <br />
          This dashboard provides data for HAI reduction monitoring, infection
          prevention audits, and quality metrics reporting. CLABSI rate calculation
          follows standard infection prevention protocols.
        </p>
      </div>
    </div>
  );
}
