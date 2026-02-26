interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
}

export function MetricCard({ label, value, trend, className = "" }: MetricCardProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-lg bg-page-card px-5 py-4 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <span className="font-heading text-2xl font-bold text-text-primary">{value}</span>
      {trend && (
        <span className="text-xs text-text-secondary">{trend}</span>
      )}
    </div>
  );
}
