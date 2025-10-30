import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, X, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function StudentProfile() {
  const { user } = useAuth();
  const { getProfile, updateProfile } = useData();
  const [isEditing, setIsEditing] = useState(false);

  const profile = getProfile(user!.id);

  // Form state
  const [program, setProgram] = useState(profile?.program || '');
  const [graduationYear, setGraduationYear] = useState(profile?.graduationYear || new Date().getFullYear());
  const [cgpa, setCgpa] = useState(profile?.cgpa || 0);
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState(profile?.projects || []);
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl || '');

  useEffect(() => {
    if (profile) {
      setProgram(profile.program);
      setGraduationYear(profile.graduationYear);
      setCgpa(profile.cgpa);
      setSkills(profile.skills);
      setProjects(profile.projects);
      setResumeUrl(profile.resumeUrl);
    }
  }, [profile]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: '', description: '', link: '' }]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleSave = () => {
    updateProfile(user!.id, {
      program,
      graduationYear,
      cgpa,
      skills,
      projects,
      resumeUrl,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    if (profile) {
      setProgram(profile.program);
      setGraduationYear(profile.graduationYear);
      setCgpa(profile.cgpa);
      setSkills(profile.skills);
      setProjects(profile.projects);
      setResumeUrl(profile.resumeUrl);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">My Profile</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your academic and professional information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {profile?.isVerified && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✓ Your profile is verified. You can apply to all jobs including those requiring verification.
          </AlertDescription>
        </Alert>
      )}

      {!profile?.isVerified && (
        <Alert>
          <AlertDescription>
            Your profile is not yet verified. Upload documents in the Verification tab to access jobs requiring verification.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your academic details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={user?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} disabled />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., B.Tech Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                max="10"
                min="0"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={user?.department || 'Not specified'} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              disabled={!isEditing}
              placeholder="https://example.com/your-resume.pdf"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add your technical and professional skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., React, Python)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button onClick={handleAddSkill} type="button">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-sm text-gray-500">No skills added yet</p>
            ) : (
              skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Showcase your best work and achievements</CardDescription>
            </div>
            {isEditing && (
              <Button onClick={handleAddProject} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects added yet</p>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {isEditing ? (
                      <>
                        <Input
                          value={project.title}
                          onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                          placeholder="Project Title"
                        />
                        <Textarea
                          value={project.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          placeholder="Project Description"
                          rows={3}
                        />
                        <Input
                          value={project.link || ''}
                          onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                          placeholder="Project Link (optional)"
                        />
                      </>
                    ) : (
                      <>
                        <h4>{project.title || 'Untitled Project'}</h4>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Project →
                          </a>
                        )}
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProject(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
