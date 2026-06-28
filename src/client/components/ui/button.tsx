import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 disabled:pointer-events-none disabled:border-cocoa/15 disabled:text-cocoa/60 disabled:bg-transparent",
  {
    variants: {
      variant: {
        default:
          "border border-terracotta bg-terracotta text-white hover:bg-terracotta/90",
        outline:
          "border border-cocoa/10 bg-transparent text-cocoa hover:border-cocoa/30 hover:bg-cocoa/5",
        secondary:
          "border border-transparent bg-terracotta/10 text-terracotta hover:bg-terracotta/20",
        ghost: "hover:bg-cocoa/5 text-cocoa",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
