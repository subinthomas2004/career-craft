import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  className?: string;
}

const TranscriptDisplay = ({ transcript, interimTranscript, className }: TranscriptDisplayProps) => {
  const hasContent = transcript || interimTranscript;

  return (
    <div className={cn("bg-card/80 backdrop-blur rounded-xl border border-border p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Your Response
        </span>
      </div>
      <ScrollArea className="h-24">
        {hasContent ? (
          <p className="text-sm text-foreground leading-relaxed">
            {transcript}
            {interimTranscript && (
              <span className="text-muted-foreground italic"> {interimTranscript}</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Start speaking... your response will appear here
          </p>
        )}
      </ScrollArea>
    </div>
  );
};

export default TranscriptDisplay;
