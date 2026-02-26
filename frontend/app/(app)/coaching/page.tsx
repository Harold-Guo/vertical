import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { ObjectionCard } from "@/components/coaching/objection-card";
import { Filter } from "lucide-react";

export default async function CoachingPage() {
  const data = await api.getCoaching();

  return (
    <div className="flex flex-col gap-8 px-12 py-10">
      <PageHeader title="Sales Coaching" subtitle="Improve your selling skills with AI-powered feedback">
        <button className="inline-flex items-center gap-2 rounded-md bg-page-card px-4 py-2.5 text-sm text-text-secondary hover:bg-page-border transition-colors">
          <Filter size={14} />
          Filter
        </button>
      </PageHeader>

      <div className="flex gap-4">
        <MetricCard label="Overall Score" value={data.totalScore} trend={data.scoreTrend} className="flex-1" />
        <MetricCard label="Calls Analyzed" value={data.callsAnalyzed} trend={data.callsTrend} className="flex-1" />
        <MetricCard label="Top Strength" value={data.topStrength} trend={data.topStrengthDetail} className="flex-1" />
        <MetricCard label="Focus Area" value={data.focusArea} trend={data.focusAreaDetail} className="flex-1" />
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold text-text-primary">
          Objection Handling
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {data.objections.map((objection) => (
          <ObjectionCard key={objection.title} objection={objection} />
        ))}
      </div>
    </div>
  );
}
