"use client";

export function CountdownToMusicDivider() {
  return (
    <div
      className="relative z-20 -mt-px h-24 sm:h-32 md:h-40 lg:h-44"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--section-bg-cream), var(--section-bg-cream), var(--section-bg-seafoam-light))",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 bottom-0 h-[800px] overflow-x-clip pointer-events-none select-none">
        <img
          src="/beach%20assets%20finalized/9.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-0 bottom-0 z-10 w-56 -translate-x-[10%] translate-y-[8%] object-contain pointer-events-none select-none sm:w-64 sm:-translate-x-[16%] sm:translate-y-[14%] md:w-[340px] lg:w-[430px] xl:w-[500px]"
        />
        <img
          src="/beach%20assets%20finalized/6.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 bottom-0 z-10 w-56 translate-x-[10%] translate-y-[8%] object-contain pointer-events-none select-none sm:w-64 sm:translate-x-[16%] sm:translate-y-[14%] md:w-[340px] lg:w-[430px] xl:w-[500px]"
        />
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-1/2 bottom-0 z-20 w-36 -translate-x-1/2 translate-y-[10%] object-contain pointer-events-none select-none sm:w-44 sm:translate-y-[18%] md:w-52 lg:w-60 xl:w-64"
        />
      </div>
    </div>
  );
}
