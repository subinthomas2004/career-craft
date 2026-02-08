import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { PersonalInfo } from "@/types/resume";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoForm = ({ data, onChange }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@email.com"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="San Francisco, CA"
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/johndoe"
              value={data.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <Input
              id="portfolio"
              placeholder="johndoe.dev"
              value={data.portfolio}
              onChange={(e) => handleChange("portfolio", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            placeholder="Brief overview of your experience and career goals..."
            rows={4}
            value={data.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
