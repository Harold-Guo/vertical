import type { ProjectDetail } from "@/lib/types";
import { Users, Lightbulb, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";

export function OverviewTab({ detail }: { detail: ProjectDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-lg font-semibold text-text-primary">
        Client Intelligence
        <span className="ml-2 text-sm font-normal text-text-muted">
          from {detail.recordings} recordings · {detail.calls} calls
        </span>
      </h2>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <section className="rounded-xl border border-page-border bg-page-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users size={16} className="text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-primary">Key Contacts</h3>
              <ChevronRight size={14} className="text-text-muted" />
            </div>
            <div className="flex gap-4">
              {detail.contacts.map((contact) => (
                <div
                  key={contact.name}
                  className="flex items-center gap-3 rounded-lg bg-page/80 px-4 py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-page-border text-xs font-medium text-text-secondary">
                    {contact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{contact.name}</div>
                    <div className="text-xs text-text-muted">{contact.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-page-border bg-page-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-primary">Key Insights</h3>
              <ChevronRight size={14} className="text-text-muted" />
            </div>
            <div className="space-y-3">
              {detail.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-page-accent" />
                  <p className="text-sm text-text-secondary">{insight.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-page-border bg-page-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-primary">Risk Signals</h3>
              <ChevronRight size={14} className="text-text-muted" />
            </div>
            <div className="space-y-3">
              {detail.riskSignals.map((signal, i) => (
                <div key={i} className="flex items-start gap-3">
                  {signal.status === "resolved" ? (
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-page-success" />
                  ) : (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-page-warning" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-primary">{signal.label}</div>
                    <div className="text-xs text-text-muted">{signal.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
