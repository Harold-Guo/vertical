"use client";

import { useState } from "react";
import type { TodoItem } from "@/lib/types";
import { X, Send, RefreshCw } from "lucide-react";

type Step = "form" | "draft";

export function EmailSlideOver({
  todo,
  onClose,
}: {
  todo: TodoItem;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [draft, setDraft] = useState({ subject: "", body: "" });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/todos/${todo.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoTitle: todo.title }),
      });
      const data = await res.json();
      setDraft(data);
      setStep("draft");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-[480px] bg-white shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-page-border px-6 py-4">
          <h3 className="font-heading text-base font-semibold text-text-primary">
            {step === "form" ? "Compose Follow-up Email" : "Follow-up Email Draft"}
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        {step === "form" ? (
          <div className="flex flex-1 flex-col gap-5 overflow-auto px-6 py-5">
            <div className="rounded-lg bg-page-accent/10 px-4 py-3 text-xs text-page-accent">
              From Recording #5 — Pricing Discussion March, pricing set 4.
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Recipient</label>
              <input className="w-full rounded-lg border border-page-border bg-white px-3 py-2.5 text-sm" defaultValue="sarah.chen@acme-corp.com" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Key follow-up objective</label>
              <input className="w-full rounded-lg border border-page-border bg-white px-3 py-2.5 text-sm" defaultValue="Send revised pricing with phased implementation option" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Specific points to address</label>
              <ul className="ml-4 list-disc text-sm text-text-secondary space-y-1">
                <li>Phase 1 core platform roll-out at $180K</li>
                <li>Phase 2: analytics add-on at $60K</li>
                <li>11% annual commitment discount</li>
              </ul>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Tone: value proposition</label>
              <input className="w-full rounded-lg border border-page-border bg-white px-3 py-2.5 text-sm" defaultValue="Phased approach reduces upfront risk while ensuring full platform capabilities" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Tone</label>
              <div className="flex gap-2">
                <span className="rounded-md bg-page-accent px-3 py-1 text-xs font-medium text-white">Professional</span>
                <span className="rounded-md bg-page-card px-3 py-1 text-xs text-text-secondary">Friendly</span>
                <span className="rounded-md bg-page-card px-3 py-1 text-xs text-text-secondary">Urgent</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-auto px-6 py-5">
            <div className="mb-1 text-xs text-text-muted">Subject</div>
            <div className="mb-4 rounded-lg border border-page-border bg-page/50 px-3 py-2 text-sm">
              {draft.subject}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {draft.body}
            </div>
          </div>
        )}

        <div className="border-t border-page-border px-6 py-4">
          {step === "form" ? (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-dark-sidebar py-3 text-sm font-medium text-white hover:bg-dark-surface transition-colors disabled:opacity-50"
            >
              <Send size={14} />
              {loading ? "Generating..." : "Generate follow-up email"}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setStep("form")}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-page-border py-3 text-sm text-text-secondary hover:bg-page-card transition-colors"
              >
                <RefreshCw size={14} />
                Change
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-page-accent py-3 text-sm font-medium text-white hover:bg-page-accent-light transition-colors">
                <Send size={14} />
                Send via Gmail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
