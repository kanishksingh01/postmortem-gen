interface SeverityBadgeProps {
  severity: string;
}

const SEVERITY_CLASSES: Record<string, { label: string; className: string }> = {
  P1: {
    label: "P1 Critical",
    className:
      "bg-red-500/10 text-red-400 border border-red-500/30",
  },
  P2: {
    label: "P2 High",
    className:
      "bg-orange-500/10 text-orange-400 border border-orange-500/30",
  },
  P3: {
    label: "P3 Medium",
    className:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  },
  P4: {
    label: "P4 Low",
    className:
      "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  },
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = SEVERITY_CLASSES[severity] ?? SEVERITY_CLASSES["P3"];

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-semibold tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
