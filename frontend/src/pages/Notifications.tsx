import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Video, 
  Brain, 
  Target, 
  CheckCircle,
  Trash2,
  Settings,
  Users,
  Swords,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationData {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'interview': return Video;
    case 'quiz': return Brain;
    case 'skill': return Target;
    case 'achievement': return CheckCircle;
    case 'gd': return Users;
    case 'debate': return Swords;
    default: return Bell;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'interview': return "bg-blue-100 dark:bg-blue-900/30 text-blue-600";
    case 'quiz': return "bg-purple-100 dark:bg-purple-900/30 text-purple-600";
    case 'skill': return "bg-green-100 dark:bg-green-900/30 text-green-600";
    case 'achievement': return "bg-amber-100 dark:bg-amber-900/30 text-amber-600";
    case 'gd': return "bg-orange-100 dark:bg-orange-900/30 text-orange-600";
    case 'debate': return "bg-red-100 dark:bg-red-900/30 text-red-600";
    default: return "bg-gray-100 dark:bg-gray-800 text-gray-600";
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Notifications
            </h1>
            <p className="text-muted-foreground text-sm">
              Global preparation updates. The latest 5 announcements are shown below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0 divide-y divide-border/40 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground">Loading notifications...</div>
            ) : (
              <div className="relative">
                <AnimatePresence initial={false}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      return (
                        <motion.div 
                          key={notification._id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group flex items-start gap-4 p-4 sm:p-6 hover:bg-accent/20 transition-all relative"
                        >
                          <div className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform",
                            getColor(notification.type)
                          )}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-base text-foreground font-semibold">
                                {notification.title}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-xs text-muted-foreground/60 font-medium">
                                {new Date(notification.createdAt).toLocaleDateString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              
                              <div className="flex items-center gap-2">
                                {notification.link && (
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="h-8 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all gap-1"
                                    onClick={() => navigate(notification.link!)}
                                  >
                                    {notification.type === 'gd' ? 'Join Discussion' : 'Go to Practice'}
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-20 text-center"
                    >
                      <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="font-bold text-xl text-foreground mb-2">No notifications yet</p>
                      <p className="text-muted-foreground max-w-xs mx-auto">
                        Check back later for daily global tips.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;

