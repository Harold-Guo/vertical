"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Recording } from "@/lib/types";
import { Search, Upload, Mic, Clock, Users } from "lucide-react";

export function RecordingsTab({ projectId }: { projectId: string }) {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${projectId}/recordings`)
      .then((r) => r.json())
      .then((d) => setRecordings(d.recordings));
  }, [projectId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search recordings..."
            className="w-full rounded-lg border border-page-border bg-white py-2.5 pl-9 pr-4 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-page-accent/20"
          />
        </div>
        <button className="rounded-md bg-page-card px-3 py-2.5 text-sm text-text-secondary">
          Sort by: Date ↓
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-page-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-page-accent-light transition-colors">
          <Upload size={14} />
          Upload Recording
        </button>
      </div>

      <p className="text-xs text-text-muted uppercase tracking-wider">
        Recent recordings from sessions
      </p>

      <div className="rounded-xl border border-page-border bg-page-card divide-y divide-page-border">
        {recordings.map((rec) => (
          <Link
            key={rec.id}
            href={`/projects/${projectId}/recordings/${rec.id}`}
            className="flex items-center gap-4 px-5 py-4 hover:bg-page/50 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-page-accent/10">
              <Mic size={16} className="text-page-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary">{rec.title}</div>
              <div className="text-xs text-text-muted">{rec.subtitle}</div>
            </div>
            <div className="text-right text-xs text-text-muted">
              <div>{rec.date}</div>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {rec.duration}
              </span>
              {rec.participants && (
                <span className="inline-flex items-center gap-1">
                  <Users size={12} /> {rec.participants}
                </span>
              )}
            </div>
            {rec.score && (
              <div className="text-sm font-medium text-page-accent">{rec.score}</div>
            )}
          </Link>
        ))}
      </div>

      <div className="text-xs text-text-muted">
        Showing 1-{recordings.length} of {recordings.length} recordings
      </div>
    </div>
  );
}
