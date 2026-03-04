"use client";

import type { AiSkill, ConnectedApp } from "@/lib/types";
import type { ProjectDetails } from "./step-details";
import {
  ArrowLeft,
  Phone,
  ClipboardList,
  AlertTriangle,
  Mail,
  Settings,
  Loader2,
} from "lucide-react";

const skillIcons: Record<string, React.ElementType> = {
  phone: Phone,
  clipboard: ClipboardList,
  "alert-triangle": AlertTriangle,
  mail: Mail,
};

export function StepReview({
  details,
  skills,
  apps,
  submitting,
  onBack,
  onCreate,
}: {
  details: ProjectDetails;
  skills: AiSkill[];
  apps: ConnectedApp[];
  submitting: boolean;
  onBack: () => void;
  onCreate: () => void;
}) {
  const enabledSkills = skills.filter((s) => s.enabled);
  const connectedApps = apps.filter((a) => a.connected);
  const disconnectedApps = apps.filter((a) => !a.connected);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-[640px] rounded-xl border border-page-border bg-white p-8">
        <div className="flex flex-col gap-6">
          {/* Project info */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-base font-bold text-text-primary">
              Project Information
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoItem label="Project Name" value={details.name} />
              <InfoItem label="Company" value={details.company} />
              <InfoItem
                label="Deal Stage"
                value={
                  details.status.charAt(0).toUpperCase() +
                  details.status.slice(1)
                }
              />
              <InfoItem
                label="Deal Value"
                value={details.dealValue ? `$${details.dealValue}` : "—"}
              />
            </div>
          </div>

          <hr className="border-page-border" />

          {/* Skills */}
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-base font-bold text-text-primary">
              AI Skills ({enabledSkills.length} enabled)
            </h3>
            <div className="flex flex-wrap gap-2">
              {enabledSkills.map((s) => {
                const Icon = skillIcons[s.icon] || Settings;
                return (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1.5 rounded-md bg-page px-3 py-1.5 text-xs font-medium text-text-secondary"
                  >
                    <Icon size={14} />
                    {s.name}
                  </span>
                );
              })}
            </div>
          </div>

          <hr className="border-page-border" />

          {/* Apps */}
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-base font-bold text-text-primary">
              Connected Apps ({connectedApps.length} of {apps.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {connectedApps.map((a) => (
                <span
                  key={a.name}
                  className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-page-success"
                >
                  {a.name}
                </span>
              ))}
              {disconnectedApps.map((a) => (
                <span
                  key={a.name}
                  className="rounded-md bg-page px-3 py-1.5 text-xs font-medium text-text-muted"
                >
                  {a.name} (not connected)
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[640px] justify-end gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-page-card px-4 py-2.5 text-[13px] font-semibold tracking-wide text-text-primary transition-colors hover:bg-page-border disabled:opacity-40"
        >
          <ArrowLeft size={14} /> BACK
        </button>
        <button
          onClick={onCreate}
          disabled={submitting}
          className="inline-flex w-[200px] items-center justify-center gap-2 rounded-md bg-page-accent px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-page-accent-light disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "CREATE PROJECT"
          )}
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  );
}
