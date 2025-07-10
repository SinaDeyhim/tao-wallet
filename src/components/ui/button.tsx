import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md text-sm font-medium",
    "transition-all duration-300 ease-in-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "text-white bg-blue-600 shadow-md hover:shadow-lg hover:scale-[1.02]",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 shadow-sm focus-visible:ring-red-500/50",
        outline:
          "border border-white/20 text-white bg-transparent hover:bg-white/10",
        ghost: "bg-transparent text-white hover:bg-white/10",
        link: "text-primary underline underline-offset-4 hover:text-primary/80",
        secondary:
          "border border-gray-600 text-gray-300 bg-transparent hover:gray-600 hover:text-white hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 px-3 rounded-md text-sm has-[>svg]:px-2.5",
        lg: "h-11 px-6 rounded-md text-base has-[>svg]:px-5",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
