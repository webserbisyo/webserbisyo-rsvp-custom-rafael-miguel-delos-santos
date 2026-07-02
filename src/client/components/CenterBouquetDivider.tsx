"use client";

type CenterBouquetDividerProps = {
  className?: string;
};

export function CenterBouquetDivider({ className = "bg-cream" }: CenterBouquetDividerProps) {
  return (
    <div
      className={`relative z-20 -mt-px -mb-px h-16 overflow-visible sm:h-20 md:h-24 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 z-10 overflow-visible pointer-events-none select-none">
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-1/2 top-1/2 z-30 w-32 -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none select-none sm:w-40 md:w-48 lg:w-56 xl:w-64"
        />
      </div>
    </div>
  );
}
