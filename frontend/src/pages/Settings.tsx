import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Bell,
  Lock,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Check
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    showProgress: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data) {
          setSettings(prev => ({
            ...prev,
            showProgress: response.data.showProgressPublicly !== undefined ? response.data.showProgressPublicly : true,
            emailNotifications: response.data.emailNotifications !== undefined ? response.data.emailNotifications : true,
            pushNotifications: response.data.pushNotifications !== undefined ? response.data.pushNotifications : true
          }));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      await api.put('/auth/profile', {
        showProgressPublicly: settings.showProgress,
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings.");
    }
  };

  useEffect(() => {
    const verifyPassword = async () => {
      if (!passwords.current) {
        setIsCurrentPasswordValid(false);
        return;
      }

      setIsVerifyingPassword(true);
      try {
        const response = await api.post('/auth/verify-password', {
          currentPassword: passwords.current
        });

        if (response.data.success) {
          setIsCurrentPasswordValid(true);
        } else {
          setIsCurrentPasswordValid(false);
        }
      } catch (error) {
        console.error("Error verifying password", error);
        setIsCurrentPasswordValid(false);
      } finally {
        setIsVerifyingPassword(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      verifyPassword();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [passwords.current]);

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (!isCurrentPasswordValid) {
      toast.error("Current password is incorrect.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    try {
      const response = await api.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });

      if (response.data) {
        toast.success("Password changed successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
        setIsCurrentPasswordValid(false);
      }
    } catch (error: any) {
      console.error("Error changing password", error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible and will delete ALL your data (scores, resumes, community posts, etc.).")) {
      try {
        await api.delete('/auth/account');
        toast.success("Account deleted successfully!");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login
      } catch (error: any) {
        console.error("Error deleting account", error);
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
    }
  };

  if (isLoading) {
      return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Notifications (Static placeholders for future) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Email Notifications</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Push Notifications</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Get notified in browser</p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Show Progress Publicly</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Let others see your progress on Global Leaderboards</p>
              </div>
              <Switch
                checked={settings.showProgress}
                onCheckedChange={(checked) => setSettings({ ...settings, showProgress: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <p className="font-medium text-foreground text-sm sm:text-base">Change Password</p>
              <div className="space-y-3">
                <div className="relative">
                  <Label htmlFor="current-password" className="text-xs sm:text-sm">Current Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className={`pr-20 ${passwords.current ? (isCurrentPasswordValid ? 'border-green-500' : 'border-red-500') : ''}`}
                    />
                    <div className="absolute right-3 flex items-center gap-2">
                      {isVerifyingPassword && <span className="text-xs text-muted-foreground">Verifying...</span>}
                      {!isVerifyingPassword && passwords.current && isCurrentPasswordValid && (
                        <Check className="w-4 h-4 text-green-500 font-bold" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="new-password" className="text-xs sm:text-sm">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="pr-10"
                      disabled={!isCurrentPasswordValid}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      disabled={!isCurrentPasswordValid}
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="pr-10"
                      disabled={!isCurrentPasswordValid}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      disabled={!isCurrentPasswordValid}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleChangePassword} className="w-full sm:w-auto" disabled={!isCurrentPasswordValid || !passwords.new || !passwords.confirm}>
                  Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Delete Account</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
