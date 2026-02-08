import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Plus, Trash2 } from "lucide-react";
import { Skill } from "@/types/resume";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "intermediate",
    };
    onChange([...data, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onChange(
      data.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Skills
        </CardTitle>
        <Button size="sm" variant="outline" onClick={addSkill}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No skills added. Click "Add" to add your skills.
          </p>
        ) : (
          <div className="grid gap-3">
            {data.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3">
                <Input
                  placeholder="Skill name (e.g., React, Python)"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={skill.level}
                  onValueChange={(value) => updateSkill(skill.id, "level", value)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeSkill(skill.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsForm;
