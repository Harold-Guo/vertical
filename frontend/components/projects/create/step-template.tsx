"use client";

import type { ProjectTemplate } from "@/lib/types";
import {
  Briefcase,
  Headphones,
  Users,
  Settings,
} from "lucide-react";

const templateIcons: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  headphones: Headphones,
  users: Users,
};

const iconBgColors: Record<string, string> = {
  briefcase: "bg-[#F8E8E4]",
  headphones: "bg-[#E8F0F4]",
  users: "bg-[#EBF0E8]",
};

const iconTextColors: Record<string, string> = {
  briefcase: "text-page-accent",
  headphones: "text-[#5C7C8A]",
  users: "text-page-success",
};

export function StepTemplate({
  templates,
  onSelect,
  onScratch,
}: {
  templates: ProjectTemplate[];
  onSelect: (template: ProjectTemplate) => void;
  onScratch: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-center gap-5">
        {templates.map((t) => {
          const Icon = templateIcons[t.icon] || Settings;
          const isDisabled = !!t.comingSoon;

          return (
            <div
              key={t.id}
              className={`flex w-[280px] flex-col gap-4 rounded-xl border p-6 transition-all ${
                isDisabled
                  ? "cursor-default border-page-border bg-white opacity-50"
                  : "cursor-pointer border-page-border bg-white hover:border-page-accent hover:shadow-sm"
              }`}
              onClick={isDisabled ? undefined : () => onSelect(t)}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${
                    iconBgColors[t.icon] || "bg-page"
                  }`}
                >
                  <Icon
                    size={22}
                    className={iconTextColors[t.icon] || "text-text-secondary"}
                  />
                </div>
                {t.badge && (
                  <span className="rounded-[10px] bg-page-accent px-2.5 py-1 text-[11px] font-semibold text-white">
                    {t.badge}
                  </span>
                )}
              </div>
              <div className="text-lg font-bold font-heading text-text-primary">
                {t.name}
              </div>
              <p className="text-[13px] leading-relaxed text-text-secondary">
                {t.description}
              </p>
              {!isDisabled && t.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {t.skills.slice(0, 2).map((s) => (
                    <span
                      key={s.name}
                      className="rounded-[10px] bg-page px-2 py-1 text-[11px] font-medium text-text-secondary"
                    >
                      {s.name}
                    </span>
                  ))}
                  {t.skills.length > 2 && (
                    <span className="rounded-[10px] bg-page px-2 py-1 text-[11px] font-medium text-text-muted">
                      +{t.skills.length - 2} more
                    </span>
                  )}
                </div>
              )}
              {isDisabled ? (
                <span className="w-fit rounded-[10px] bg-page px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                  Coming Soon
                </span>
              ) : (
                <button className="w-full rounded-md bg-page-accent py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-page-accent-light">
                  SELECT TEMPLATE
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={onScratch}
        className="text-[13px] font-medium text-page-accent hover:underline"
      >
        or start from scratch
      </button>
    </div>
  );
}
