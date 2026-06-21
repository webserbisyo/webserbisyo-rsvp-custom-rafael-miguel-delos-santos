"use client";

import { ClientRsvpForm } from "@/client/rsvp";
import type { ClientEventRendererProps } from "@/client/renderer/client-renderer-types";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { BlurText, ScrollReveal, FadeContent, AnimatedContent, ScrollStack, ScrollStackItem } from "@/client/libs/reactbits";
import Link from "next/link";
import { Heart, Bus, Anchor, Bed, Sparkles, ChevronDown, HelpCircle, MapPin, Gift } from "lucide-react";

function formatTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 56" className="w-full h-10 md:h-14 text-cream" preserveAspectRatio="none">
        <path
          d="M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function SectionHeading({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center mb-10 md:mb-14"
    >
      {label && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-10 bg-[#D47A5A]/40" />
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-[#D47A5A]">{label}</p>
          <div className="h-px w-10 bg-[#D47A5A]/40" />
        </div>
      )}
      <h2 className="font-serif text-cocoa text-4xl md:text-5xl font-medium mb-4">{title}</h2>
      {subtitle && (
        <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed text-driftwood">{subtitle}</p>
      )}
    </motion.div>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-coral z-[100] origin-left"
    />
  );
}

function HeroSection({ data }: { data: any }) {
  const { coupleInfo, ceremony } = data ?? {};
  
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 600], [0, 120]);
  const backgroundY = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.4 });

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="relative pt-64 pb-12 px-4 text-center overflow-hidden bg-ivory min-h-[95vh] flex flex-col justify-end"
    >
      {/* Smooth Parallax Background Image */}
      <motion.div
        style={{
          y: backgroundY,
          backgroundImage: "url('/wedding-assets/The-ceremony-arch.jpeg')",
          backgroundPosition: "center 40%",
        }}
        className="absolute inset-x-0 bottom-0 top-[74px] z-0 bg-cover bg-no-repeat scale-120 pointer-events-none"
      />
      {/* Soft gradient overlay for styling and high text readability */}
      <div className="absolute inset-x-0 bottom-0 top-[74px] z-1 bg-gradient-to-b from-black/25 via-[#2D1B12]/15 to-[#2D1B12]/30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 mb-4">
        <FadeContent>
          {coupleInfo?.hostLine && (
            <div className="inline-block px-6 py-2 rounded-full border border-coral/30 text-coral text-xs font-semibold tracking-[0.2em] uppercase mb-6 bg-[#FDF6ED]/30 backdrop-blur-md">
              {coupleInfo.hostLine}
            </div>
          )}

          {/* Title Card */}
          <div className="inline-block px-8 py-5 rounded-2xl bg-[#FDF6ED]/40 backdrop-blur-md border border-[#FDF6ED]/25 shadow-soft mb-6">
            <h1 className="font-serif text-charcoal text-4xl md:text-6xl font-medium leading-none">
              {coupleInfo?.displayAs || "Rafael & Isabella"}
            </h1>
          </div>

          {/* Date Card */}
          <div className="block mb-6">
            {ceremony?.eventDate ? (
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#FDF6ED]/35 backdrop-blur-md border border-[#FDF6ED]/25 shadow-soft text-cocoa/80 font-bold tracking-[0.15em] uppercase text-xs sm:text-sm">
                <span className="text-coral/50">—</span>
                <span>{mounted ? formatDate(ceremony.eventDate) : ""}</span>
                <span className="text-coral/50">—</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#FDF6ED]/35 backdrop-blur-md border border-[#FDF6ED]/25 shadow-soft text-cocoa/60 font-bold tracking-[0.15em] uppercase text-xs sm:text-sm">
                <span className="text-coral/50">—</span>
                <span>April 19, 2027</span>
                <span className="text-coral/50">—</span>
              </div>
            )}
          </div>

          {/* Message Card */}
          {coupleInfo?.shortHostMessage && (
            <div className="block max-w-xl mx-auto px-6 py-4 rounded-xl bg-[#FDF6ED]/35 backdrop-blur-md border border-[#FDF6ED]/20 shadow-soft mb-10">
              <p className="text-sm md:text-base leading-relaxed text-charcoal/80">
                {coupleInfo.shortHostMessage}
              </p>
            </div>
          )}

          {/* Action Buttons (no container) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 max-w-xl mx-auto">
            <Link
              href="/rsvp"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-coral text-white border border-transparent rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-md hover:bg-[#b24d26] hover:shadow-[0_0_20px_rgba(201,94,53,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-out cursor-pointer"
            >
              <Heart size={14} className="fill-white/20 group-hover:scale-125 group-hover:fill-white transition-transform duration-300 ease-out" />
              <span>Reserve Your Seat</span>
            </Link>
            
            <a
              href="#our-story"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white bg-transparent rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.97] backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer"
            >
              <span>Our Story</span>
            </a>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

function MusicEffectsSection({ data }: { data: any }) {
  const { musicEffects } = data ?? {};
  if (!musicEffects?.musicLink) return null;
  return (
    <section id="music" className="py-12 px-4 bg-cocoa text-cream text-center">
      <div className="max-w-xl mx-auto">
        <h3 className="font-serif text-2xl mb-2">{musicEffects.musicTitle}</h3>
        <p className="text-cream/70 text-sm mb-6">{musicEffects.shortNote}</p>
        <a href={musicEffects.musicLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-cream text-cocoa rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-sand transition">
          {musicEffects.playButtonLabel || "Play Song ♫"}
        </a>
      </div>
    </section>
  );
}

function CeremonySection({ data, mounted }: { data: any, mounted: boolean }) {
  const { ceremony } = data ?? {};
  if (!ceremony) return null;
  return (
    <section id="ceremony" className="py-20 px-4 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="The Main Event" title={ceremony.eventLabel || "Wedding Ceremony"} subtitle={ceremony.scheduleNote} />
        <FadeContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            <h3 className="font-serif text-2xl text-charcoal mb-4">{mounted ? formatDate(ceremony.eventDate) : ""}</h3>
            {ceremony.eventTime && (
              <p className="text-coral font-medium uppercase tracking-widest text-sm">
                Starts at {formatTime(ceremony.eventTime)}
              </p>
            )}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

function VenueSection({ data }: { data: any }) {
  const { venue } = data ?? {};
  if (!venue) return null;
  return (
    <section id="venue" className="py-20 px-4 bg-cream">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="Location" title={venue.venueName || "Venue"} subtitle={venue.arrivalNote} />
        <FadeContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            <p className="text-driftwood mb-6">{venue.address}</p>
            {venue.mapsLink && (
              <a href={venue.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-coral text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[#8C4520] transition shadow-card">
                View on Map ✦
              </a>
            )}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

function CountdownSection({ data }: { data: any }) {
  const { countdown, ceremony } = data ?? {};
  const getTimeLeft = () => {
    const target = ceremony?.eventDate
      ? new Date(`${ceremony.eventDate}T${ceremony.eventTime || "16:00"}:00`)
      : new Date();
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section id="countdown" className="relative py-20 md:py-32 px-4 bg-cream overflow-hidden">
      {/* Decorative Coconut Trees on Sides */}
      <img 
        src="/beach assets finalized/12.png" 
        alt="Palm tree left"
        className="absolute left-0 bottom-0 w-52 sm:w-64 md:w-80 lg:w-[450px] xl:w-[550px] h-auto object-contain pointer-events-none z-0 transform -translate-x-[35%] sm:-translate-x-[45%] lg:-translate-x-[35%] select-none opacity-100 transition-all duration-300 origin-bottom-left"
      />
      <img 
        src="/beach assets finalized/13.png" 
        alt="Palm tree right"
        className="absolute right-0 bottom-0 w-52 sm:w-64 md:w-80 lg:w-[450px] xl:w-[550px] h-auto object-contain pointer-events-none z-0 transform translate-x-[35%] sm:translate-x-[45%] lg:translate-x-[35%] select-none opacity-100 transition-all duration-300 origin-bottom-right"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeading
          label="Save the Date"
          title={countdown?.title || "Counting Down to Our Special Day"}
          subtitle={countdown?.shortNote}
        />
        
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 mt-12 max-w-3xl mx-auto">
          {units.map(({ label, value }) => {
            const digits = String(value).padStart(2, "0").split("");
            return (
              <div 
                key={label} 
                className="rounded-2xl md:rounded-3xl p-2 sm:p-4 md:p-6 text-center bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(59,42,26,0.05)] hover:shadow-[0_12px_40px_rgba(201,94,53,0.1)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="flex justify-center gap-0.5 h-10 sm:h-14 md:h-18 lg:h-22 items-center overflow-hidden">
                  {digits.map((d, i) => (
                    <div key={i} className="h-full flex items-center overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`${label}-${i}-${d}`}
                          initial={{ y: -30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 30, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="font-poppins text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-coral block tracking-tight"
                        >
                          {mounted ? d : "0"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase mt-2 md:mt-3 text-driftwood">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const GALLERY_PHOTOS = [
  {
    src: "/wedding-assets/The-ceremony-arch.jpeg",
    caption: "The Ceremony Arch",
    location: "Beachfront Setup",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/female-solor-portrait.jpeg",
    caption: "The Beautiful Bride",
    location: "Isabella Solo",
    orientation: "portrait",
  },
  {
    src: "/wedding-assets/male-solo-porttrait.jpeg",
    caption: "The Dashing Groom",
    location: "Rafael Solo",
    orientation: "portrait",
  },
  {
    src: "/wedding-assets/male-solo-landscape.jpeg",
    caption: "Groom's Preparation",
    location: "Before the Ceremony",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/female-solo-landscape.jpeg",
    caption: "Bride's Moments",
    location: "Ocean-view Suite",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/The-arrival-moment.jpeg",
    caption: "The Arrival Moment",
    location: "Walking Down the Aisle",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/Sunset-silhouette.jpeg",
    caption: "Sunset Silhouette",
    location: "Golden Hour Beach",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/The-table-venue-detail.jpeg",
    caption: "Reception Details",
    location: "Table Settings",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/The-table-venue-detail2.jpeg",
    caption: "Floral & Decor",
    location: "Dinner Setup",
    orientation: "landscape",
  },
];

const GALLERY_ROTATIONS = ["-1.5deg", "1.2deg", "-0.8deg", "1.5deg", "-1.2deg", "0.8deg", "-1.8deg", "1deg", "-0.5deg"];

function GallerySection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="gallery" className="pt-20 pb-20 px-4 bg-cocoa">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-[0.25em] uppercase mb-3 text-sand">Our Memories</p>
          <h2 className="font-serif text-cream text-3xl md:text-4xl font-medium mb-3">A Story in Frames</h2>
          <div className="flex items-center justify-center gap-3 mt-5 text-sand/70">
            <div className="h-px w-12 bg-sand/50" />
            <span>✦</span>
            <div className="h-px w-12 bg-sand/50" />
          </div>
        </div>

        <ScrollStack>
          {GALLERY_PHOTOS.map((photo, i) => {
            const isPortrait = photo.orientation === "portrait";
            return (
              <ScrollStackItem key={i}>
                <div
                  className="bg-[#FDFAF5] border-2 border-[var(--border)] rounded p-3 pb-14 mx-auto shadow-card relative transition-all duration-300"
                  style={{ 
                    transform: `rotate(${GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]})`,
                    maxWidth: isPortrait ? "390px" : "520px"
                  }}
                >
                  <div className={`w-full ${isPortrait ? "aspect-[3/4]" : "aspect-[4/3]"} rounded-sm bg-gradient-to-br from-[var(--border)] via-[#D4B896] to-[#C4A882] overflow-hidden`}>
                    {mounted && (
                      <img 
                        src={photo.src} 
                        alt={photo.caption}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-sm hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 text-center px-3">
                    <p className="font-serif italic text-cocoa text-base mb-0.5">{photo.caption}</p>
                    <p className="text-[0.65rem] tracking-widest uppercase text-driftwood">{photo.location}</p>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}

function ReceptionSection({ data }: { data: any }) {
  const { reception } = data ?? {};
  if (!reception) return null;
  return (
    <section id="reception" className="py-20 px-4 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="The Party" title={reception.title || "Reception"} subtitle={reception.note} />
        <FadeContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            <h3 className="font-serif text-2xl text-charcoal mb-4">{reception.venueName}</h3>
            {reception.address && <p className="text-driftwood mb-6">{reception.address}</p>}
            {reception.startTime && (
              <p className="text-coral font-medium uppercase tracking-widest text-sm mb-6">
                Starts at {formatTime(reception.startTime)} {reception.endTime && `- ${formatTime(reception.endTime)}`}
              </p>
            )}
            {reception.mapsLink && (
              <a href={reception.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-coral text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[#8C4520] transition shadow-card">
                View on Map ✦
              </a>
            )}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

function TimelineSection({ data }: { data: any }) {
  const { timelineProgram } = data ?? {};
  if (!timelineProgram?.items?.length) return null;
  return (
    <section id="timeline" className="py-24 px-4 bg-ivory overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading label="Wedding Day Timeline" title="The flow of the day" subtitle="So our guests know what to expect — from sunlit arrivals to bonfire farewells." />
        
        <div className="relative mt-24 max-w-4xl mx-auto pb-8">
          {/* The vertical line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#D47A5A]/30 md:-translate-x-1/2" />
          
          <div className="space-y-16 md:space-y-24">
            {timelineProgram.items.map((item: any, i: number) => {
              const isEven = i % 2 === 0;
              const formattedTime = formatTime(item.time) || item.time;
              const title = item.title || item.activity;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative flex flex-col md:flex-row items-center w-full group/row"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[24px] md:left-1/2 top-[34px] md:top-1/2 w-4 h-4 rounded-full bg-[#D47A5A] -translate-x-1/2 md:-translate-y-1/2 shadow-[0_0_0_8px_#FDF6ED] z-10 transition-transform duration-500 group-hover/row:scale-125" />

                  {/* Mobile Layout */}
                  <div className="md:hidden w-full pl-16">
                    <div className="text-[#D47A5A] font-serif text-2xl tracking-wide mb-3 mt-2">
                      {formattedTime}
                    </div>
                    <div className="bg-white border border-[#E6D5C3]/40 rounded-[20px] p-6 shadow-sm w-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-coral/60 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out" />
                      {title && <h4 className="font-serif text-xl text-cocoa mb-2">{title}</h4>}
                      {item.description && <p className="text-driftwood text-sm leading-relaxed">{item.description}</p>}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex w-full items-center">
                    {isEven ? (
                      <>
                        {/* Time on Left */}
                        <div className="w-1/2 flex justify-end pr-20">
                          <div className="text-[#D47A5A] font-serif text-3xl tracking-wide transition-colors duration-300 group-hover/row:text-coral">
                            {formattedTime}
                          </div>
                        </div>
                        {/* Card on Right */}
                        <div className="w-1/2 flex justify-start pl-20">
                          <div className="bg-white border border-[#E6D5C3]/40 rounded-[24px] p-8 shadow-sm w-full max-w-[420px] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#D47A5A] to-coral scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-700 ease-out" />
                            {title && <h4 className="font-serif text-[1.4rem] text-cocoa mb-3 tracking-wide">{title}</h4>}
                            {item.description && <p className="text-driftwood text-sm md:text-base leading-relaxed text-balance">{item.description}</p>}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Card on Left */}
                        <div className="w-1/2 flex justify-end pr-20">
                          <div className="bg-white border border-[#E6D5C3]/40 rounded-[24px] p-8 shadow-sm w-full max-w-[420px] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#D47A5A] to-coral scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-700 ease-out" />
                            {title && <h4 className="font-serif text-[1.4rem] text-cocoa mb-3 tracking-wide">{title}</h4>}
                            {item.description && <p className="text-driftwood text-sm md:text-base leading-relaxed text-balance">{item.description}</p>}
                          </div>
                        </div>
                        {/* Time on Right */}
                        <div className="w-1/2 flex justify-start pl-20">
                          <div className="text-[#D47A5A] font-serif text-3xl tracking-wide transition-colors duration-300 group-hover/row:text-coral">
                            {formattedTime}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EntourageSection({ data }: { data: any }) {
  const { entourage } = data ?? {};
  if (!entourage?.groups?.length) return null;
  return (
    <section id="entourage" className="py-20 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <SectionHeading label="Wedding Party" title="Entourage" subtitle={entourage.introLine} />
        <AnimatedContent>
          <div className="grid md:grid-cols-2 gap-8">
            {entourage.groups.map((g: any, i: number) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-soft text-center">
                <h4 className="text-coral font-medium tracking-widest uppercase mb-4 text-sm">{g.groupTitle || g.role}</h4>
                <ul className="space-y-2">
                  {(typeof g.names === "string" ? g.names.split(/[\n,]/).map((n: string) => n.trim()).filter(Boolean) : g.names ?? []).map((name: string, j: number) => (
                    <li key={j} className="text-cocoa font-serif text-lg">{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

function SponsorsSection({ data }: { data: any }) {
  const { principalSponsors } = data ?? {};
  if (!principalSponsors?.names) return null;
  const namesList = principalSponsors.names.split("\n").filter(Boolean);
  return (
    <section id="sponsors" className="py-20 px-4 bg-cream">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading label="Principal Sponsors" title="With the guidance of" subtitle={principalSponsors.introLine} />
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          {namesList.map((name: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="font-serif text-lg text-cocoa"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AttireSection({ data }: { data: any }) {
  const { attireDressCode } = data ?? {};
  if (!attireDressCode) return null;
  return (
    <section id="attire" className="py-20 px-4 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="Dress Code" title={attireDressCode.title || "Attire"} subtitle={attireDressCode.shortNote} />
        <AnimatedContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            {attireDressCode.sectionIntro && <p className="text-cocoa/80 text-sm mb-6">{attireDressCode.sectionIntro}</p>}
            {attireDressCode.dressCodeNote && <h3 className="font-serif text-2xl text-charcoal mb-2">{attireDressCode.dressCodeNote}</h3>}
            {attireDressCode.colorMotifNote && <p className="text-coral text-sm uppercase tracking-widest font-semibold">{attireDressCode.colorMotifNote}</p>}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

function getIconForTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("shuttle") || t.includes("transport") || t.includes("service")) return Bus;
  if (t.includes("parking") || t.includes("car")) return Anchor;
  if (t.includes("accommodation") || t.includes("hotel") || t.includes("stay") || t.includes("room")) return Bed;
  if (t.includes("confetti") || t.includes("policy") || t.includes("no ")) return Sparkles;
  if (t.includes("gift") || t.includes("registry")) return Gift;
  if (t.includes("venue") || t.includes("location") || t.includes("map")) return MapPin;
  return HelpCircle;
}

function ExtraInfoSection({ data }: { data: any }) {
  const { extraInfo } = data ?? {};
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!extraInfo?.items?.length) return null;

  return (
    <section id="extra-info" className="py-24 px-4 bg-cream overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <SectionHeading label="Details" title={extraInfo.sectionTitle || "Additional Details"} subtitle={extraInfo.sectionIntro} />
        
        <div className="space-y-4 mt-12">
          {extraInfo.items.map((item: any, i: number) => {
            const IconComponent = getIconForTitle(item.title);
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#E6D5C3]/40 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="p-6 md:p-8 flex items-center justify-between gap-4 select-none">
                  <div className="flex items-center gap-5 sm:gap-6">
                    {/* Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#EBF7F5] flex items-center justify-center text-[#2D7A70] shrink-0 transition-transform duration-300 group-hover:scale-105">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h4 className="font-serif text-xl md:text-2xl text-cocoa font-medium tracking-wide">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Chevron indicator */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-sand shrink-0 p-1"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Expanded Content with smooth height transition */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 pb-8 md:px-8 md:pb-10 pl-[80px] md:pl-[96px] pr-6 md:pr-12">
                        <div className="h-px bg-gradient-to-r from-[#E6D5C3]/30 via-[#E6D5C3]/10 to-transparent mb-5" />
                        <p className="text-driftwood text-sm md:text-base leading-relaxed text-balance">
                          {item.details}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RsvpCtaSection() {
  return (
    <section id="rsvp" className="py-20 px-4 text-center bg-gradient-to-br from-coral to-[#8C4520]">
      <FadeContent>
        <p className="text-xs font-medium tracking-[0.25em] uppercase mb-4 text-white/70">Join Us</p>
        <h2 className="font-serif text-white text-3xl md:text-4xl font-medium mb-4">Confirm Your Attendance</h2>
        <p className="text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 text-white/80">
          Please click below to visit our dedicated RSVP page and let us know if you can make it.
        </p>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block rounded-full shadow-card"
        >
          <Link
            href="/rsvp"
            className="inline-block px-10 py-4 rounded-full text-sm font-medium tracking-wide bg-white text-coral cursor-pointer"
          >
            RSVP Now ✦
          </Link>
        </motion.div>
      </FadeContent>
    </section>
  );
}

function GiftsSection({ data }: { data: any }) {
  const { giftDetails } = data ?? {};
  if (!giftDetails) return null;
  return (
    <section id="gifts" className="py-20 px-4 bg-ivory">
      <div className="max-w-3xl mx-auto">
        <SectionHeading label="Gifts" title="Gift Registry" subtitle={giftDetails.sectionIntro} />
        <AnimatedContent>
          {giftDetails.giftNote && <p className="text-center text-driftwood mb-8">{giftDetails.giftNote}</p>}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {giftDetails.options?.map((opt: any, i: number) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-6 text-center shadow-soft">
                <h4 className="font-serif text-xl text-cocoa mb-2">{opt.title}</h4>
                {opt.description && <p className="text-driftwood text-sm mb-4">{opt.description}</p>}
                {opt.image?.url && (
                  <div className="flex justify-center mb-4">
                    <img src={opt.image.url} alt={opt.image.alt || opt.title} className="w-48 h-auto rounded-lg object-contain shadow-sm border border-cocoa/5" />
                  </div>
                )}
                {opt.linkUrl && (
                  <a href={opt.linkUrl} target="_blank" rel="noopener noreferrer" className="text-coral text-sm font-medium tracking-wide hover:underline">
                    {opt.linkLabel || "View Details"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

function GuestbookSection({ data }: { data: any }) {
  const { guestbook } = data ?? {};
  if (!guestbook) return null;
  return (
    <section id="guestbook" className="py-20 px-4 bg-cream">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeading label="Guestbook" title={guestbook.sectionTitle || "Leave a Message"} subtitle={guestbook.sectionIntro} />
        <AnimatedContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-soft">
            <p className="text-driftwood italic font-serif">{guestbook.emptyStateMessage || "Guestbook entries will appear here."}</p>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

function OurStorySection({ data }: { data: any }) {
  const { loveStory } = data ?? {};
  if (!loveStory) return null;
  return (
    <section id="our-story" className="py-24 px-4 bg-ivory">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading label="Our Story" title={loveStory.storyTitle || "How We Met"} subtitle={loveStory.sectionIntro} />
        <div className="mt-8 text-lg md:text-xl font-serif text-cocoa leading-relaxed">
          {loveStory.storyBody ? (
            <ScrollReveal text={loveStory.storyBody} />
          ) : (
            <p>Our story is being written...</p>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: any }) {
  const { contactSocials } = data ?? {};
  if (!contactSocials) return null;
  return (
    <section id="contact" className="py-20 px-4 bg-cocoa text-cream text-center">
      <div className="max-w-xl mx-auto">
        <AnimatedContent>
          <h2 className="font-serif text-3xl mb-4">{contactSocials.title || "Get in Touch"}</h2>
          <p className="text-cream/80 text-sm mb-8">{contactSocials.shortNote}</p>
          <div className="flex flex-col gap-3 text-sm items-center">
            {contactSocials.email && <p>Email: <a href={`mailto:${contactSocials.email}`} className="text-sand hover:underline">{contactSocials.email}</a></p>}
            {contactSocials.contactNumber && <p>Phone: {contactSocials.contactNumber}</p>}
            
            <div className="flex gap-4 mt-4 justify-center">
              {contactSocials.facebookUrl && (
                <a href={contactSocials.facebookUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cream text-cocoa rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sand transition">
                  Facebook
                </a>
              )}
              {contactSocials.instagramUrl && (
                <a href={contactSocials.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cream text-cocoa rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sand transition">
                  Instagram
                </a>
              )}
              {contactSocials.tikTokUrl && (
                <a href={contactSocials.tikTokUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cream text-cocoa rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sand transition">
                  TikTok
                </a>
              )}
            </div>

            {contactSocials.eventHashtag && <p className="mt-6 text-xl text-sand font-serif">{contactSocials.eventHashtag}</p>}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}



export function ClientEventRenderer({ config, event }: ClientEventRendererProps) {
  const title = event.coupleDisplayName || event.title || "WebSerbisyo RSVP Event";
  const ceremonySection = event.sections.find((section) => section.key === "main_event");
  const venueSection = event.sections.find((section) => section.key === "venue");
  const ceremonyLabel = typeof ceremonySection?.content.eventLabel === "string" ? ceremonySection.content.eventLabel : "";
  const venueName = typeof venueSection?.content.venueName === "string" ? venueSection.content.venueName : "";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="flex min-h-screen w-full flex-col text-cocoa">
      <ScrollProgressBar />
      <HeroSection data={event.raw.renderModel} />
      <WaveDivider />
      <CountdownSection data={event.raw.renderModel} />
      
      <MusicEffectsSection data={event.raw.renderModel} />

      <WaveDivider flip />
      <CeremonySection data={event.raw.renderModel} mounted={mounted} />
      <WaveDivider />
      <VenueSection data={event.raw.renderModel} />
      <WaveDivider flip />
      <GallerySection />
      <WaveDivider flip />
      <ReceptionSection data={event.raw.renderModel} />
      <WaveDivider />
      <TimelineSection data={event.raw.renderModel} />
      <WaveDivider flip />
      <EntourageSection data={event.raw.renderModel} />
      <WaveDivider />
      <SponsorsSection data={event.raw.renderModel} />
      <WaveDivider flip />
      <AttireSection data={event.raw.renderModel} />
      <WaveDivider />
      <ExtraInfoSection data={event.raw.renderModel} />
      <WaveDivider flip />
      <RsvpCtaSection />

      <WaveDivider flip />
      <GiftsSection data={event.raw.renderModel} />
      <WaveDivider />
      <GuestbookSection data={event.raw.renderModel} />
      <WaveDivider flip />
      <OurStorySection data={event.raw.renderModel} />
      <WaveDivider />
      <ContactSection data={event.raw.renderModel} />
    </main>
  );
}
