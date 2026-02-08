import bgPattern from "@/assets/bg-pattern.jpg";

interface PageBackgroundProps {
  variant?: "default" | "subtle" | "hero";
}

const PageBackground = ({ variant = "default" }: PageBackgroundProps) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgPattern})` }}
      />
      
      {/* Gradient Overlays */}
      <div 
        className={`absolute inset-0 ${
          variant === "hero" 
            ? "bg-gradient-to-b from-background/70 via-background/85 to-background"
            : variant === "subtle"
            ? "bg-gradient-to-b from-background/90 via-background/95 to-background"
            : "bg-gradient-to-b from-background/80 via-background/90 to-background"
        }`} 
      />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
      <div 
        className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-float" 
        style={{ animationDelay: "-3s" }} 
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px]" 
      />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
    </div>
  );
};

export default PageBackground;
