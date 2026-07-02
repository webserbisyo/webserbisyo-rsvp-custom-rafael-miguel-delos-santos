"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type ColorTuple = {
  highlight: string;
  base: string;
  shadow: string;
  vein: string;
};

// Refined Soft Romantic Beach Palette
const PETAL_COLORS: ColorTuple[] = [
  { highlight: "#FFC5D0", base: "#FFB7C4", shadow: "#E89EA9", vein: "#CC828F" }, // Soft rose pink (20%)
  { highlight: "#FFAEBE", base: "#FF98AC", shadow: "#E88295", vein: "#CC6679" }, // Blush pink (22%)
  { highlight: "#FF94A9", base: "#F77992", shadow: "#DE647C", vein: "#C24C63" }, // Softer hibiscus (22%)
  { highlight: "#FF8198", base: "#EA667F", shadow: "#D15068", vein: "#B5394F" }, // Rose-coral (16%)
  { highlight: "#F27585", base: "#DC5D6E", shadow: "#C44758", vein: "#A83443" }, // Muted pink-red (10%)
  { highlight: "#FFAF91", base: "#F49A7B", shadow: "#DC8364", vein: "#BD6747" }  // Coral-peach accent (10%)
];

type Petal = {
  x: number;
  y: number;
  centerX: number;
  size: number;
  speedY: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
  colorTuple: ColorTuple;
  opacity: number;
  depth: number;
};

type ViewportConfig = {
  targetCount: number;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
};

// Dynamic Viewport Config Helper to prevent closure trapping
function getViewportConfig(width: number, pathname: string): ViewportConfig {
  const isRsvp = pathname === "/rsvp";
  const isMobile = width < 768;
  const isTablet = width >= 768 && width <= 1024;

  if (isMobile) {
    return {
      targetCount: isRsvp ? 12 : 20,
      minSize: isRsvp ? 5 : 6,
      maxSize: isRsvp ? 14 : 16,
      minOpacity: isRsvp ? 0.30 : 0.38,
      maxOpacity: isRsvp ? 0.58 : 0.68,
    };
  }

  if (isTablet) {
    return {
      targetCount: isRsvp ? 14 : 30,
      minSize: isRsvp ? 6 : 7,
      maxSize: isRsvp ? 16 : 20,
      minOpacity: isRsvp ? 0.32 : 0.40,
      maxOpacity: isRsvp ? 0.56 : 0.70,
    };
  }

  // Desktop
  return {
    targetCount: isRsvp ? 18 : 44,
    minSize: isRsvp ? 7 : 9,
    maxSize: isRsvp ? 20 : 26,
    minOpacity: isRsvp ? 0.34 : 0.46,
    maxOpacity: isRsvp ? 0.60 : 0.78,
  };
}

type FallingPetalsProps = {
  className?: string;
};

