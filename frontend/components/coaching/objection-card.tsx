import type { ObjectionCard as ObjectionCardType } from "@/lib/types";
import { CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";

export function ObjectionCard({ objection }: { objection: ObjectionCardType }) {
  return (
    <div className="rounded-xl border border-page-border bg-page-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-page-accent/10">
            <MessageCircle size={16} className="text-page-accent" />
          </div>
          <h3 className="font-heading text-base font-semibold text-text-primary">
            {objection.title}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-text-muted">Score: </span>
          <span className="font-heading text-lg font-bold text-text-primary">
            {objection.score}
          </span>
          <span className="text-xs text-text-muted">/100</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-1.5">
            <CheckCircle size={12} className="text-page-success" />
            <span className="text-xs font-medium text-page-success">Strengths</span>
          </div>
          <p className="text-sm text-text-secondary">{objection.strengths}</p>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-page-warning" />
            <span className="text-xs font-medium text-page-warning">Areas to Improve</span>
          </div>
          <p className="text-sm text-text-secondary">{objection.areasToImprove}</p>
        </div>
      </div>

      {objection.practicePrompt && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-page/80 px-4 py-3">
          <p className="text-sm text-text-secondary">{objection.practicePrompt}</p>
          <button className="ml-4 shrink-0 rounded-md bg-page-accent px-4 py-2 text-sm font-medium text-white hover:bg-page-accent-light transition-colors">
            Start Practice
          </button>
        </div>
      )}
    </div>
  );
}
