import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Video, 
  Brain, 
  Target, 
  CheckCircle,
  Trash2,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const initialNotifications = [
  {
    id: 1,
    type: "interview",
    title: "Interview Feedback Ready",
    message: "Your mock interview analysis is complete. View your detailed feedback.",
    time: "5 minutes ago",
    read: false,
    icon: Video
  },
  {
    id: 2,
    type: "quiz",
    title: "New Quiz Available",
    message: "A new DSA quiz on 'Dynamic Programming' has been added.",
    time: "1 hour ago",
    read: false,
    icon: Brain
  },
  {
    id: 3,
    type: "skill",
    title: "Skill Gap Update",
    message: "Your skill analysis has been updated based on recent activities.",
    time: "3 hours ago",
    read: true,
    icon: Target
  },
  {
    id: 4,
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "You've completed 10 mock interviews. Keep it up!",
    time: "Yesterday",
    read: true,
    icon: CheckCircle
  },
  {
    id: 5,
    type: "quiz",
    title: "Quiz Reminder",
    message: "You haven't taken a quiz in 3 days. Stay consistent!",
    time: "2 days ago",
    read: true,
    icon: Brain
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with your progress and new content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <div className="bg-primary/10 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                Stay on top of your preparation progress
              </p>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    notification.type === "interview" ? "bg-blue-100 dark:bg-blue-950" :
                    notification.type === "quiz" ? "bg-purple-100 dark:bg-purple-950" :
                    notification.type === "skill" ? "bg-green-100 dark:bg-green-950" :
                    "bg-amber-100 dark:bg-amber-950"
                  )}>
                    <notification.icon className={cn(
                      "w-5 h-5",
                      notification.type === "interview" ? "text-blue-600" :
                      notification.type === "quiz" ? "text-purple-600" :
                      notification.type === "skill" ? "text-green-600" :
                      "text-amber-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "font-medium text-foreground",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium text-foreground mb-2">No notifications</p>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
