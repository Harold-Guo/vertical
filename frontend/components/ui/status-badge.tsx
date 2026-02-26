const statusStyles: Record<string, string> = {
  negotiation: "bg-page-accent text-white",
  demo: "bg-page-info text-white",
  proposal: "bg-page-warning text-white",
  closing: "bg-page-success text-white",
  discovery: "bg-page-success text-white",
  assigned: "bg-page-info text-white",
  processing: "bg-page-warning text-white",
  unassigned: "bg-page-card text-text-secondary",
  resolved: "bg-page-success text-white",
  warning: "bg-page-warning text-white",
  critical: "bg-page-error text-white",
  urgent: "bg-page-error text-white",
  high: "bg-page-accent text-white",
  medium: "bg-page-warning text-white",
  low: "bg-page-info text-white",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || "bg-page-card text-text-secondary";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl px-2.5 py-0.5 text-xs font-medium capitalize ${style} ${className}`}
    >
      {label || status}
    </span>
  );
}
