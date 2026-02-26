import Link from "next/link";
import type { InboxRecording } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronLeft, ChevronRight, Mic } from "lucide-react";

interface InboxTableProps {
  recordings: InboxRecording[];
  pagination: { page: number; totalPages: number };
}

export function InboxTable({ recordings, pagination }: InboxTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-page-border bg-page-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-page-border text-xs font-medium uppercase tracking-wider text-text-muted">
            <th className="px-5 py-3 text-left">Recording</th>
            <th className="px-5 py-3 text-left">Duration</th>
            <th className="px-5 py-3 text-left">Filed To</th>
            <th className="px-5 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {recordings.map((rec) => (
            <tr
              key={rec.id}
              className="border-b border-page-border last:border-0 hover:bg-page/50 transition-colors"
            >
              <td className="px-5 py-4">
                <Link href={`/inbox/${rec.id}`} className="flex items-center gap-3 hover:underline">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-page-accent/10">
                    <Mic size={14} className="text-page-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{rec.title}</div>
                    <div className="text-xs text-text-muted">{rec.subtitle}</div>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-4 text-text-secondary">{rec.duration}</td>
              <td className="px-5 py-4">
                <StatusBadge
                  status={rec.status === "assigned" ? "closing" : rec.status}
                  label={rec.assignedTo}
                />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={rec.status} />
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
            1
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
