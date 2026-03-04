import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { ProjectsTable } from "@/components/projects/projects-table";
import { Search, Plus } from "lucide-react";

export default async function ProjectsPage() {
  const data = await api.getProjects();

  return (
    <div className="flex flex-col gap-6 px-12 py-10">
      <PageHeader
        title="Projects"
        subtitle={`${data.metrics.activeDeals} active deals · $2.1M total pipeline`}
      />

      <div className="flex gap-4">
        <MetricCard label="Total Pipeline" value={data.metrics.totalPipeline} trend="+14.5%" className="flex-1" />
        <MetricCard label="Active Deals" value={data.metrics.activeDeals} className="flex-1" />
        <MetricCard label="At Risk" value={data.metrics.atRisk} className="flex-1" />
        <MetricCard label="Forecast EV" value={data.metrics.forecastEv} className="flex-1" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-lg border border-page-border bg-white py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
          />
        </div>
        <button className="rounded-md bg-page-card px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-page-border transition-colors">
          All Deals
        </button>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-dark-sidebar px-4 py-2.5 text-sm font-medium text-text-light hover:bg-dark-surface transition-colors"
        >
          <Plus size={14} />
          New Project
        </Link>
      </div>

      <ProjectsTable projects={data.projects} pagination={data.pagination} />
    </div>
  );
}
