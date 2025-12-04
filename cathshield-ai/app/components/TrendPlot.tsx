"use client";

import React from "react";
import { RiskCheckpoint } from "@/types/models";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { riskColors } from "@/lib/utils";

interface Props {
  checkpoints: RiskCheckpoint[];
}

export default function TrendPlot({ checkpoints }: Props) {
  if (checkpoints.length === 0) {
    return (
      <div className="card text-center text-gray-500 py-8">
        <p>No trend data available yet</p>
      </div>
    );
  }

  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const chartData = sortedCheckpoints.map((cp, i) => ({
    name: `Day ${Math.floor(i / 2) + 1} – ${i % 2 === 0 ? "AM" : "PM"}`,
    score: cp.integrated_risk_score,
    risk_band: cp.risk_band,
    event_type: cp.event_type,
    timestamp: cp.timestamp.getTime(),
  }));

  const riskColor = (band: string) => {
    const colorMap: Record<string, string> = {
      green: riskColors.green,
      yellow: riskColors.yellow,
      red: riskColors.red,
    };
    return colorMap[band] || "#gray";
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    let fill = riskColor(payload.risk_band);

    // Special colors for events
    if (payload.event_type === "dressing_change") {
      fill = "#ffffff";
      return (
        <g>
          <circle cx={cx} cy={cy} r={7} fill={fill} stroke="#000" strokeWidth={2} />
          <text x={cx} y={cy} textAnchor="middle" dy=".3em" fontSize={10} fontWeight="bold">
            D
          </text>
        </g>
      );
    } else if (payload.event_type === "catheter_change") {
      fill = "#000000";
      return (
        <circle cx={cx} cy={cy} r={7} fill={fill} stroke="#fff" strokeWidth={2} />
      );
    }

    return <circle cx={cx} cy={cy} r={6} fill={fill} />;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        12-Hour Risk Trend
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: "Risk Score", angle: -90, position: "insideLeft" }}
            domain={[0, 100]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold">{data.name}</p>
                    <p className="text-sm">
                      Score: <span className="font-bold">{data.score.toFixed(1)}</span>
                    </p>
                    <p className="text-sm capitalize">
                      Risk: <span className="font-bold">{data.risk_band}</span>
                    </p>
                    {data.event_type && (
                      <p className="text-sm">
                        Event: <span className="font-bold capitalize">{data.event_type.replace("_", " ")}</span>
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke={riskColors.yellow}
            dot={<CustomDot />}
            strokeWidth={2}
            name="Integrated Risk Score"
          />

          {/* Risk band background zones */}
          <Line
            type="stepAfter"
            dataKey={() => 25}
            stroke="rgba(16, 185, 129, 0.2)"
            strokeDasharray="5 5"
            dot={false}
            name="Green/Yellow Threshold"
            isAnimationActive={false}
          />
          <Line
            type="stepAfter"
            dataKey={() => 60}
            stroke="rgba(239, 68, 68, 0.2)"
            strokeDasharray="5 5"
            dot={false}
            name="Yellow/Red Threshold"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: riskColors.green }} />
          <span className="text-sm text-gray-700">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: riskColors.yellow }} />
          <span className="text-sm text-gray-700">Moderate Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: riskColors.red }} />
          <span className="text-sm text-gray-700">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-black" style={{ backgroundColor: "white" }} />
          <span className="text-sm text-gray-700">Dressing Change</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "black" }} />
          <span className="text-sm text-gray-700">Catheter Change</span>
        </div>
      </div>
    </div>
  );
}
