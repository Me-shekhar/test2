"use client";

import React from "react";

interface Props {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <div className="text-6xl">🛡️</div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">CathShield.ai</h1>
          <p className="text-xl text-indigo-100">
            IV/Central Line Safety & Risk Monitoring
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="card mb-8 border-2 border-green-500 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔒</div>
            <div>
              <h2 className="text-lg font-bold text-green-900 mb-2">
                Privacy & Security
              </h2>
              <p className="text-green-800 leading-relaxed">
                <span className="font-semibold">
                  Patient privacy and information will be kept intact and used
                  solely for patient care and safety.
                </span>
                <br />
                <br />
                No patient names are stored or displayed. All data is
                encrypted, access-controlled, and audit-logged. Only authorized
                healthcare personnel can access patient information.
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "📷",
                title: "12-Hour Image Capture",
                desc: "Catheter site & traction module monitoring",
              },
              {
                icon: "📊",
                title: "CLISA Score Calculation",
                desc: "AI-powered risk assessment",
              },
              {
                icon: "📈",
                title: "Risk Trending",
                desc: "Visualize CLABSI risk over time",
              },
              {
                icon: "🔔",
                title: "Smart Alerts",
                desc: "Actionable clinical notifications",
              },
              {
                icon: "⚙️",
                title: "Traction Monitoring",
                desc: "Venous trauma risk detection",
              },
              {
                icon: "📋",
                title: "Ward Analytics",
                desc: "Hospital-wide HAI metrics & reporting",
              },
            ].map((feature, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl mb-1">{feature.icon}</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {feature.title}
                </p>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <button
          onClick={onEnter}
          className="btn-primary w-full py-4 text-lg font-bold shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          Enter CathShield.ai →
        </button>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-indigo-100 text-sm">
            Developed for Hospital Quality & Safety
          </p>
          <p className="text-indigo-200 text-xs mt-2">
            v1.0 • HIPAA Compliant • For Clinical Use Only
          </p>
        </div>
      </div>
    </div>
  );
}
