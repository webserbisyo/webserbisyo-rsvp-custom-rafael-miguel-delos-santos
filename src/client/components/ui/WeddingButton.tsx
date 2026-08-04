"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const weddingButtonVariants = cva("wedding-button", {
  variants: {
    variant: {
      primary: "wedding-button--primary",
      secondary: "wedding-button--secondary",
      ghost: "wedding-button--ghost",
    },
    size: {
      sm: "wedding-button--sm",
      md: "wedding-button--md",
      lg: "wedding-button--lg",
      icon: "wedding-button--icon",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type WeddingButtonVariant = "primary" | "secondary" | "ghost";
export type WeddingButtonSize = "sm" | "md" | "lg" | "icon";

export interface WeddingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof weddingButtonVariants> {
  asChild?: boolean;
}

export const WeddingButton = React.forwardRef<HTMLButtonElement, WeddingButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(weddingButtonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);

WeddingButton.displayName = "WeddingButton";
