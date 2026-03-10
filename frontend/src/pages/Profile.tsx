import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Edit2,
  Save,
  Award,
  Target,
  TrendingUp,
  Code,
  Brain,
  Video,
  Camera
} from "lucide-react";
import { api } from "@/lib/api";
import ImageCropper from "@/components/profile/ImageCropper";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    targetRole: "",
    education: "",
    college: "",
    graduationYear: "",
    bio: "",
    skills: [] as string[],
    linkedin: "",
    github: "",
    avatar: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) return;
        
        const userInfo = JSON.parse(userInfoStr);
        const token = userInfo.token;

        const { data } = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(prev => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          avatar: data.profilePicture || "",
          location: data.location || "",
          targetRole: data.targetRole || "",
          education: data.education || "",
          college: data.college || "",
          graduationYear: data.graduationYear || "",
          bio: data.bio || "",
          skills: data.skills || [],
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedImage: string) => {
    setProfile(prev => ({ ...prev, avatar: croppedImage }));
    setIsEditing(true);
    toast.success("Profile photo updated! Don't forget to save your changes.");
  };

  const handleSave = async () => {
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) {
        toast.error("User not authenticated");
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);
      const token = userInfo.token;

      const { data } = await api.put("/auth/profile", {
        name: profile.name,
        location: profile.location,
        targetRole: profile.targetRole,
        education: profile.education,
        college: profile.college,
        graduationYear: profile.graduationYear,
        bio: profile.bio,
        skills: profile.skills,
        profilePicture: profile.avatar,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage so the new avatar reflects in the dashboard
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // Dispatch custom event to let other components know userInfo updated
      window.dispatchEvent(new Event("userInfoUpdated"));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const achievements = [
    { icon: Video, label: "Interviews", value: 0, color: "text-blue-500" },
    { icon: Brain, label: "Quizzes", value: 0, color: "text-purple-500" },
    { icon: Code, label: "Problems Solved", value: 0, color: "text-green-500" },
    { icon: Target, label: "Skills Mastered", value: 0, color: "text-orange-500" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your personal information and preferences.
            </p>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="w-full sm:w-auto"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 cursor-pointer border-2 border-primary/20 hover:border-primary/50 transition-colors">
                  <AvatarImage src={profile.avatar} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl">
                    {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "User"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {isLoading ? "Loading..." : profile.name}
                </h2>
                <p className="text-muted-foreground">{profile.targetRole}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {profile.college}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  {profile.skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                  {profile.skills.length > 5 && (
                    <Badge variant="outline">+{profile.skills.length - 5}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {achievements.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-3 sm:p-4 text-center">
                <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color} mx-auto mb-2`} />
                <p className="text-xl sm:text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {profile.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {profile.location || "Not specified"}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us a little about yourself"
                />
              ) : (
                <p className="text-foreground py-2">{profile.bio || "No bio added yet."}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Education & Career */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education & Career Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">Degree</Label>
                {isEditing ? (
                  <Input
                    id="education"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.education || "Not specified"}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College/University</Label>
                {isEditing ? (
                  <Input
                    id="college"
                    value={profile.college}
                    onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                    placeholder="e.g. Example University"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.college || "Not specified"}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                {isEditing ? (
                  <Input
                    id="graduationYear"
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                    placeholder="e.g. 2024"
                  />
                ) : (
                  <p className="text-foreground py-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {profile.graduationYear || "Not specified"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                {isEditing ? (
                  <Input
                    id="role"
                    value={profile.targetRole}
                    onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                    placeholder="e.g. Software Engineer"
                  />
                ) : (
                  <p className="text-foreground py-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    {profile.targetRole || "Not specified"}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                {isEditing ? (
                  <Input
                    id="skills"
                    value={profile.skills.join(", ")}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="e.g. React, Node.js, Python"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 py-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No skills added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="w-5 h-5 text-primary" />
              Preparation Progress
            </CardTitle>
            <CardDescription>Your overall readiness for placements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Technical Skills", value: 75 },
              { label: "Communication", value: 82 },
              { label: "Problem Solving", value: 68 },
              { label: "Domain Knowledge", value: 70 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <ImageCropper
        imageSrc={imageSrc}
        open={showCropper}
        onOpenChange={setShowCropper}
        onCropComplete={onCropComplete}
      />
    </div>
  );
};

export default Profile;
