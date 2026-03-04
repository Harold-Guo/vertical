export interface Project {
  id: string;
  company: string;
  subtitle: string;
  status: "negotiation" | "demo" | "proposal" | "closing" | "discovery";
  dealValue: number;
  reps: string;
  aiInsight: string;
  activity: string;
  forecast: number;
}

export interface ProjectDetail {
  id: string;
  company: string;
  dealValue: number;
  status: string;
  recordings: number;
  calls: number;
  callsSummary: string;
  meddicScore: number;
  meddicTrend: string;
  riskLevel: string;
  riskTrend: string;
  contacts: Contact[];
  insights: Insight[];
  riskSignals: RiskSignal[];
}

export interface Contact {
  name: string;
  role: string;
  avatar?: string;
}

export interface Insight {
  icon: string;
  text: string;
  date: string;
}

export interface RiskSignal {
  icon: string;
  label: string;
  detail: string;
  status: "resolved" | "warning" | "critical";
}

export interface MeddicSection {
  key: string;
  title: string;
  icon: string;
  score: number;
  content: string;
}

export interface TodoItem {
  id: string;
  title: string;
  fromRecording?: string;
  dueDate: string;
  tags: { label: string; color: string }[];
  assignee?: string;
  linkedItems?: string;
  action: string;
  completed: boolean;
}

export interface Recording {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  duration: string;
  score?: number;
  participants?: number;
}

export interface InboxRecording {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  assignedTo: string;
  status: "assigned" | "processing" | "unassigned";
}

export interface TranscriptEntry {
  speaker: string;
  time: string;
  text: string;
}

export interface RecordingDetail {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  assignedProject?: string;
  summary: string;
  keyPoints: { text: string; tag: string }[];
  nextSteps: string;
  transcript: TranscriptEntry[];
}

export interface CallAnalysis {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  talkRatio: { rep: number; customer: number };
  keyTopics: { label: string; percentage?: number }[];
  analysis: string;
  callScore: number;
  metrics: { label: string; value: string; score: number }[];
  riskSignals: string[];
  keyDiscussionPoints: { text: string; tag: string }[];
  transcript: TranscriptEntry[];
}

export interface CoachingData {
  totalScore: number;
  scoreTrend: string;
  callsAnalyzed: number;
  callsTrend: string;
  topStrength: string;
  topStrengthDetail: string;
  focusArea: string;
  focusAreaDetail: string;
  objections: ObjectionCard[];
}

export interface ObjectionCard {
  title: string;
  score: number;
  strengths: string;
  areasToImprove: string;
  practicePrompt: string;
}

export interface ConnectedApp {
  name: string;
  description: string;
  icon: string;
  connected: boolean;
}

export interface AiSkill {
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface ProjectSettings {
  connectedApps: ConnectedApp[];
  aiSkills: AiSkill[];
  metrics: { label: string; value: string; trend: string }[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  comingSoon?: boolean;
  skills: AiSkill[];
  apps: ConnectedApp[];
}

export interface CreateProjectRequest {
  templateId?: string;
  name: string;
  company: string;
  status: string;
  dealValue?: number;
  description?: string;
  skills: { name: string; enabled: boolean }[];
  apps: { name: string; connected: boolean }[];
  customPrompt?: string;
}

export interface ProjectsListResponse {
  projects: Project[];
  metrics: {
    totalPipeline: string;
    activeDeals: number;
    atRisk: number;
    forecastEv: string;
  };
  pagination: { page: number; totalPages: number };
}

export interface InboxListResponse {
  recordings: InboxRecording[];
  metrics: {
    recordingsCount: number;
    thisWeek: number;
    avgDuration: string;
    processing: number;
  };
  pagination: { page: number; totalPages: number };
}
