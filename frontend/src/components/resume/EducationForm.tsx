import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Education } from "@/types/resume";

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm = ({ data, onChange }: EducationFormProps) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(
      data.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Education
        </CardTitle>
        <Button size="sm" variant="outline" onClick={addEducation}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No education added. Click "Add" to add your education.
          </p>
        ) : (
          data.map((edu, index) => (
            <div key={edu.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Education {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    placeholder="University Name"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    placeholder="Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    placeholder="Computer Science"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GPA</Label>
                  <Input
                    placeholder="3.8"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    placeholder="2018"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    placeholder="2022"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
