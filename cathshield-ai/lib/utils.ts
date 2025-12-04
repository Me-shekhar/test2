// Utility functions
import { RiskCheckpoint } from "@/types/models";

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateDwellTime(insertionDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - insertionDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60)); // Return hours
}

export function formatDwellTime(hours: number): string {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days === 0) {
    return `${remainingHours}h`;
  }
  return `${days}d ${remainingHours}h`;
}

export function get12HourLabel(date: Date): string {
  const hour = date.getHours();
  const dayNum = Math.floor(date.getDate());
  const period = hour < 12 ? "AM" : "PM";
  return `Day ${dayNum} – ${period}`;
}

export function generateDayLabels(checkpoints: RiskCheckpoint[]): string[] {
  return checkpoints
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((cp) => get12HourLabel(cp.timestamp));
}

export interface ChartDataPoint {
  label: string;
  score: number;
  timestamp: Date;
  risk_band: "green" | "yellow" | "red";
  event_type: "dressing_change" | "catheter_change" | null;
}

export function formatChartData(checkpoints: RiskCheckpoint[]): ChartDataPoint[] {
  return checkpoints
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((cp) => ({
      label: get12HourLabel(cp.timestamp),
      score: cp.integrated_risk_score,
      timestamp: cp.timestamp,
      risk_band: cp.risk_band,
      event_type: cp.event_type,
    }));
}

export const riskColors = {
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
};

export const riskLabels = {
  green: "Low Risk",
  yellow: "Moderate Risk",
  red: "High Risk",
};

export function getDaysSinceInsertion(insertionDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - insertionDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isWithin3Days(insertionDate: Date): boolean {
  return getDaysSinceInsertion(insertionDate) <= 3;
}
