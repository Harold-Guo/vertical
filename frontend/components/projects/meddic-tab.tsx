import { api } from "@/lib/api";
import {
  BarChart3,
  User,
  ListChecks,
  GitBranch,
  Search,
  Trophy,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "bar-chart": BarChart3,
  user: User,
  "list-checks": ListChecks,
  "git-branch": GitBranch,
  search: Search,
  trophy: Trophy,
};

export async function MeddicTab({ projectId }: { projectId: string }) {
  const data = await api.getProjectMeddic(projectId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          MEDDIC Assessment
        </h2>
        <p className="mt-1 text-sm text-text-muted">Overall Assessment</p>
      </div>

      <p className="text-sm leading-relaxed text-text-secondary">{data.summary}</p>

      <div className="rounded-xl border border-page-border bg-page-card p-6 space-y-8">
        {data.sections.map((section) => {
          const Icon = iconMap[section.icon] || BarChart3;
          return (
            <div key={section.key} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-page-accent/10">
                  <Icon size={16} className="text-page-accent" />
                </div>
                <h3 className="font-heading text-base font-semibold text-text-primary">
                  {section.title}
                </h3>
                <div className="ml-auto flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-page-border">
                    <div
                      className="h-full rounded-full bg-page-accent"
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text-secondary">{section.score}%</span>
                </div>
              </div>
              <p className="pl-11 text-sm leading-relaxed text-text-secondary">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
