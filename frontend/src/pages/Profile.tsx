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
  Camera,
  Users,
  Swords
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
    avatar: "",
    resumeUrl: "",
    resumeOriginalName: "",
    stats: {
      interviewsAttended: 0,
      technicalQuizCount: 0,
      aptitudeExamCount: 0,
      gdCount: 0,
      debateCount: 0,
      averageScore: 0
    }
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
          resumeUrl: data.resumeUrl || "",
          resumeOriginalName: data.resumeOriginalName || "",
          stats: data.stats || {
            interviewsAttended: 0,
            technicalQuizCount: 0,
            aptitudeExamCount: 0,
            gdCount: 0,
            debateCount: 0,
            averageScore: 0
          }
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("resume", file);

    const userInfoStr = localStorage.getItem("userInfo");
    const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data } = await api.post("/auth/upload-resume", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });
      
      setProfile(prev => ({ 
        ...prev, 
        resumeUrl: data.resumeUrl, 
        resumeOriginalName: data.resumeOriginalName 
      }));
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveResume = async () => {
    const userInfoStr = localStorage.getItem("userInfo");
    const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

    try {
      await api.delete("/auth/remove-resume", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(prev => ({ 
        ...prev, 
        resumeUrl: "", 
        resumeOriginalName: "" 
      }));
      toast.success("Resume removed successfully!");
    } catch (error) {
      console.error("Error removing resume:", error);
      toast.error("Failed to remove resume.");
    }
  };

  const achievements = [
    { icon: Video, label: "Interviews", value: profile.stats.interviewsAttended || 0, color: "text-blue-500" },
    { icon: Brain, label: "Aptitude", value: profile.stats.aptitudeExamCount || 0, color: "text-purple-500" },
    { icon: Code, label: "Tech Quiz", value: profile.stats.technicalQuizCount || 0, color: "text-emerald-500" },
    { icon: Users, label: "GDs", value: profile.stats.gdCount || 0, color: "text-orange-500" },
    { icon: Swords, label: "Debates", value: profile.stats.debateCount || 0, color: "text-red-500" },
    { icon: TrendingUp, label: "Avg Score", value: `${profile.stats.averageScore || 0}%`, color: "text-cyan-500" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
          {achievements.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-2 sm:p-3 text-center">
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color} mx-auto mb-1.5`} />
                <p className="text-lg sm:text-xl font-bold text-foreground">{item.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</p>
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

        {/* Resume Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Code className="w-5 h-5 text-primary" />
              Professional Resume
            </CardTitle>
            <CardDescription>Upload and manage your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                {isUploading ? (
                  <div className="space-y-3 p-4 bg-secondary/10 rounded-lg border border-border/40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-primary flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 animate-pulse" />
                        Uploading Resume...
                      </span>
                      <span className="text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground text-center">
                      Please wait while we process your document.
                    </p>
                  </div>
                ) : profile.resumeUrl ? (
                  <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">
                          {profile.resumeOriginalName || "Current Resume"}
                        </span>
                        <a 
                          href={`${window.location.origin.replace(':5173', ':5001')}${profile.resumeUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        className="text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        Replace
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRemoveResume}
                        className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center space-y-3 hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">No resume uploaded</h4>
                      <p className="text-sm text-muted-foreground mt-1">Upload your resume to complete your profile</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('resume-upload')?.click()}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      Upload Resume
                    </Button>
                  </div>
                )}
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
            {!isUploading && (
              <p className="text-[10px] text-muted-foreground text-center">
                Supported formats: PDF, DOC, DOCX. Max size 5MB.
              </p>
            )}
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
