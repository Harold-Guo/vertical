const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function postApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

import type {
  ProjectsListResponse,
  ProjectDetail,
  MeddicSection,
  TodoItem,
  Recording,
  ProjectSettings,
  InboxListResponse,
  RecordingDetail,
  CallAnalysis,
  CoachingData,
} from "./types";

export const api = {
  getProjects: () => fetchApi<ProjectsListResponse>("/api/projects"),
  getProjectDetail: (id: string) => fetchApi<ProjectDetail>(`/api/projects/${id}`),
  getProjectMeddic: (id: string) => fetchApi<{ sections: MeddicSection[]; summary: string }>(`/api/projects/${id}/meddic`),
  getProjectTodos: (id: string) => fetchApi<{ todos: TodoItem[] }>(`/api/projects/${id}/todos`),
  getProjectRecordings: (id: string) => fetchApi<{ recordings: Recording[] }>(`/api/projects/${id}/recordings`),
  getProjectSettings: (id: string) => fetchApi<ProjectSettings>(`/api/projects/${id}/settings`),
  getInbox: () => fetchApi<InboxListResponse>("/api/inbox"),
  getInboxRecording: (id: string) => fetchApi<RecordingDetail>(`/api/inbox/${id}`),
  getRecordingAnalysis: (id: string) => fetchApi<CallAnalysis>(`/api/recordings/${id}`),
  getCoaching: () => fetchApi<CoachingData>("/api/coaching"),
  generateEmail: (todoId: string, body: unknown) => postApi<{ subject: string; body: string }>(`/api/todos/${todoId}/email`, body),
};
