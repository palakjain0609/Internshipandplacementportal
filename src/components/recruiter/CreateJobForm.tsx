import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, X, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreateJobFormProps {
  onSuccess: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { user } = useAuth();
  const { addJob, skills: availableSkills } = useData();

  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [compensationType, setCompensationType] = useState<'stipend' | 'salary'>('stipend');
  const [amount, setAmount] = useState<number>(0);
  const [minCgpa, setMinCgpa] = useState<number>(0);
  const [batch2025, setBatch2025] = useState(true);
  const [batch2026, setBatch2026] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>(['']);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...screeningQuestions];
    updated[index] = value;
    setScreeningQuestions(updated);
  };

  const handleAddQuestion = () => {
    setScreeningQuestions([...screeningQuestions, '']);
  };

  const handleRemoveQuestion = (index: number) => {
    setScreeningQuestions(screeningQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (skills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }

    if (!location.trim()) {
      toast.error('Please specify a location');
      return;
    }

    if (amount <= 0) {
      toast.error('Please enter a valid compensation amount');
      return;
    }

    if (minCgpa < 0 || minCgpa > 10) {
      toast.error('CGPA must be between 0 and 10');
      return;
    }

    const batches = [];
    if (batch2025) batches.push(2025);
    if (batch2026) batches.push(2026);

    if (batches.length === 0) {
      toast.error('Please select at least one eligible batch');
      return;
    }

    if (!deadline) {
      toast.error('Please set an application deadline');
      return;
    }

    const validQuestions = screeningQuestions.filter(q => q.trim());

    addJob({
      recruiterId: user!.id,
      recruiterName: user!.name,
      companyName: companyName.trim(),
      title: title.trim(),
      description: description.trim(),
      skills,
      eligibility: {
        minCgpa,
        batch: batches,
        requiresVerification,
      },
      location: location.trim(),
      isRemote,
      stipend: compensationType === 'stipend' ? amount : undefined,
      salary: compensationType === 'salary' ? amount : undefined,
      status: 'open',
      deadline,
      screeningQuestions: validQuestions.length > 0 ? validQuestions : undefined,
    });

    toast.success('Job posted successfully!');
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Create New Job</h2>
        <p className="text-sm text-gray-600">Post a new position for students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., TechCorp Solutions"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer Intern"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the role, responsibilities, and what the candidate will work on..."
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
            <CardDescription>Add technical and professional skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div>
              <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {availableSkills.slice(0, 8).map(skill => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (!skills.includes(skill.name)) {
                        setSkills([...skills, skill.name]);
                      }
                    }}
                  >
                    {skill.name} +
                  </Badge>
                ))}
              </div>
            </div>

            {skills.length > 0 && (
              <div>
                <p className="text-sm mb-2">Selected skills:</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="default" className="px-3 py-1">
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-red-200"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location & Compensation */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Compensation</CardTitle>
            <CardDescription>Work location and salary details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Bangalore"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isRemote"
                checked={isRemote}
                onCheckedChange={setIsRemote}
              />
              <Label htmlFor="isRemote">Remote work available</Label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="compensationType">Compensation Type *</Label>
                <Select value={compensationType} onValueChange={(value: any) => setCompensationType(value)}>
                  <SelectTrigger id="compensationType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stipend">Stipend (per month)</SelectItem>
                    <SelectItem value="salary">Annual Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder={compensationType === 'stipend' ? 'e.g., 50000' : 'e.g., 1200000'}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
            <CardDescription>Define who can apply to this position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minCgpa">Minimum CGPA *</Label>
              <Input
                id="minCgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Eligible Batches *</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="batch2025"
                    checked={batch2025}
                    onCheckedChange={setBatch2025}
                  />
                  <Label htmlFor="batch2025">2025</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="batch2026"
                    checked={batch2026}
                    onCheckedChange={setBatch2026}
                  />
                  <Label htmlFor="batch2026">2026</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="requiresVerification"
                checked={requiresVerification}
                onCheckedChange={setRequiresVerification}
              />
              <Label htmlFor="requiresVerification">Require profile verification</Label>
            </div>
          </CardContent>
        </Card>

        {/* Screening Questions (Optional) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Screening Questions</CardTitle>
                <CardDescription>Optional questions for applicants</CardDescription>
              </div>
              <Button onClick={handleAddQuestion} type="button" variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {screeningQuestions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                />
                {screeningQuestions.length > 1 && (
                  <Button
                    onClick={() => handleRemoveQuestion(index)}
                    type="button"
                    variant="outline"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
}
