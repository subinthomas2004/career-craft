import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Menu, 
  X,
  User,
  LogIn
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isLanding ? "bg-background/30 backdrop-blur-xl border-b border-border/30" : "bg-card/70 backdrop-blur-xl border-b border-border/40 shadow-lg"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Career<span className="text-primary">Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link to="/auth?mode=register" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-card/95 backdrop-blur-lg">
            <div className="flex flex-col gap-4">
              <Link 
                to="/features" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/auth?mode=register" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
