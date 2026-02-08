import { cn } from "@/lib/utils";

interface SpeakingIndicatorProps {
  isActive: boolean;
  className?: string;
}

const SpeakingIndicator = ({ isActive, className }: SpeakingIndicatorProps) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={cn(
            "w-1 rounded-full bg-primary transition-all duration-150",
            isActive ? "animate-pulse" : "h-1"
          )}
          style={{
            height: isActive ? `${Math.random() * 16 + 8}px` : '4px',
            animationDelay: `${bar * 50}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default SpeakingIndicator;
