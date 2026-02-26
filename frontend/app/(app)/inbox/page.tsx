import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { InboxTable } from "@/components/inbox/inbox-table";
import { Search, Upload } from "lucide-react";

export default async function InboxPage() {
  const data = await api.getInbox();

  return (
    <div className="flex flex-col gap-6 px-12 py-10">
      <PageHeader
        title="Inbox"
        subtitle="Manage and organize your recordings"
      />

      <div className="flex gap-4">
        <MetricCard label="Recordings" value={data.metrics.recordingsCount} className="flex-1" />
        <MetricCard label="This Week" value={data.metrics.thisWeek} className="flex-1" />
        <MetricCard label="Avg Duration" value={data.metrics.avgDuration} className="flex-1" />
        <MetricCard label="Processing" value={data.metrics.processing} className="flex-1" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search recordings..."
            className="w-full rounded-lg border border-page-border bg-white py-2.5 pl-9 pr-4 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-page-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-page-accent-light transition-colors">
          <Upload size={14} />
          Upload Recording
        </button>
      </div>

      <InboxTable recordings={data.recordings} pagination={data.pagination} />
    </div>
  );
}