export function FallingPetals({ className = "absolute inset-0 pointer-events-none z-[2] select-none" }: FallingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const pathname = usePathname();

  useEffect(() => {
    // Accessibility Check: Stop if reduced motion is enabled
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize config dynamically based on parent element width or viewport
    const initialWidth = canvas.parentElement?.clientWidth ?? (window.visualViewport?.width ?? window.innerWidth);
    let config = getViewportConfig(initialWidth, pathname);

    // Color distribution selector
    const getRandomColorTuple = (): ColorTuple => {
      const rand = Math.random();
      if (rand < 0.20) return PETAL_COLORS[0]; // 20%
      if (rand < 0.42) return PETAL_COLORS[1]; // 22%
      if (rand < 0.64) return PETAL_COLORS[2]; // 22%
      if (rand < 0.80) return PETAL_COLORS[3]; // 16%
      if (rand < 0.90) return PETAL_COLORS[4]; // 10%
      return PETAL_COLORS[5];                 // 10%
    };

    // Helper to create a single petal particle using the current config
    const createPetal = (yPos: number, activeConfig = config): Petal => {
      const sizeCategory = Math.random();
      let size = 0;

      const minSize = activeConfig.minSize;
      const maxSize = activeConfig.maxSize;
      const sizeRange = maxSize - minSize;

      if (sizeCategory < 0.25) {
        // Small background petals (25%)
        size = minSize + Math.random() * (sizeRange * 0.4);
      } else if (sizeCategory < 0.94) {
        // Normal petals (69%)
        size = minSize + (sizeRange * 0.3) + Math.random() * (sizeRange * 0.5);
      } else {
        // Large accent petals (6%)
        size = minSize + (sizeRange * 0.7) + Math.random() * (sizeRange * 0.3);
      }

      const isLargeAccent = sizeCategory >= 0.94;
      const depth = 0.45 + Math.random() * 0.55; // Parallax factor
      
      // Large accent petals fall slower and sway wider
      const speedYMultiplier = isLargeAccent ? 0.60 : 1.0;
      const swayMultiplier = isLargeAccent ? 1.45 : 1.0;

      const currentWidth = dimensionsRef.current.width || (canvas.parentElement?.clientWidth ?? window.innerWidth);
      const centerX = Math.random() * (currentWidth + 200) - 100;

      return {
        x: centerX,
        y: yPos,
        centerX,
        size,
        speedY: (0.25 + Math.random() * 0.50) * depth * speedYMultiplier, 
        sway: (35 + Math.random() * 60) * depth * swayMultiplier, 
        swaySpeed: 0.006 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        colorTuple: getRandomColorTuple(),
        opacity: activeConfig.minOpacity + Math.random() * (activeConfig.maxOpacity - activeConfig.minOpacity),
        depth
      };
    };

    // Resize Handler
    const resizeCanvas = (w?: number, h?: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = w ?? canvas.parentElement?.clientWidth ?? (window.visualViewport?.width ?? window.innerWidth);
      const height = h ?? canvas.parentElement?.clientHeight ?? window.innerHeight;

      dimensionsRef.current = { width, height };

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // 1. Recalculate config dynamically on resize
      const newConfig = getViewportConfig(width, pathname);
      config = newConfig;

      // 2. Reconcile particle count dynamically
      let petals = petalsRef.current;
      const targetCount = newConfig.targetCount;

      if (petals.length === 0) {
        // Initial population spread randomly across screen height
        const newPetals: Petal[] = [];
        for (let i = 0; i < targetCount; i++) {
          newPetals.push(createPetal(Math.random() * height, newConfig));
        }
        petalsRef.current = newPetals;
      } else if (petals.length < targetCount) {
        // Add more petals if container expanded
        while (petals.length < targetCount) {
          petals.push(createPetal(-40, newConfig));
        }
      } else if (petals.length > targetCount) {
        // Trim petals if container shrank
        petalsRef.current = petals.slice(0, targetCount);
      }

      // 3. Gently clamp or scale existing particles to fit the new size/opacity bounds
      petals = petalsRef.current;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        if (p.size > newConfig.maxSize) {
          p.size = newConfig.minSize + Math.random() * (newConfig.maxSize - newConfig.minSize);
        }
        if (p.opacity > newConfig.maxOpacity) {
          p.opacity = newConfig.minOpacity + Math.random() * (newConfig.maxOpacity - newConfig.minOpacity);
        }
      }
    };

    // Observers
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          resizeCanvas(width, height);
        }
      });
      resizeObserver.observe(canvas.parentElement);
    } else {
      resizeCanvas();
    }

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    // Drawing function for a single petal shape
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      // Simulate 3D tumbling by scaling height based on rotation
      const scaleX = p.depth;
      const scaleY = p.depth * Math.abs(Math.sin(p.phase * 0.5));
      ctx.scale(scaleX, scaleY);

      // Create subtle gradient shading for 3D look
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, p.colorTuple.highlight);
      grad.addColorStop(0.55, p.colorTuple.base);
      grad.addColorStop(1, p.colorTuple.shadow);

      ctx.fillStyle = grad;

      // Apply soft coral shadow for larger petals
      if (p.size > 14) {
        ctx.shadowColor = "rgba(201, 114, 88, 0.12)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
      }

      // Draw a soft organic teardrop petal shape
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.4, p.size * 0.4, p.size * 0.8, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.4, p.size * 0.8, -p.size * 0.7, -p.size * 0.4, 0, -p.size);
      ctx.closePath();
      
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      // Draw subtle center vein
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = p.colorTuple.vein;
      ctx.lineWidth = Math.max(0.65, p.size * 0.045);
      ctx.globalAlpha = p.opacity * 0.45; // Slightly translucent vein
      
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.75);
      ctx.quadraticCurveTo(p.size * 0.04, -p.size * 0.25, 0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    // Animation Frame Loop
    const update = () => {
      ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);

      const petals = petalsRef.current;
      const height = dimensionsRef.current.height;
      const width = dimensionsRef.current.width;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Update physics
        p.y += p.speedY;
        p.phase += p.swaySpeed;
        
        // Gentle wind drift to the right
        p.centerX += 0.15;
        p.x = p.centerX + Math.sin(p.phase) * p.sway;
        p.rotation += p.rotationSpeed;

        // Reset if petal falls below screen or drifts too far right
        if (p.y > height + p.size + 20 || p.x > width + p.size + 100) {
          petals[i] = createPetal(-40, config);
        } else {
          drawPetal(p);
        }
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    let isVisible = true;
    let intersectionObserver: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!animationFrameRef.current) {
              animationFrameRef.current = requestAnimationFrame(update);
            }
          } else {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
              animationFrameRef.current = null;
            }
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(canvas);
    } else {
      animationFrameRef.current = requestAnimationFrame(update);
    }

    // Page Visibility Pause (Save battery when tab is hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      } else {
        if (isVisible && !animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(update);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on Unmount
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pathname]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
