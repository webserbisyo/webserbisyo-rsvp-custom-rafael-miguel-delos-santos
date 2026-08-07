"use client";

export type AttireColorSwatchProps = {
  label: string;
  color: string;
};

export function AttireColorSwatch({ label, color }: AttireColorSwatchProps) {
  return (
    <div className="w-full min-w-0 flex flex-col items-center group select-none text-center px-0.5">
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border border-[color:var(--wedding-attire-swatch-border,#d8c8a9)] shadow-sm transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="min-w-0 text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-normal sm:tracking-wide text-[color:var(--wedding-attire-swatch-label,#443d35)] mt-1.5 sm:mt-2 uppercase break-normal whitespace-normal hyphens-none leading-tight text-center">
        {label}
      </span>
    </div>
  );
}
