type MediaPlaceholderProps = {
  label: string;
  source: "design" | "snapshot" | "live";
  sensitive?: boolean;
};

export function MediaPlaceholder({ label, source, sensitive = false }: MediaPlaceholderProps) {
  if (source === "live" && sensitive) return null;

  const text = source === "design" ? `Demo ${label}` : `${label} not provided`;

  return (
    <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-border bg-surface-muted px-5 py-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted">
      {text}
    </div>
  );
}
