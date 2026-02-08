import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

const StatCard = ({ icon: Icon, title, value, change, changeType = "neutral", className }: StatCardProps) => {
  return (
    <div className={cn(
      "group p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl hover:shadow-lg hover:border-border/60 transition-all duration-300 shadow-md hover:-translate-y-1",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        {change && (
          <span className={cn(
            "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full hidden sm:inline-block transition-transform duration-300 group-hover:scale-105",
            changeType === "positive" && "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
            changeType === "negative" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
            changeType === "neutral" && "bg-muted text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-2 sm:mt-4">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground transition-transform duration-300 group-hover:scale-105 origin-left">{value}</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">{title}</p>
      </div>
    </div>
  );
};

export { StatCard };
