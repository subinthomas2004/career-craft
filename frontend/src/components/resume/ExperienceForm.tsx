import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Plus, Trash2, X } from "lucide-react";
import { Experience } from "@/types/resume";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceForm = ({ data, onChange }: ExperienceFormProps) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [""],
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      data.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addAchievement = (id: string) => {
    onChange(
      data.map((exp) =>
        exp.id === id ? { ...exp, achievements: [...exp.achievements, ""] } : exp
      )
    );
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    onChange(
      data.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              achievements: exp.achievements.map((a, i) => (i === index ? value : a)),
            }
          : exp
      )
    );
  };

  const removeAchievement = (expId: string, index: number) => {
    onChange(
      data.map((exp) =>
        exp.id === expId
          ? { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) }
          : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Work Experience
        </CardTitle>
        <Button size="sm" variant="outline" onClick={addExperience}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No experience added. Click "Add" to add your work experience.
          </p>
        ) : (
          data.map((exp, index) => (
            <div key={exp.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Experience {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    placeholder="Software Engineer"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="San Francisco, CA"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Jan 2022"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="Present"
                      value={exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => {
                    updateExperience(exp.id, "current", checked);
                    if (checked) updateExperience(exp.id, "endDate", "");
                  }}
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm">
                  Currently working here
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of your role..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Key Achievements</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addAchievement(exp.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex gap-2">
                    <Input
                      placeholder="Describe an achievement..."
                      value={achievement}
                      onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                    />
                    {exp.achievements.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeAchievement(exp.id, achIndex)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;
