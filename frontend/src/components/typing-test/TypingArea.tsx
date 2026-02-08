import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists
import { TypingState } from '@/lib/typing/engine';
import { motion } from 'framer-motion';

interface TypingAreaProps {
    state: TypingState;
    className?: string;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ state, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

    // Auto-scroll to cursor
    useEffect(() => {
        if (cursorRef.current && containerRef.current) {
            // Simple logic: maintain cursor in view
            // More complex logic: center cursor?

            const container = containerRef.current;
            const cursor = cursorRef.current;

            const containerRect = container.getBoundingClientRect();
            const cursorRect = cursor.getBoundingClientRect();

            // Check if cursor is near bottom
            if (cursorRect.bottom > containerRect.bottom - 40) {
                container.scrollTop += 40; // Scroll down a line approx
            }
        }
    }, [state.cursorPosition]);

    return (
        <div
            className={cn(
                "relative font-mono text-xl lg:text-2xl leading-relaxed outline-none select-none",
                className
            )}
            ref={containerRef}
        >
            <div className="break-words whitespace-pre-wrap">
                {state.text.split('').map((char, index) => {
                    let charClass = "text-muted-foreground transition-colors duration-75";
                    let isCursor = index === state.cursorPosition;

                    if (index < state.typed.length) {
                        const typedChar = state.typed[index];
                        if (typedChar === char) {
                            charClass = "text-foreground font-medium";  // Correct
                        } else {
                            charClass = "text-destructive bg-destructive/10"; // Incorrect
                        }
                    }

                    return (
                        <React.Fragment key={index}>
                            {isCursor && (
                                <motion.span
                                    layoutId="cursor"
                                    className="absolute w-[2px] h-[1.2em] bg-primary align-middle"
                                // Position logic needs to be robust. 
                                // Instead of absolute, better to be inline-block w-0 relative?
                                // Or just a blinking pipe char right before?
                                // Absolute positioning relative to the character span is tricky with line breaks.
                                // Let's rely on a pseudo-element or a special span injected.
                                // Actually, the simplest 'cursor' is a border-left on the current character.
                                />
                            )}
                            {/* 
                   Better Cursor Approach: 
                   Border left on active character.
                   If active char is space, we need to make sure it has width.
                */}
                            <span
                                ref={isCursor ? cursorRef : null}
                                className={cn(
                                    charClass,
                                    // Cursor styling
                                    isCursor && state.status !== 'finished' && "border-l-2 border-primary animate-pulse pl-[1px]",
                                    // Handle space styling explicitly so it's visible if red
                                    char === ' ' && index < state.typed.length && state.typed[index] !== char && "bg-destructive/20"
                                )}
                            >
                                {char}
                            </span>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
