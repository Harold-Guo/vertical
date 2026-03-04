"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ProjectTemplate, AiSkill, ConnectedApp } from "@/lib/types";
import { StepIndicator } from "@/components/projects/create/step-indicator";
import { StepTemplate } from "@/components/projects/create/step-template";
import {
  StepDetails,
  type ProjectDetails,
} from "@/components/projects/create/step-details";
import { StepConfigure } from "@/components/projects/create/step-configure";
import { StepReview } from "@/components/projects/create/step-review";

const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Create New Project",
    subtitle:
      "Choose a template to get started with pre-configured skills and integrations",
  },
  2: {
    title: "Project Details",
    subtitle: "Set up the basic information for your sales project",
  },
  3: {
    title: "Configure Skills & Apps",
    subtitle:
      "Customize the AI skills and app integrations for this project",
  },
  4: {
    title: "Review & Create",
    subtitle: "Review your project configuration before creating",
  },
};

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [details, setDetails] = useState<ProjectDetails>({
    name: "",
    company: "",
    status: "discovery",
    dealValue: "",
    description: "",
  });
  const [skills, setSkills] = useState<AiSkill[]>([]);
  const [apps, setApps] = useState<ConnectedApp[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/templates`
    )
      .then((r) => r.json())
      .then((data) => setTemplates(data.templates));
  }, []);

  const handleSelectTemplate = (t: ProjectTemplate) => {
    setSelectedTemplate(t);
    setSkills(t.skills.map((s) => ({ ...s })));
    setApps(t.apps.map((a) => ({ ...a })));
    setStep(2);
  };

  const handleScratch = () => {
    setSelectedTemplate(null);
    setSkills([]);
    setApps([]);
    setStep(2);
  };

  const handleToggleSkill = (name: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.name === name ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleToggleApp = (name: string) => {
    setApps((prev) =>
      prev.map((a) =>
        a.name === name ? { ...a, connected: !a.connected } : a
      )
    );
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/projects`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: selectedTemplate?.id,
            name: details.name,
            company: details.company,
            status: details.status,
            dealValue: details.dealValue
              ? parseInt(details.dealValue.replace(/\D/g, ""), 10)
              : undefined,
            description: details.description || undefined,
            skills: skills.map((s) => ({
              name: s.name,
              enabled: s.enabled,
            })),
            apps: apps.map((a) => ({
              name: a.name,
              connected: a.connected,
            })),
            customPrompt: customPrompt || undefined,
          }),
        }
      );
      const data = await res.json();
      router.push(`/projects/${data.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const { title, subtitle } = STEP_TITLES[step];

  return (
    <div className="flex flex-col gap-0 px-12 py-10">
      <Link
        href="/projects"
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-text-muted hover:text-text-secondary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="font-heading text-[28px] font-bold text-text-primary">
          {title}
        </h1>
        <p className="text-sm text-text-muted">{subtitle}</p>
        <StepIndicator current={step} />
      </div>

      {step === 1 && (
        <StepTemplate
          templates={templates}
          onSelect={handleSelectTemplate}
          onScratch={handleScratch}
        />
      )}

      {step === 2 && (
        <StepDetails
          data={details}
          onChange={setDetails}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepConfigure
          skills={skills}
          apps={apps}
          customPrompt={customPrompt}
          onToggleSkill={handleToggleSkill}
          onToggleApp={handleToggleApp}
          onChangePrompt={setCustomPrompt}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <StepReview
          details={details}
          skills={skills}
          apps={apps}
          submitting={submitting}
          onBack={() => setStep(3)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
