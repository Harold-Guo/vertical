"use client";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

const STAGES = ["discovery", "demo", "proposal", "negotiation", "closing"] as const;

export interface ProjectDetails {
  name: string;
  company: string;
  status: string;
  dealValue: string;
  description: string;
}

export function StepDetails({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: ProjectDetails;
  onChange: (d: ProjectDetails) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const isValid = data.name.trim() !== "" && data.company.trim() !== "";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-[560px] rounded-xl border border-page-border bg-white p-8">
        <div className="flex flex-col gap-5">
          <Field label="Project Name *">
            <input
              type="text"
              placeholder="e.g. Acme Corp Enterprise Deal"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className="w-full rounded-md border border-page-border bg-white px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
            />
          </Field>

          <Field label="Company *">
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={data.company}
              onChange={(e) => onChange({ ...data, company: e.target.value })}
              className="w-full rounded-md border border-page-border bg-white px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
            />
          </Field>

          <div className="flex gap-4">
            <Field label="Deal Stage" className="flex-1">
              <div className="relative">
                <select
                  value={data.status}
                  onChange={(e) => onChange({ ...data, status: e.target.value })}
                  className="w-full appearance-none rounded-md border border-page-border bg-white px-3 py-2.5 pr-8 text-[13px] text-text-primary focus:outline-none focus:ring-2 focus:ring-page-accent/20 capitalize"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
              </div>
            </Field>
            <Field label="Deal Value" className="flex-1">
              <input
                type="text"
                placeholder="$0"
                value={data.dealValue}
                onChange={(e) =>
                  onChange({ ...data, dealValue: e.target.value })
                }
                className="w-full rounded-md border border-page-border bg-white px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
              />
            </Field>
          </div>

          <Field label="Description (optional)">
            <textarea
              placeholder="Brief description of this project..."
              value={data.description}
              onChange={(e) =>
                onChange({ ...data, description: e.target.value })
              }
              rows={3}
              className="w-full resize-none rounded-md border border-page-border bg-white px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-md bg-page-card px-4 py-2.5 text-[13px] font-semibold tracking-wide text-text-primary transition-colors hover:bg-page-border"
            >
              <ArrowLeft size={14} /> BACK
            </button>
            <button
              onClick={onNext}
              disabled={!isValid}
              className="inline-flex items-center gap-2 rounded-md bg-dark-sidebar px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-dark-surface disabled:opacity-40"
            >
              NEXT <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      <label className="text-[13px] font-semibold text-text-primary">
        {label}
      </label>
      {children}
    </div>
  );
}
