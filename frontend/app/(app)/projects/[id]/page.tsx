import { api } from "@/lib/api";
import { BackLink } from "@/components/ui/back-link";
import { MetricCard } from "@/components/ui/metric-card";
import { TabBar } from "@/components/ui/tab-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { OverviewTab } from "@/components/projects/overview-tab";
import { MeddicTab } from "@/components/projects/meddic-tab";
import { TodoTab } from "@/components/projects/todo-tab";
import { RecordingsTab } from "@/components/projects/recordings-tab";
import { SettingsTab } from "@/components/projects/settings-tab";
import { GitFork, Settings } from "lucide-react";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "MEDDIC", value: "meddic" },
  { label: "Recordings", value: "recordings" },
  { label: "TODO", value: "todo" },
  { label: "Settings", value: "settings" },
];

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "overview" } = await searchParams;
  const detail = await api.getProjectDetail(id);

  return (
    <div className="flex flex-col gap-6 px-12 py-10">
      <BackLink href="/projects" label="Back to Projects" />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            {detail.company}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              ${detail.dealValue.toLocaleString()}
            </span>
            <StatusBadge status={detail.status.toLowerCase()} label={detail.status} />
            <span className="text-sm text-text-muted">
              {detail.recordings} Recordings
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md bg-page-card px-3 py-2 text-sm text-text-secondary hover:bg-page-border transition-colors">
            <GitFork size={14} />
            AI Chat
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-page-card px-3 py-2 text-sm text-text-secondary hover:bg-page-border transition-colors">
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <MetricCard
          label="Deal Value"
          value={`$${detail.dealValue.toLocaleString()}`}
          trend="+$2K"
          className="flex-1"
        />
        <MetricCard
          label="Calls"
          value={detail.calls}
          trend={detail.callsSummary}
          className="flex-1"
        />
        <MetricCard
          label="MEDDIC Score"
          value={`${detail.meddicScore}%`}
          trend={detail.meddicTrend}
          className="flex-1"
        />
        <MetricCard
          label="Risk Level"
          value={detail.riskLevel}
          trend={detail.riskTrend}
          className="flex-1"
        />
      </div>

      <TabBar
        tabs={TABS}
        activeTab={tab}
        basePath={`/projects/${id}`}
      />

      {tab === "overview" && <OverviewTab detail={detail} />}
      {tab === "meddic" && <MeddicTab projectId={id} />}
      {tab === "todo" && <TodoTab projectId={id} />}
      {tab === "recordings" && <RecordingsTab projectId={id} />}
      {tab === "settings" && <SettingsTab projectId={id} />}
    </div>
  );
}
