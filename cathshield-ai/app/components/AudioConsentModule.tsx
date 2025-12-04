"use client";

import React, { useState, useRef } from "react";

interface Props {
  onConsentSubmitted: (language: string) => void;
  loading?: boolean;
}

export default function AudioConsentModule({
  onConsentSubmitted,
  loading = false,
}: Props) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "kannada" | null>(null);
  const englishAudioRef = useRef<HTMLAudioElement>(null);
  const kannadaAudioRef = useRef<HTMLAudioElement>(null);

  const englishConsentText =
    "For your safety, we will take a picture of the IV site. The photo will be used only for safety documentation and will remain completely private. We are also placing a small safety device to protect your IV line. If the device beeps or the light turns on, please don't worry — it only reminds us to check the line. You are not doing anything wrong; our only aim is to keep your vein safe.";

  const kannadaConsentText =
    "ನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ, ನಾವು IV ಸೈಟ್‌ನ ಚಿತ್ರವನ್ನು ತೆಗೆಯುತ್ತೇವೆ. ಆ ಫೋಟೋವನ್ನು ಸುರಕ್ಷತೆ ಡಾಕ್ಯುಮೆಂಟೇಶನ್‌ಗಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ ಮತ್ತು ಸಂಪೂರ್ಣವಾಗಿ ಖಾಸಗಿ ಉಳಿಯುತ್ತದೆ.";

  const playEnglishAudio = () => {
    if (englishAudioRef.current) {
      englishAudioRef.current.play();
    }
    setSelectedLanguage("english");
  };

  const playKannadaAudio = () => {
    if (kannadaAudioRef.current) {
      kannadaAudioRef.current.play();
    }
    setSelectedLanguage("kannada");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven || !selectedLanguage) {
      alert("Please listen to consent audio and confirm checkbox");
      return;
    }
    onConsentSubmitted(selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Patient Consent
          </h1>
          <p className="text-gray-600 mb-8">
            Audio consent in patient's preferred language
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* English Consent */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">
                English Consent
              </h2>
              <p className="text-gray-600 text-sm italic">
                {englishConsentText}
              </p>
              <button
                type="button"
                onClick={playEnglishAudio}
                className="btn-secondary w-full"
              >
                🔊 Play English Audio
              </button>
              <audio
                ref={englishAudioRef}
                src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
              />
            </div>

            {/* Kannada Consent */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">
                ಕನ್ನಡ (Kannada) Consent
              </h2>
              <p className="text-gray-600 text-sm italic">
                {kannadaConsentText}
              </p>
              <button
                type="button"
                onClick={playKannadaAudio}
                className="btn-secondary w-full"
              >
                🔊 Play Kannada Audio
              </button>
              <audio
                ref={kannadaAudioRef}
                src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
              />
            </div>

            {/* Consent Checkbox */}
            <div className="border-t pt-6">
              <label className="flex items-start p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded"
                />
                <span className="ml-3 text-gray-700">
                  <span className="font-semibold">
                    I have explained and obtained patient / guardian consent.
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    By checking this box, you confirm that the patient or guardian
                    has heard and understood the consent audio in their preferred
                    language.
                  </p>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !consentGiven}
              className="btn-primary w-full"
            >
              {loading ? "Processing..." : "Proceed to Image Capture"}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Privacy & Safety Notice:</span>
              <br />
              Patient privacy and information will be kept intact and used solely
              for patient care and safety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
