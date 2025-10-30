import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Building2, Code } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DepartmentSkillsManagement() {
  const { departments, skills, addDepartment, addSkill } = useData();
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('');

  const handleAddDepartment = () => {
    if (!deptName.trim() || !deptCode.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (departments.some(d => d.code === deptCode.trim())) {
      toast.error('Department code already exists');
      return;
    }

    addDepartment({
      name: deptName.trim(),
      code: deptCode.trim(),
    });

    toast.success('Department added successfully');
    setDeptName('');
    setDeptCode('');
    setShowAddDept(false);
  };

  const handleAddSkill = () => {
    if (!skillName.trim() || !skillCategory.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (skills.some(s => s.name.toLowerCase() === skillName.trim().toLowerCase())) {
      toast.error('Skill already exists');
      return;
    }

    addSkill({
      name: skillName.trim(),
      category: skillCategory.trim(),
    });

    toast.success('Skill added successfully');
    setSkillName('');
    setSkillCategory('');
    setShowAddSkill(false);
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">System Settings</h2>
        <p className="text-sm text-gray-600">Manage departments and skills</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Departments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Academic departments in the institution</CardDescription>
              </div>
              <Button onClick={() => setShowAddDept(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No departments added yet</p>
              ) : (
                departments.map(dept => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <div>
                        <p>{dept.name}</p>
                        <p className="text-xs text-gray-500">Code: {dept.code}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Technical and professional skills</CardDescription>
              </div>
              <Button onClick={() => setShowAddSkill(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.keys(skillsByCategory).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No skills added yet</p>
              ) : (
                Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-sm mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map(skill => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Department Dialog */}
      <Dialog open={showAddDept} onOpenChange={setShowAddDept}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>Add a new academic department</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">Department Name *</Label>
              <Input
                id="deptName"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deptCode">Department Code *</Label>
              <Input
                id="deptCode"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                placeholder="e.g., CS"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddDept(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddDepartment} className="flex-1">
                Add Department
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={showAddSkill} onOpenChange={setShowAddSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>Add a new technical or professional skill</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name *</Label>
              <Input
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g., React"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillCategory">Category *</Label>
              <Input
                id="skillCategory"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                placeholder="e.g., Frontend, Backend, Programming"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddSkill(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddSkill} className="flex-1">
                Add Skill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
