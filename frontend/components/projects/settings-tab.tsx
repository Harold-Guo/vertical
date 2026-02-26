"use client";

import { useEffect, useState } from "react";
import type { ProjectSettings } from "@/lib/types";
import { MetricCard } from "@/components/ui/metric-card";
import {
  Mail,
  Calendar,
  Database,
  MessageSquare,
  Phone,
  ClipboardList,
  AlertTriangle,
  Plus,
  Settings,
} from "lucide-react";

const appIcons: Record<string, React.ElementType> = {
  mail: Mail,
  calendar: Calendar,
  database: Database,
  "message-square": MessageSquare,
};

const skillIcons: Record<string, React.ElementType> = {
  phone: Phone,
  clipboard: ClipboardList,
  "alert-triangle": AlertTriangle,
  mail: Mail,
};

export function SettingsTab({ projectId }: { projectId: string }) {
  const [settings, setSettings] = useState<ProjectSettings | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${projectId}/settings`)
      .then((r) => r.json())
      .then(setSettings);
  }, [projectId]);

  if (!settings) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {settings.metrics.map((m, i) => (
          <MetricCard key={i} label={m.label} value={m.value} trend={m.trend} className="flex-1" />
        ))}
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          Project Settings
        </h2>
        <p className="text-sm text-text-muted">Manage connected apps and AI skills for this project</p>
      </div>

      <section className="rounded-xl border border-page-border bg-page-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Connected Apps</h3>
            <p className="text-xs text-text-muted">Integrations linked to this project</p>
          </div>
          <button className="inline-flex items-center gap-1.5 text-sm text-page-accent hover:underline">
            <Plus size={14} /> Add App
          </button>
        </div>
        <div className="divide-y divide-page-border">
          {settings.connectedApps.map((app) => {
            const Icon = appIcons[app.icon] || Settings;
            return (
              <div key={app.name} className="flex items-center gap-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-page/80">
                  <Icon size={16} className="text-text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{app.name}</div>
                  <div className="text-xs text-text-muted">{app.description}</div>
                </div>
                {app.connected ? (
                  <span className="text-xs font-medium text-page-success">Connected</span>
                ) : (
                  <button className="rounded-md bg-page-accent px-3 py-1.5 text-xs font-medium text-white">
                    Connect
                  </button>
                )}
                <button className="text-xs text-text-muted hover:text-text-secondary">
                  Disconnect
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-page-border bg-page-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">AI Skills</h3>
            <p className="text-xs text-text-muted">Configure AI analytics capabilities on recordings</p>
          </div>
          <button className="inline-flex items-center gap-1.5 text-sm text-page-accent hover:underline">
            <Settings size={14} /> Browse Skills
          </button>
        </div>
        <div className="divide-y divide-page-border">
          {settings.aiSkills.map((skill) => {
            const Icon = skillIcons[skill.icon] || Settings;
            return (
              <div key={skill.name} className="flex items-center gap-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-page/80">
                  <Icon size={16} className="text-text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{skill.name}</div>
                  <div className="text-xs text-text-muted">{skill.description}</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    defaultChecked={skill.enabled}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-page-border peer-checked:bg-page-accent transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
