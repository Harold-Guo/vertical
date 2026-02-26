import { api } from "@/lib/api";
import { BackLink } from "@/components/ui/back-link";
import { TranscriptPanel } from "@/components/inbox/transcript-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, Users, AlertTriangle } from "lucide-react";

export default async function RecordingAnalysisPage({
  params,
}: {
  params: Promise<{ id: string; rid: string }>;
}) {
  const { id, rid } = await params;
  const analysis = await api.getRecordingAnalysis(rid);

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <BackLink href={`/projects/${id}?tab=recordings`} label="Acme Corp Enterprise Deal" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          {analysis.title}
        </h1>
        <div className="mt-1 flex items-center gap-4 text-sm text-text-muted">
          <span>{analysis.date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {analysis.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={12} /> {analysis.participants} participants
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex gap-4">
          <div className="flex-1 rounded-xl border border-page-border bg-page-card p-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
              Talk Ratio
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-20 text-xs text-text-secondary">Rep (You)</span>
                <div className="flex-1 h-3 rounded-full bg-page-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-page-accent"
                    style={{ width: `${analysis.talkRatio.rep}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-primary">{analysis.talkRatio.rep}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-xs text-text-secondary">Customer</span>
                <div className="flex-1 h-3 rounded-full bg-page-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-page-success"
                    style={{ width: `${analysis.talkRatio.customer}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-primary">{analysis.talkRatio.customer}%</span>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-page-border bg-page-card p-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
              Key Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keyTopics.map((topic) => (
                <span
                  key={topic.label}
                  className="inline-flex items-center gap-1 rounded-md bg-page/80 px-2.5 py-1 text-xs text-text-secondary"
                >
                  {topic.label}
                  {topic.percentage && (
                    <span className="font-medium text-text-primary">{topic.percentage}%</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text-primary">
              Recording Analysis
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {analysis.analysis}
            </p>
          </section>

          <section className="rounded-xl border border-page-border bg-page-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">Call Performance</h3>
              <span className="font-heading text-2xl font-bold text-page-accent">{analysis.callScore}</span>
            </div>
            <div className="space-y-3">
              {analysis.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center gap-3">
                  <span className="w-36 text-xs text-text-secondary">{metric.label}</span>
                  <span className="w-12 text-xs text-text-muted">{metric.value}</span>
                  <div className="flex-1 h-2 rounded-full bg-page-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-page-accent"
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-text-primary">{metric.score}%</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text-primary">
              Risk Signals
            </h2>
            <div className="space-y-2">
              {analysis.riskSignals.map((signal, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-page-card px-4 py-3">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-page-warning" />
                  <span className="text-sm text-text-secondary">{signal}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text-primary">
              Key Discussion Points
            </h2>
            <div className="space-y-2">
              {analysis.keyDiscussionPoints.map((point, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-page-card px-4 py-3">
                  <span className="text-sm text-text-secondary">{point.text}</span>
                  <StatusBadge status={point.tag.toLowerCase()} label={point.tag} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <TranscriptPanel transcript={analysis.transcript} />
      </div>
    </div>
  );
}
