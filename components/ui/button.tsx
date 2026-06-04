
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import {
  cva,
  type VariantProps
} from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
  inline-flex items-center justify-center gap-2
  whitespace-nowrap
  rounded-xl
  font-medium
  transition-all duration-200
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-green-500/30
  disabled:pointer-events-none
  disabled:opacity-50
  active:scale-[0.98]
  `,
  {
    variants: {
      variant: {
        default: `
          bg-green-600
          text-white
          hover:bg-green-500
          shadow-sm
        `,

        secondary: `
          bg-[#1f2937]
          text-white
          border border-white/10
          hover:bg-[#243041]
        `,

        outline: `
          border border-white/10
          bg-transparent
          text-white
          hover:bg-white/5
          hover:border-white/20
        `,

        ghost: `
          text-white/70
          hover:bg-white/5
          hover:text-white
        `,

        destructive: `
          bg-red-600
          text-white
          hover:bg-red-500
        `,

        glass: `
          border border-white/10
          bg-white/[0.04]
          text-white
          backdrop-blur-xl
          hover:bg-white/[0.08]
        `
      },

      size: {
        default: `
          h-11
          px-5
          text-sm
        `,

        sm: `
          h-9
          px-4
          text-xs
          rounded-lg
        `,

        lg: `
          h-13
          px-8
          text-base
        `,

        xl: `
          h-15
          px-10
          text-lg
          rounded-2xl
        `,

        icon: `
          h-11
          w-11
          p-0
        `
      }
    },

    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

