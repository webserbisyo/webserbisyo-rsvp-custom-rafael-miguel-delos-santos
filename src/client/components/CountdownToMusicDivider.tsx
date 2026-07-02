"use client";

export function CountdownToMusicDivider() {
  return (
    <div
      className="relative z-20 -mt-px h-24 overflow-x-clip overflow-y-visible bg-gradient-to-b from-cream via-cream to-[#E8F4F0] sm:h-32 md:h-40 lg:h-44"
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-visible pointer-events-none select-none">
        <img
          src="/beach%20assets%20finalized/9.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-0 bottom-0 z-10 w-52 -translate-x-[18%] translate-y-[18%] object-contain pointer-events-none select-none sm:w-64 sm:-translate-x-[22%] sm:translate-y-[24%] md:w-[340px] lg:w-[430px] xl:w-[500px]"
        />
        <img
          src="/beach%20assets%20finalized/6.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 bottom-0 z-10 w-52 translate-x-[18%] translate-y-[18%] object-contain pointer-events-none select-none sm:w-64 sm:translate-x-[22%] sm:translate-y-[24%] md:w-[340px] lg:w-[430px] xl:w-[500px]"
        />
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-1/2 bottom-0 z-20 w-32 -translate-x-1/2 translate-y-[22%] object-contain pointer-events-none select-none sm:w-40 sm:translate-y-[30%] md:w-52 lg:w-60 xl:w-64"
        />
      </div>
    </div>
  );
}
