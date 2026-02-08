import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary/90 backdrop-blur-md text-primary-foreground hover:bg-primary hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 border border-primary/20",
        destructive: "bg-destructive/90 backdrop-blur-md text-destructive-foreground hover:bg-destructive hover:shadow-lg hover:shadow-destructive/25 hover:-translate-y-0.5 border border-destructive/20",
        outline: "border border-border/50 bg-background/60 backdrop-blur-md hover:bg-accent/80 hover:text-accent-foreground hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5",
        secondary: "bg-secondary/80 backdrop-blur-md text-secondary-foreground hover:bg-secondary hover:shadow-md hover:-translate-y-0.5 border border-secondary/30",
        ghost: "hover:bg-accent/60 backdrop-blur-sm hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-background/20 backdrop-blur-xl border border-border/30 text-foreground hover:bg-background/40 hover:border-border/50 hover:shadow-lg hover:-translate-y-0.5 shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
