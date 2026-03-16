import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only show splash screen in Tauri environment
    const isTauri = !!(window as any).__TAURI_INTERNALS__;
    
    // Check if splash has already been shown in this session
    const hasShownSplash = sessionStorage.getItem('hasShownSplash');

    if (!isTauri || hasShownSplash) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, 5000); // Fallback timeout

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleComplete = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasShownSplash', 'true');
    // Give time for fade out animation
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleComplete}
        className="max-w-full max-h-full object-contain"
      >
        <source src="/videos/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default SplashScreen;
