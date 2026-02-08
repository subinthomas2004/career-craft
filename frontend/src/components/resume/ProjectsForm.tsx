import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderGit2, Plus, Trash2, X } from "lucide-react";
import { Project } from "@/types/resume";

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsForm = ({ data, onChange }: ProjectsFormProps) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [""],
      link: "",
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(
      data.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const addTechnology = (id: string) => {
    onChange(
      data.map((proj) =>
        proj.id === id ? { ...proj, technologies: [...proj.technologies, ""] } : proj
      )
    );
  };

  const updateTechnology = (projId: string, index: number, value: string) => {
    onChange(
      data.map((proj) =>
        proj.id === projId
          ? {
              ...proj,
              technologies: proj.technologies.map((t, i) => (i === index ? value : t)),
            }
          : proj
      )
    );
  };

  const removeTechnology = (projId: string, index: number) => {
    onChange(
      data.map((proj) =>
        proj.id === projId
          ? { ...proj, technologies: proj.technologies.filter((_, i) => i !== index) }
          : proj
      )
    );
  };

  const removeProject = (id: string) => {
    onChange(data.filter((proj) => proj.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5" />
          Projects
        </CardTitle>
        <Button size="sm" variant="outline" onClick={addProject}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No projects added. Click "Add" to showcase your projects.
          </p>
        ) : (
          data.map((proj, index) => (
            <div key={proj.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Project {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeProject(proj.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name *</Label>
                  <Input
                    placeholder="E-commerce Platform"
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                    placeholder="github.com/user/project"
                    value={proj.link}
                    onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your project..."
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Technologies Used</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addTechnology(proj.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center gap-1">
                      <Input
                        placeholder="React"
                        value={tech}
                        onChange={(e) => updateTechnology(proj.id, techIndex, e.target.value)}
                        className="w-32"
                      />
                      {proj.technologies.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => removeTechnology(proj.id, techIndex)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsForm;
