import { api } from "@/lib/api";
import { BackLink } from "@/components/ui/back-link";
import { TranscriptPanel } from "@/components/inbox/transcript-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { Users, Clock, ArrowRight } from "lucide-react";

export default async function InboxRecordingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recording = await api.getInboxRecording(id);

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <BackLink href="/inbox" label="Inbox" />

      <div className="flex items-start justify-between border-b border-page-border pb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            {recording.title}
          </h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-text-muted">
            <span>{recording.date}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {recording.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {recording.participants} participants
            </span>
          </div>
        </div>
        {recording.assignedProject && (
          <button className="inline-flex items-center gap-2 rounded-lg bg-page-accent px-4 py-2 text-sm font-medium text-white hover:bg-page-accent-light transition-colors">
            <ArrowRight size={14} />
            Assign to: {recording.assignedProject}
          </button>
        )}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text-primary">
              Executive Summary
            </h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {recording.summary}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text-primary">
              Key Discussion Points
            </h2>
            <div className="space-y-2">
              {recording.keyPoints.map((point, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-page-card px-4 py-3">
                  <span className="text-sm text-text-secondary">{point.text}</span>
                  <StatusBadge status={point.tag.toLowerCase()} label={point.tag} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text-primary">
              Next Steps
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {recording.nextSteps}
            </p>
          </section>
        </div>

        <TranscriptPanel transcript={recording.transcript} />
      </div>
    </div>
  );
}
