import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Shield,
  Activity,
  Clock,
  RefreshCw
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";



const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", change: "+0%", icon: Users, trend: "neutral" },
    { label: "Active Sessions", value: "0", change: "0%", icon: Activity, trend: "neutral" },
    { label: "Pending Reports", value: "0", change: "0%", icon: AlertTriangle, trend: "neutral" },
    { label: "Total Content", value: "0", change: "0%", icon: FileText, trend: "neutral" },
  ]);
  const [users, setUsers] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        navigate("/auth");
        return;
      }
      const { token } = JSON.parse(userInfo);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch Stats
      const statsRes = await api.get('/admin/stats', config);

      // Map icon strings back to components if needed, or just use strings if backend sends them
      // In this case backend sends strings "Users", "Activity" etc. 
      // We need to map them to the actual Lucide components for rendering
      const iconMap: any = { Users, Activity, AlertTriangle, FileText };

      const processedStats = statsRes.data.stats.map((s: any) => ({
        ...s,
        icon: iconMap[s.icon] || Users
      }));
      setStats(processedStats);

      // Fetch Users
      const usersRes = await api.get('/admin/users', config);
      setUsers(usersRes.data);

    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      const message = error.response?.data?.message || error.message || "Failed to load admin data";
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return;
      const { token } = JSON.parse(userInfo);

      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("User deleted successfully");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage users, content, and platform settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="outline" className="gap-1 hidden sm:flex">
            <Clock className="w-3 h-3" />
            Last updated: Just now
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur border-border">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 lg:w-auto lg:inline-flex">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4 hidden sm:block" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isVerified ? 'default' : 'destructive'}
                          className={user.isVerified ? 'bg-green-500/10 text-green-500' : ''}
                        >
                          {user.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const lastActive = new Date(user.lastActive);
                          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                          const isActive = lastActive >= fiveMinutesAgo;
                          return (
                            <Badge
                              variant={isActive ? 'default' : 'secondary'}
                              className={isActive ? 'bg-green-500/10 text-green-500' : ''}
                            >
                              {isActive ? "Active" : "Away"}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user.role === 'admin'} // Prevent deleting admins for safety
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
