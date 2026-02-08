import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-2xl p-1.5 text-muted-foreground",
      "bg-background/20 backdrop-blur-2xl backdrop-saturate-150",
      "border border-white/20 dark:border-white/10",
      "shadow-[0_8px_32px_hsl(var(--primary)/0.1),inset_0_1px_0_hsl(0_0%_100%/0.4),inset_0_-1px_0_hsl(0_0%_0%/0.1)]",
      "dark:shadow-[0_8px_32px_hsl(0_0%_0%/0.3),inset_0_1px_0_hsl(0_0%_100%/0.1),inset_0_-1px_0_hsl(0_0%_0%/0.2)]",
      "relative overflow-hidden",
      className,
    )}
    {...props}
  >
    {/* Liquid glass shine effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-transparent to-transparent pointer-events-none" />
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-shimmer" />
    {props.children}
  </TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium",
      "ring-offset-background transition-all duration-300 ease-out",
      "relative z-10",
      "data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-xl",
      "data-[state=active]:text-foreground data-[state=active]:shadow-[0_4px_16px_hsl(var(--primary)/0.2),inset_0_1px_0_hsl(0_0%_100%/0.5)]",
      "data-[state=active]:border data-[state=active]:border-white/30",
      "data-[state=inactive]:hover:bg-background/40 data-[state=inactive]:hover:backdrop-blur-md",
      "data-[state=inactive]:hover:text-foreground/80",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
