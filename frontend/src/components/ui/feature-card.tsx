import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  gradient?: boolean;
  image?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className, gradient, image }: FeatureCardProps) => {
  return (
    <div className={cn(
      "group relative p-6 rounded-2xl border border-border/40 bg-card/70 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-2 overflow-hidden shadow-lg",
      gradient && "bg-gradient-to-br from-primary/5 to-accent/30",
      className
    )}>
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {image ? (
        <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
        </div>
      )}
      <h3 className="relative text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="relative text-muted-foreground text-sm leading-relaxed">{description}</p>
      
      {/* Bottom highlight line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
};

export { FeatureCard };
