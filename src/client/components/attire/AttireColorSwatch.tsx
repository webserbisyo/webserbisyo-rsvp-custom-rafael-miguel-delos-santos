"use client";

export type AttireColorSwatchProps = {
  label: string;
  color: string;
};

export function AttireColorSwatch({ label, color }: AttireColorSwatchProps) {
  return (
    <div className="w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] max-w-[120px] flex flex-col items-center group select-none text-center">
      <div
        className="w-12 h-12 rounded-full border border-[color:var(--wedding-attire-swatch-border,#d8c8a9)] shadow-sm transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold tracking-wider text-[color:var(--wedding-attire-swatch-label,#443d35)] mt-2.5 uppercase break-normal whitespace-normal leading-snug">
        {label}
      </span>
    </div>
  );
}
