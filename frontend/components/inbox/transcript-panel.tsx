import type { TranscriptEntry } from "@/lib/types";

const speakerColors: Record<string, string> = {
  "John Dialed": "bg-page-accent",
  "Sarah (VP)": "bg-page-info",
  "James Chen": "bg-page-success",
  "Mike (CTO)": "bg-page-accent",
};

export function TranscriptPanel({
  transcript,
}: {
  transcript: TranscriptEntry[];
}) {
  return (
    <div className="w-[340px] shrink-0 rounded-xl border border-page-border bg-page-card">
      <div className="flex items-center gap-2 border-b border-page-border px-5 py-3">
        <div className="h-2 w-2 rounded-full bg-page-accent" />
        <h3 className="text-sm font-semibold text-text-primary">Transcript</h3>
      </div>
      <div className="max-h-[600px] overflow-auto p-4 space-y-4">
        {transcript.map((entry, i) => {
          const color = speakerColors[entry.speaker] || "bg-dark-subtle";
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-xs font-medium text-text-primary">
                  {entry.speaker}
                </span>
                <span className="text-xs text-text-muted">{entry.time}</span>
              </div>
              <p className="pl-4 text-xs leading-relaxed text-text-secondary">
                {entry.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
