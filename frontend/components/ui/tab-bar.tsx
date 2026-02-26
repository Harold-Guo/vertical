"use client";

import Link from "next/link";

interface Tab {
  label: string;
  value: string;
  href?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange?: (value: string) => void;
  basePath?: string;
}

export function TabBar({ tabs, activeTab, onChange, basePath }: TabBarProps) {
  return (
    <div className="flex gap-0 border-b border-page-border">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        const className = `px-4 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "border-b-2 border-page-accent text-text-primary"
            : "text-text-muted hover:text-text-secondary"
        }`;

        if (basePath || tab.href) {
          const href = tab.href || `${basePath}?tab=${tab.value}`;
          return (
            <Link key={tab.value} href={href} className={className}>
              {tab.label}
            </Link>
          );
        }

        return (
          <button
            key={tab.value}
            onClick={() => onChange?.(tab.value)}
            className={className}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
