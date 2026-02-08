import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    quizReminders: true,
    darkMode: false,
    language: "English",
    twoFactorAuth: false,
    showProgress: true,
    showActivity: true,
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

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled in demo mode.");
  };

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

        {/* Notifications */}
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
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Weekly Progress Report</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Summary of your weekly progress</p>
              </div>
              <Switch
                checked={settings.weeklyReport}
                onCheckedChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Quiz Reminders</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Remind me to take quizzes</p>
              </div>
              <Switch
                checked={settings.quizReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, quizReminders: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {settings.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Dark Mode</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Language</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <select 
                className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
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
                <p className="text-xs sm:text-sm text-muted-foreground">Let others see your progress</p>
              </div>
              <Switch
                checked={settings.showProgress}
                onCheckedChange={(checked) => setSettings({ ...settings, showProgress: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Show Activity Status</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Show when you're active</p>
              </div>
              <Switch
                checked={settings.showActivity}
                onCheckedChange={(checked) => setSettings({ ...settings, showActivity: checked })}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm sm:text-base">Two-Factor Authentication</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <p className="font-medium text-foreground text-sm sm:text-base">Change Password</p>
              <div className="space-y-3">
                <div className="relative">
                  <Label htmlFor="current-password" className="text-xs sm:text-sm">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
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
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
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
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleChangePassword} className="w-full sm:w-auto">
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
