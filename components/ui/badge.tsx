import * as React from "react";

import {
  cva,
  type VariantProps
} from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  `
  inline-flex items-center
  rounded-full
  border
  px-2.5 py-1
  text-xs font-medium
  transition-colors
  `,
  {
    variants: {
      variant: {
        default: `
          border-green-500/20
          bg-green-500/10
          text-green-400
        `,

        secondary: `
          border-white/10
          bg-white/[0.05]
          text-white/70
        `,

        outline: `
          border-white/10
          bg-transparent
          text-white/70
        `,

        success: `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-400
        `,

        warning: `
          border-amber-500/20
          bg-amber-500/10
          text-amber-300
        `,

        danger: `
          border-red-500/20
          bg-red-500/10
          text-red-400
        `,

        info: `
          border-cyan-500/20
          bg-cyan-500/10
          text-cyan-400
        `
      }
    },

    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

