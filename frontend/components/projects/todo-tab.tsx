"use client";

import { useEffect, useState } from "react";
import type { TodoItem } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmailSlideOver } from "@/components/projects/email-slide-over";
import { Check, Mail, Link as LinkIcon } from "lucide-react";

export function TodoTab({ projectId }: { projectId: string }) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [emailTodo, setEmailTodo] = useState<TodoItem | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${projectId}/todos`)
      .then((r) => r.json())
      .then((d) => setTodos(d.todos));
  }, [projectId]);

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            Action Items
          </h2>
          <p className="text-sm text-text-muted">
            {pending.length} active · {todos.filter((t) => t.tags.some((tg) => tg.label === "Urgent" || tg.label === "Critical")).length} overdue · {completed.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md bg-page-card px-3 py-2 text-sm text-text-secondary">
            All Items
          </button>
          <button className="rounded-md bg-page-card px-3 py-2 text-sm text-text-secondary">
            Priority ↓
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-page-border bg-page-card divide-y divide-page-border">
        {pending.map((todo) => (
          <div key={todo.id} className="flex items-center gap-4 px-5 py-4">
            <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-page-border hover:border-page-accent transition-colors" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary">{todo.title}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                {todo.fromRecording && <span>From: {todo.fromRecording}</span>}
                {todo.dueDate && <span>{todo.dueDate}</span>}
                {todo.tags.map((tag, i) => (
                  <StatusBadge key={i} status={tag.color === "red" ? "urgent" : tag.color === "orange" ? "high" : tag.label.toLowerCase()} label={tag.label} />
                ))}
                {todo.linkedItems && (
                  <span className="inline-flex items-center gap-1">
                    <LinkIcon size={10} /> {todo.linkedItems}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setEmailTodo(todo)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-page-accent hover:bg-page-accent/10 transition-colors"
            >
              <Mail size={12} />
              {todo.action || "Follow Up"}
            </button>
          </div>
        ))}
        {completed.map((todo) => (
          <div key={todo.id} className="flex items-center gap-4 px-5 py-4 opacity-50">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-page-success text-white">
              <Check size={12} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-text-muted line-through">{todo.title}</div>
              <div className="mt-1 text-xs text-text-muted">
                {todo.fromRecording && <span>From: {todo.fromRecording}</span>}
                {todo.dueDate && <span className="ml-2">{todo.dueDate}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {emailTodo && (
        <EmailSlideOver todo={emailTodo} onClose={() => setEmailTodo(null)} />
      )}
    </div>
  );
}
