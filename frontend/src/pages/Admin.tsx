import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Shield,
  Activity,
  Clock,
  RefreshCw,
  Ban,
  LogOut,
  History,
  AlertOctagon,
  MessageCircle,
  Globe,
  CheckSquare,
  Bell,
  Send,
  Megaphone,
  Mail,
  Flame,
  Calendar,
  Trophy
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TestGroqConnection from "./TestGroqConnection";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([
    { label: "Total Users", value: "0", change: "+0%", icon: Users, trend: "neutral" },
    { label: "Active Sessions", value: "0", change: "0%", icon: Activity, trend: "neutral" },
    { label: "Pending Feedback", value: "0", change: "0%", icon: AlertTriangle, trend: "neutral" },
    { label: "Forum Posts", value: "0", change: "0%", icon: FileText, trend: "neutral" },
  ]);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  // For Feedback Resolution dialog
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // For Notification Broadcast
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState("update");
  const [notifLink, setNotifLink] = useState("");
  const [isSendingNotif, setIsSendingNotif] = useState(false);

  // For Email Broadcast
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailLink, setEmailLink] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const getHeaders = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/auth");
      return null;
    }
    const { token } = JSON.parse(userInfo);
    return { Authorization: `Bearer ${token}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      if (!headers) return;

      const config = { headers };

      // Parallel requests
      const [statsRes, usersRes, logsRes, feedbackRes, postsRes] = await Promise.all([
        api.get('/admin/stats', config),
        api.get('/admin/users', config),
        api.get('/admin/logs', config).catch(() => ({ data: [] })),
        api.get('/admin/feedback', config).catch(() => ({ data: [] })),
        api.get('/admin/forum/posts', config).catch(() => ({ data: [] })),
      ]);

      const iconMap: any = { Users, Activity, AlertTriangle, FileText };
      const processedStats = statsRes.data.stats.map((s: any) => ({
        ...s,
        icon: iconMap[s.icon] || Users
      }));

      setStats(processedStats);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setFeedback(feedbackRes.data);
      setPosts(postsRes.data);

    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      toast.error(`Error: ${error.response?.data?.message || "Failed to sync dashboard"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // User Operations
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const headers = getHeaders();
      await api.delete(`/admin/users/${id}`, { headers });
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) { toast.error("Failed to delete user"); }
  };

  const toggleSuspendUser = async (id: string) => {
    try {
      const headers = getHeaders();
      const { data } = await api.put(`/admin/users/${id}/toggle-suspend`, {}, { headers });
      toast.success(data.message);
      fetchData();
    } catch (error) { toast.error("Operation failed"); }
  };

  // Feedback Operations
  const handleResolveFeedback = async (status: 'resolved' | 'in_review') => {
    if (!selectedFeedback) return;
    setIsSubmittingReply(true);
    try {
      const headers = getHeaders();
      await api.put(`/admin/feedback/${selectedFeedback._id}`, { status, adminReply }, { headers });
      toast.success(`Feedback marked as ${status}`);
      setSelectedFeedback(null);
      setAdminReply("");
      fetchData();
    } catch (error) { toast.error("Failed to update feedback"); }
    finally { setIsSubmittingReply(false); }
  };

  // Forum Operations
  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Delete this post from forum?")) return;
    try {
      const headers = getHeaders();
      await api.delete(`/forum/posts/${id}`, { headers });
      toast.success("Post deleted successfully");
      fetchData();
    } catch (error) { toast.error("Failed to delete post"); }
  };

  // Notification Operations
  const handleSendNotification = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }
    setIsSendingNotif(true);
    try {
      const headers = getHeaders();
      await api.post('/admin/notifications', {
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        link: notifLink
      }, { headers });
      toast.success("Notification successfully broadcasted to users!");
      setNotifTitle("");
      setNotifMessage("");
      setNotifLink("");
    } catch (error) { 
      console.error("Broadcast error:", error);
      toast.error("Failed to broadcast notification"); 
    } finally { 
      setIsSendingNotif(false); 
    }
  };

  const handleSendEmailBroadcast = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error("Subject and email body content are required");
      return;
    }
    
    if (!window.confirm("WARNING: You are about to send an email blast to ALL active platform users. Continue?")) {
      return;
    }

    setIsSendingEmail(true);
    try {
      const headers = getHeaders();
      const { data } = await api.post('/admin/email-broadcast', {
        subject: emailSubject,
        message: emailMessage,
        link: emailLink
      }, { headers });
      
      toast.success(`Success! Email blast finished (${data.successCount} delivered, ${data.failureCount} failed)`);
      setEmailSubject("");
      setEmailMessage("");
      setEmailLink("");
    } catch (error: any) { 
      console.error("Email broadcast error:", error);
      toast.error(error.response?.data?.message || "Failed to launch email blast"); 
    } finally { 
      setIsSendingEmail(false); 
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen bg-background text-foreground w-full max-w-[1600px] mx-auto">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6 border-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
              <Shield className="w-6 h-6" />
            </div>
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground font-medium">Secure oversight of users, platform activity, and configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="bg-background hover:bg-accent" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>
          <Button variant="ghost" onClick={() => { localStorage.removeItem("userInfo"); navigate("/"); }} className="text-destructive hover:bg-destructive/5">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card shadow-sm border-border relative overflow-hidden group transition-all hover:shadow-md">
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                {stat.change !== "0%" && (
                  <span className="text-xs text-green-500 flex items-center font-medium">{stat.change} from yesterday</span>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Navigation Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="w-full flex flex-wrap justify-start bg-accent/50 h-auto p-1 gap-1">
          <TabsTrigger value="users" className="flex-1 md:flex-none gap-2 py-2.5 px-4">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex-1 md:flex-none gap-2 py-2.5 px-4">
            <History className="w-4 h-4" /> System Logs
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1 md:flex-none gap-2 py-2.5 px-4 relative">
            <MessageCircle className="w-4 h-4" /> Feedback
            {feedback.filter(f => f.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 md:flex-none gap-2 py-2.5 px-4">
            <Bell className="w-4 h-4" /> Broadcast
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex-1 md:flex-none gap-2 py-2.5 px-4">
            <Mail className="w-4 h-4" /> Email Blast
          </TabsTrigger>
          <TabsTrigger value="forum" className="flex-1 md:flex-none gap-2 py-2.5 px-4">
            <FileText className="w-4 h-4" /> Forum Moderation
          </TabsTrigger>
          <TabsTrigger value="test" className="flex-1 md:flex-none gap-2 py-2.5 px-4">
            <Globe className="w-4 h-4" /> API Status
          </TabsTrigger>
        </TabsList>

        {/* -- USERS TAB -- */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border bg-accent/20">
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, status, and access permissions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="pl-6">Identity</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Progress Highlights</TableHead>
                      <TableHead className="hidden lg:table-cell">Member Since</TableHead>
                      <TableHead className="text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} className={user.isSuspended ? 'opacity-75 bg-destructive/5' : ''}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 border border-border">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                {user.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground flex items-center gap-2">
                                {user.name}
                                {user.isSuspended && <Badge variant="destructive" className="px-1 py-0 text-[9px]">Suspended</Badge>}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.streak > 0 && (
                              <div className="flex items-center gap-1 text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full" title="Current streak">
                                <Flame className="w-3 h-3 fill-orange-500" /> {user.streak}
                              </div>
                            )}
                            {user.stats?.interviewsAttended > 0 && (
                              <div className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full" title="Interviews attended">
                                <Trophy className="w-3 h-3" /> {user.stats.interviewsAttended} Intv
                              </div>
                            )}
                            {(!user.streak && !user.stats?.interviewsAttended) && (
                              <span className="text-xs text-muted-foreground italic">No activity recorded</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            {user.role !== 'admin' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- SYSTEM LOGS TAB -- */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b bg-accent/20">
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Security & Access Logs
              </CardTitle>
              <CardDescription>Audit trail of logins, actions, and suspicious events.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[200px]">Timestamp</TableHead>
                    <TableHead>User / Target</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">IP Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No activity logs found.</TableCell></TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log._id} className={log.action === 'suspicious_activity' ? 'bg-orange-50 dark:bg-orange-950/20' : ''}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.userName || log.userEmail || 'Unknown User'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.action === 'login' ? 'border-blue-500/30 text-blue-600 bg-blue-50' :
                                log.action === 'suspicious_activity' ? 'border-red-500 text-red-600 bg-red-50' : 'bg-gray-50'
                            }
                          >
                            {log.action === 'suspicious_activity' && <AlertOctagon className="w-3 h-3 mr-1" />}
                            {log.action.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate text-sm">{log.details}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{log.ipAddress || '::1'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- FEEDBACK TAB -- */}
        <TabsContent value="feedback" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b bg-accent/20">
              <CardTitle>Support Tickets & Feedback</CardTitle>
              <CardDescription>Read and resolve complaints or requests from users.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-1/3">Message Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No support tickets submitted.</TableCell></TableRow>
                  ) : (
                    feedback.map((f) => (
                      <TableRow key={f._id}>
                        <TableCell>
                          <span className="font-medium">{f.userName}</span>
                          <div className="text-xs text-muted-foreground">{f.userEmail}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{f.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{f.title}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              f.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                                f.status === 'in_review' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-blue-100 text-blue-800 border-blue-200'
                            }
                          >
                            {f.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedFeedback(f)} className="text-primary hover:underline font-semibold">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- NOTIFICATIONS BROADCAST TAB -- */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border shadow-sm max-w-3xl mx-auto">
            <CardHeader className="border-b bg-accent/20">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Send System Broadcast
              </CardTitle>
              <CardDescription>Draft a new update notification that will appear in the users' notification feeds.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ntype" className="font-semibold">Notification Type</Label>
                  <select 
                    id="ntype" 
                    value={notifType} 
                    onChange={(e) => setNotifType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="update">Platform Update</option>
                    <option value="announcement">General Announcement</option>
                    <option value="system">System Alert</option>
                    <option value="achievement">Achievement Highlight</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ntitle" className="font-semibold">Headline / Title</Label>
                  <Input 
                    id="ntitle" 
                    placeholder="e.g. Version 2.0 Released, Server Maintenance Coming" 
                    value={notifTitle} 
                    onChange={(e) => setNotifTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nmsg" className="font-semibold">Notification Body Message</Label>
                  <Textarea 
                    id="nmsg" 
                    placeholder="Describe the update in detail here..." 
                    rows={5} 
                    value={notifMessage} 
                    onChange={(e) => setNotifMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nlink" className="font-semibold">Action Link / URL <span className="font-normal text-muted-foreground">(Optional)</span></Label>
                  <Input 
                    id="nlink" 
                    placeholder="e.g. /dashboard/interview or https://youtube.com/..." 
                    value={notifLink} 
                    onChange={(e) => setNotifLink(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Starts with / for internal dashboard routing, or http for external sites.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSendNotification} 
                  disabled={isSendingNotif}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  {isSendingNotif ? (
                    "Sending Broadcast..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Notification
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card className="border-border shadow-sm max-w-3xl mx-auto border-t-4 border-t-blue-500">
            <CardHeader className="border-b bg-accent/10">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Dispatch Direct Email Blast
              </CardTitle>
              <CardDescription>Directly message active users in their primary inbox using system templates.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="esubject" className="font-semibold">Email Subject Line</Label>
                  <Input 
                    id="esubject" 
                    placeholder="e.g. New CareerCraft updates have arrived!" 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emsg" className="font-semibold">Email Body Text</Label>
                  <Textarea 
                    id="emsg" 
                    placeholder="Type full length announcement message here. Line breaks are preserved." 
                    rows={8} 
                    value={emailMessage} 
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elink" className="font-semibold">Target Destination (Action Button Label)</Label>
                  <Input 
                    id="elink" 
                    placeholder="e.g. /dashboard/skill-gap" 
                    value={emailLink} 
                    onChange={(e) => setEmailLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSendEmailBroadcast} 
                  disabled={isSendingEmail}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSendingEmail ? (
                    "Distributing Emails..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Execute Email Blast
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- FORUM TAB -- */}
        <TabsContent value="forum" className="space-y-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b bg-accent/20">
              <CardTitle>Forum Posts Governance</CardTitle>
              <CardDescription>Moderate live content submitted to the user forum.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead className="w-1/2">Post Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Posted</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No forum posts found.</TableCell></TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell className="font-medium">{post.authorName}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{post.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-lg">{post.content}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{post.postType || 'text'}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeletePost(post._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- TEST TAB -- */}
        <TabsContent value="test" className="space-y-4">
          <div className="p-1">
            <TestGroqConnection />
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Review Dialog Overlay */}
      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Review Feedback Request
              <Badge className="capitalize ml-2">{selectedFeedback?.type}</Badge>
            </DialogTitle>
            <DialogDescription>
              Submitted by {selectedFeedback?.userName} ({selectedFeedback?.userEmail}) on {selectedFeedback && new Date(selectedFeedback.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">Topic Title</Label>
              <div className="p-3 bg-accent/30 rounded-lg font-medium border">{selectedFeedback?.title}</div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">Full Description</Label>
              <div className="p-3 bg-accent/30 rounded-lg whitespace-pre-wrap border text-sm h-32 overflow-y-auto">
                {selectedFeedback?.description}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reply" className="font-bold">Admin Response & Resolution Note</Label>
              <Textarea 
                id="reply"
                placeholder="Type message for user notification here..."
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between w-full">
            <Button variant="secondary" onClick={() => handleResolveFeedback('in_review')} disabled={isSubmittingReply}>
              Mark In-Review
            </Button>
            <Button onClick={() => handleResolveFeedback('resolved')} disabled={isSubmittingReply} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete & Notify User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
