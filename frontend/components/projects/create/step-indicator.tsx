"use client";

import { Check } from "lucide-react";

const STEPS = ["Template", "Details", "Configure", "Review"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 pt-3">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isComplete = step < current;
        const isActive = step === current;

        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-0.5 w-10 ${
                  isComplete || isActive ? "bg-page-accent" : "bg-page-border"
                }`}
              />
            )}
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                isComplete || isActive
                  ? "bg-page-accent text-white"
                  : "bg-page-card text-text-muted"
              }`}
            >
              {isComplete ? <Check size={14} /> : step}
            </div>
          </div>
        );
      })}
    </div>
  );
}
