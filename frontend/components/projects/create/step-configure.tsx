"use client";

import type { AiSkill, ConnectedApp } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  ClipboardList,
  AlertTriangle,
  Mail,
  Calendar,
  Database,
  MessageSquare,
  Settings,
} from "lucide-react";

const skillIcons: Record<string, React.ElementType> = {
  phone: Phone,
  clipboard: ClipboardList,
  "alert-triangle": AlertTriangle,
  mail: Mail,
};

const appIcons: Record<string, React.ElementType> = {
  mail: Mail,
  calendar: Calendar,
  database: Database,
  "message-square": MessageSquare,
};

export function StepConfigure({
  skills,
  apps,
  customPrompt,
  onToggleSkill,
  onToggleApp,
  onChangePrompt,
  onBack,
  onNext,
}: {
  skills: AiSkill[];
  apps: ConnectedApp[];
  customPrompt: string;
  onToggleSkill: (name: string) => void;
  onToggleApp: (name: string) => void;
  onChangePrompt: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-6">
        {/* Skills column */}
        <div className="flex-1 rounded-xl border border-page-border bg-white p-6">
          <div className="mb-4">
            <h3 className="font-heading text-base font-bold text-text-primary">
              AI Skills
            </h3>
            <p className="text-xs text-text-muted">
              Configure AI analytics on recordings
            </p>
          </div>
          <div className="divide-y divide-page-border">
            {skills.map((skill) => {
              const Icon = skillIcons[skill.icon] || Settings;
              return (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-page">
                    <Icon size={16} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-text-primary">
                      {skill.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      {skill.description}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleSkill(skill.name)}
                    className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
                      skill.enabled ? "bg-page-accent" : "bg-page-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-transform ${
                        skill.enabled ? "translate-x-[20px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Apps column */}
        <div className="flex-1 rounded-xl border border-page-border bg-white p-6">
          <div className="mb-4">
            <h3 className="font-heading text-base font-bold text-text-primary">
              Connected Apps
            </h3>
            <p className="text-xs text-text-muted">
              Integrations linked to this project
            </p>
          </div>
          <div className="divide-y divide-page-border">
            {apps.map((app) => {
              const Icon = appIcons[app.icon] || Settings;
              return (
                <div
                  key={app.name}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-page">
                    <Icon size={16} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-text-primary">
                      {app.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      {app.description}
                    </div>
                  </div>
                  {app.connected ? (
                    <span
                      onClick={() => onToggleApp(app.name)}
                      className="cursor-pointer text-xs font-semibold text-page-success"
                    >
                      Connected
                    </span>
                  ) : (
                    <button
                      onClick={() => onToggleApp(app.name)}
                      className="rounded-md bg-page-accent px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white"
                    >
                      CONNECT
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom instructions */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-primary">
          Custom Instructions (optional)
        </label>
        <textarea
          placeholder="Add custom instructions for how recordings should be processed..."
          value={customPrompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-page-border bg-white px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md bg-page-card px-4 py-2.5 text-[13px] font-semibold tracking-wide text-text-primary transition-colors hover:bg-page-border"
        >
          <ArrowLeft size={14} /> BACK
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-md bg-dark-sidebar px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-dark-surface"
        >
          NEXT <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
