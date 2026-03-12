import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Rocket,
  LayoutDashboard,
  Video,
  FileText,
  Brain,
  Keyboard,
  Code,
  TrendingUp,
  Target,
  BookOpen,
  Building2,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  MessageSquare,
  Menu,
  X,
  Shield,
  Users,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PageBackground from "@/components/layout/PageBackground";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Domain Prep", path: "/dashboard/domain" },
  { icon: MessageSquare, label: "Forum", path: "/dashboard/forum" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Shield, label: "Admin", path: "/dashboard/admin" },
  { icon: MessageSquare, label: "Test Connection", path: "/dashboard/test-connection" },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const isInterviewSession = location.pathname.includes('/dashboard/interview/session');

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Redirect admins to admin dashboard if they try to access user dashboard
        if (parsedUser.role === 'admin' && location.pathname.startsWith('/dashboard')) {
          navigate('/admin');
        }
      }
    };

    loadUser(); // Load on mount

    // Listen for custom event from Profile page
    window.addEventListener("userInfoUpdated", loadUser);
    
    return () => {
      window.removeEventListener("userInfoUpdated", loadUser);
    };
  }, [navigate, location.pathname]);

  // Close mobile menu on route change & auto-collapse on interview
  useEffect(() => {
    setMobileMenuOpen(false);
    // Auto-collapse sidebar when entering any module (any path deeper than /dashboard)
    if (location.pathname !== '/dashboard' && location.pathname !== '/dashboard/') {
      setCollapsed(true);
    }
  }, [location.pathname]);

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <nav className={cn("space-y-1", mobile ? "p-2" : "p-3 overflow-y-auto h-[calc(100vh-8rem)]")}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                !isActive && "group-hover:scale-110"
              )} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section for mobile */}
      {mobile && (
        <div className="border-t border-border p-3 mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profilePicture || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email || "Student"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Link
              to="/dashboard/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link
              to="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Link>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageBackground variant="subtle" />

      {/* Mobile Header */}
      {!isInterviewSession && (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card/70 backdrop-blur-xl border-b border-border/40 z-50 flex items-center justify-between px-4 shadow-lg">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CareerCraft</span>
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-primary-foreground" />
                  </div>
                  CareerCraft
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <NavContent mobile />
              </div>
            </SheetContent>
          </Sheet>
        </header>
      )}

      {/* Desktop Sidebar */}
      {!isInterviewSession && (
        <aside className={cn(
          "hidden lg:block fixed left-0 top-0 h-full transition-all duration-300 z-40",
          (location.pathname !== '/dashboard' && location.pathname !== '/dashboard/' && collapsed)
            ? "w-fit bg-transparent border-none shadow-none"
            : "bg-card/70 backdrop-blur-xl border-r border-border/40 shadow-xl",
          !((location.pathname !== '/dashboard' && location.pathname !== '/dashboard/' && collapsed)) && (collapsed ? "w-16" : "w-64")
        )}>
          {/* Header with Toggle */}
          <div className="h-16 flex items-center justify-between px-3 border-b border-border/40">
            {!collapsed ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-foreground truncate">CareerCraft</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed(true)}
                  className="hover:bg-accent shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(false)}
                className="mx-auto h-12 w-12 hover:bg-transparent rounded-lg flex items-center justify-center p-0"
              >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:scale-110 transition-transform">
                  <Rocket className="w-4 h-4 text-primary-foreground" />
                </div>
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
            (location.pathname !== '/dashboard' && location.pathname !== '/dashboard/' && collapsed) ? "hidden" : "block"
          )}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 border-t border-border/40 bg-card/50 backdrop-blur-xl",
            (location.pathname !== '/dashboard' && location.pathname !== '/dashboard/' && collapsed) ? "hidden" : "block"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                  collapsed && "justify-center"
                )}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profilePicture || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || "Student"}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        !isInterviewSession && "pt-14 lg:pt-0", // Account for mobile header
        !isInterviewSession && (collapsed ? "lg:ml-16" : "lg:ml-64")
      )}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
