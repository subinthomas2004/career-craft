import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  hue: number;
  saturation: number;
  lightness: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Color palette - purple, teal, pink, blue
    const colorPalette = [
      { hue: 250, saturation: 85, lightness: 65 }, // Purple
      { hue: 280, saturation: 80, lightness: 60 }, // Violet
      { hue: 170, saturation: 75, lightness: 50 }, // Teal
      { hue: 200, saturation: 80, lightness: 55 }, // Blue
      { hue: 320, saturation: 70, lightness: 60 }, // Pink
    ];

    // Initialize particles with varied colors and sizes
    const particleCount = 100;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      const baseRadius = Math.random() * 3 + 1;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: baseRadius,
        baseRadius,
        opacity: Math.random() * 0.6 + 0.3,
        hue: color.hue + (Math.random() - 0.5) * 20,
        saturation: color.saturation + (Math.random() - 0.5) * 10,
        lightness: color.lightness + (Math.random() - 0.5) * 10,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction - attract particles with glow effect
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let mouseInfluence = 0;
        if (distance < 180 && distance > 0) {
          const force = (180 - distance) / 180;
          mouseInfluence = force;
          particle.vx += (dx / distance) * force * 0.025;
          particle.vy += (dy / distance) * force * 0.025;
        }

        // Pulsing size effect
        const pulse = Math.sin(timeRef.current * particle.pulseSpeed * 60 + particle.pulsePhase);
        particle.radius = particle.baseRadius * (1 + pulse * 0.3 + mouseInfluence * 0.5);

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Friction
        particle.vx *= 0.985;
        particle.vy *= 0.985;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Dynamic color shift based on position and time
        const colorShift = Math.sin(timeRef.current * 0.5 + particle.x * 0.001) * 15;
        const currentHue = particle.hue + colorShift;

        // Draw glow effect for larger particles
        if (particle.radius > 2) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 3
          );
          gradient.addColorStop(0, `hsla(${currentHue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.opacity * 0.4})`);
          gradient.addColorStop(1, `hsla(${currentHue}, ${particle.saturation}%, ${particle.lightness}%, 0)`);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw particle core
        const coreGradient = ctx.createRadialGradient(
          particle.x - particle.radius * 0.3, particle.y - particle.radius * 0.3, 0,
          particle.x, particle.y, particle.radius
        );
        coreGradient.addColorStop(0, `hsla(${currentHue}, ${particle.saturation}%, ${particle.lightness + 20}%, ${particle.opacity})`);
        coreGradient.addColorStop(1, `hsla(${currentHue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.opacity * 0.6})`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();

        // Draw gradient connections
        particlesRef.current.slice(i + 1).forEach((other) => {
          const cdx = particle.x - other.x;
          const cdy = particle.y - other.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < 140) {
            const lineOpacity = 0.2 * (1 - dist / 140);
            
            // Create gradient line between particles
            const lineGradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
            lineGradient.addColorStop(0, `hsla(${particle.hue + colorShift}, ${particle.saturation}%, ${particle.lightness}%, ${lineOpacity})`);
            lineGradient.addColorStop(1, `hsla(${other.hue + colorShift}, ${other.saturation}%, ${other.lightness}%, ${lineOpacity})`);
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Draw mouse glow effect
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const mouseGradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 100
        );
        mouseGradient.addColorStop(0, `hsla(250, 85%, 70%, 0.15)`);
        mouseGradient.addColorStop(0.5, `hsla(280, 80%, 60%, 0.08)`);
        mouseGradient.addColorStop(1, `hsla(170, 75%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = mouseGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
      
      {/* Gradient mesh overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 0% 0%, hsl(250 85% 60% / 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, hsl(280 85% 55% / 0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 100%, hsl(170 80% 45% / 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, hsl(200 80% 50% / 0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, hsl(320 70% 55% / 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/25 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-secondary/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: "1.5s", background: "hsl(320 70% 55% / 0.15)" }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default ParticleBackground;

