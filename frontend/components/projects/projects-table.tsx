import Link from "next/link";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectsTableProps {
  projects: Project[];
  pagination: { page: number; totalPages: number };
}

export function ProjectsTable({ projects, pagination }: ProjectsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-page-border bg-page-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-page-border text-xs font-medium uppercase tracking-wider text-text-muted">
            <th className="px-5 py-3 text-left">Company</th>
            <th className="px-5 py-3 text-left">Status</th>
            <th className="px-5 py-3 text-left">Reps</th>
            <th className="px-5 py-3 text-left">AI Insight</th>
            <th className="px-5 py-3 text-left">Activity</th>
            <th className="px-5 py-3 text-right">Forecast</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-b border-page-border last:border-0 hover:bg-page/50 transition-colors"
            >
              <td className="px-5 py-4">
                <Link href={`/projects/${project.id}`} className="hover:underline">
                  <div className="font-medium text-text-primary">{project.company}</div>
                  <div className="text-xs text-text-muted">{project.subtitle}</div>
                </Link>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={project.status} />
              </td>
              <td className="px-5 py-4 text-text-secondary">{project.reps}</td>
              <td className="px-5 py-4 text-text-secondary">{project.aiInsight}</td>
              <td className="px-5 py-4 text-text-secondary">{project.activity}</td>
              <td className="px-5 py-4 text-right font-medium text-text-primary">
                ${project.forecast.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-page-border px-5 py-3">
        <span className="text-xs text-text-muted">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <div className="flex gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded bg-page-accent text-white text-xs">
            {pagination.page}
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded text-xs text-text-muted hover:bg-page-border">
            {pagination.page + 1}
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:bg-page-border">
            <ChevronLeft size={12} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:bg-page-border">
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
