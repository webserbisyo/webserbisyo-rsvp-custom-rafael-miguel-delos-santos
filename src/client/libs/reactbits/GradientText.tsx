"use client";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
};

export default function GradientText({
  children,
  className = "",
  colors = ["var(--color-coral)", "var(--gold)", "var(--color-blush)", "var(--color-coral)"],
  animationSpeed = 5,
}: GradientTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "300% 300%",
        animation: `gradient-shift ${animationSpeed}s ease infinite`,
      }}
    >
      {children}
    </span>
  );
}
