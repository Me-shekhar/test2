"use client";

import React, { useState, useRef } from "react";

interface ImageCaptureData {
  catheter_site?: string;
  traction_module?: string;
  notes: string;
}

interface Props {
  onCaptureComplete: (data: ImageCaptureData) => void;
  loading?: boolean;
}

export default function ImageCaptureScreen({
  onCaptureComplete,
  loading = false,
}: Props) {
  const [nightMode, setNightMode] = useState(false);
  const [capturedImages, setCapturedImages] = useState<ImageCaptureData>({
    notes: "",
  });
  const [notes, setNotes] = useState("");
  const catheterInputRef = useRef<HTMLInputElement>(null);
  const tractionInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (
    type: "catheter_site" | "traction_module",
    file: File
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImages((prev) => ({
        ...prev,
        [type]: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "catheter_site" | "traction_module"
  ) => {
    if (e.target.files?.[0]) {
      handleImageCapture(type, e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImages.catheter_site || !capturedImages.traction_module) {
      alert("Please capture both catheter site and traction module images");
      return;
    }
    onCaptureComplete({ ...capturedImages, notes });
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 transition-colors ${
        nightMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-orange-50 to-amber-100"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`card ${nightMode ? "bg-gray-800 border-gray-700" : ""}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                nightMode ? "text-gray-100" : "text-gray-800"
              }`}>
                Image Capture - 12-Hour Checkpoint
              </h1>
              <p className={nightMode ? "text-gray-400" : "text-gray-600"}>
                Capture catheter site and traction module images
              </p>
            </div>
            <label
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                nightMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                checked={nightMode}
                onChange={(e) => setNightMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`ml-2 font-semibold ${
                nightMode ? "text-gray-100" : "text-gray-700"
              }`}>
                Night Mode
              </span>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Catheter Site Image */}
            <div
              className={`p-6 border-2 border-dashed rounded-lg ${
                nightMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-blue-300 bg-blue-50"
              }`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${
                nightMode ? "text-gray-100" : "text-gray-800"
              }`}>
                📸 Catheter Site Image
              </h2>
              <p className={`text-sm mb-4 ${
                nightMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Capture the IV/central line insertion site for dressing assessment
              </p>

              {capturedImages.catheter_site ? (
                <div className="mb-4">
                  <img
                    src={capturedImages.catheter_site}
                    alt="Catheter site"
                    className="max-w-sm rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => catheterInputRef.current?.click()}
                    className="btn-secondary mt-3"
                  >
                    Retake Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => catheterInputRef.current?.click()}
                  className={`w-full py-4 rounded-lg font-semibold ${
                    nightMode
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } transition`}
                >
                  📷 Capture Catheter Site
                </button>
              )}

              <input
                ref={catheterInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileInput(e, "catheter_site")}
                className="hidden"
              />
            </div>

            {/* Traction Module Image */}
            <div
              className={`p-6 border-2 border-dashed rounded-lg ${
                nightMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-green-300 bg-green-50"
              }`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${
                nightMode ? "text-gray-100" : "text-gray-800"
              }`}>
                📸 Traction Module Image
              </h2>
              <p className={`text-sm mb-4 ${
                nightMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Capture the external safety device (traction module)
              </p>

              {capturedImages.traction_module ? (
                <div className="mb-4">
                  <img
                    src={capturedImages.traction_module}
                    alt="Traction module"
                    className="max-w-sm rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => tractionInputRef.current?.click()}
                    className="btn-secondary mt-3"
                  >
                    Retake Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => tractionInputRef.current?.click()}
                  className={`w-full py-4 rounded-lg font-semibold ${
                    nightMode
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } transition`}
                >
                  📷 Capture Traction Module
                </button>
              )}

              <input
                ref={tractionInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileInput(e, "traction_module")}
                className="hidden"
              />
            </div>

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                nightMode ? "text-gray-200" : "text-gray-700"
              }`}>
                Observations / Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., slight redness, moisture visible, device functioning normally..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  nightMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "border-gray-300"
                }`}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !capturedImages.catheter_site ||
                !capturedImages.traction_module
              }
              className="btn-primary w-full"
            >
              {loading ? "Processing..." : "✓ Complete Image Capture"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
