import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Job } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { MapPin, Briefcase, Clock, DollarSign, Search, Building2, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function JobsList() {
  const { user } = useAuth();
  const { jobs, getProfile, applications, addApplication } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const profile = getProfile(user!.id);

  // Get unique locations and skills
  const locations = Array.from(new Set(jobs.map(j => j.location)));
  const allSkills = Array.from(new Set(jobs.flatMap(j => j.skills)));

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    if (job.status !== 'open') return false;

    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    const matchesSkill = skillFilter === 'all' || job.skills.includes(skillFilter);

    return matchesSearch && matchesLocation && matchesSkill;
  });

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyClick = () => {
    if (!selectedJob) return;

    // Check if already applied
    const existingApplication = applications.find(
      app => app.jobId === selectedJob.id && app.studentId === user!.id
    );

    if (existingApplication) {
      toast.error('You have already applied to this job');
      return;
    }

    // Check eligibility
    if (!profile) {
      toast.error('Please complete your profile first');
      return;
    }

    if (profile.cgpa < selectedJob.eligibility.minCgpa) {
      toast.error(`This job requires a minimum CGPA of ${selectedJob.eligibility.minCgpa}`);
      return;
    }

    if (!selectedJob.eligibility.batch.includes(profile.graduationYear)) {
      toast.error('Your graduation year does not match the eligibility criteria');
      return;
    }

    if (selectedJob.eligibility.requiresVerification && !profile.isVerified) {
      toast.error('This job requires profile verification. Please submit documents for verification.');
      return;
    }

    setShowApplyDialog(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedJob || !profile) return;

    if (!coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    addApplication({
      jobId: selectedJob.id,
      studentId: user!.id,
      studentName: user!.name,
      studentEmail: user!.email,
      coverLetter,
      resumeUrl: profile.resumeUrl,
      stage: 'applied',
      scores: {},
      reviewerNotes: [],
    });

    toast.success('Application submitted successfully!');
    setShowApplyDialog(false);
    setSelectedJob(null);
    setCoverLetter('');
  };

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const isEligible = (job: Job) => {
    if (!profile) return false;
    const cgpaMatch = profile.cgpa >= job.eligibility.minCgpa;
    const batchMatch = job.eligibility.batch.includes(profile.graduationYear);
    const verificationMatch = !job.eligibility.requiresVerification || profile.isVerified;
    return cgpaMatch && batchMatch && verificationMatch;
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId && app.studentId === user!.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Browse Jobs</h2>
        <p className="text-sm text-gray-600">Discover opportunities and apply to positions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Skill</Label>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
      </div>

      {/* Jobs list */}
      <div className="grid gap-4">
        {filteredJobs.map(job => {
          const eligible = isEligible(job);
          const applied = hasApplied(job.id);
          
          return (
            <Card key={job.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleJobClick(job)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">{job.companyName}</span>
                    </div>
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {applied && <Badge variant="outline" className="bg-blue-50">Applied</Badge>}
                    {!eligible && !applied && <Badge variant="destructive">Not Eligible</Badge>}
                    {job.isRemote && <Badge variant="secondary">Remote</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                    {job.skills.length > 5 && (
                      <Badge variant="outline">+{job.skills.length - 5} more</Badge>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      {job.stipend ? `${formatSalary(job.stipend)}/month` : formatSalary(job.salary!)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span>Min CGPA: {job.eligibility.minCgpa}</span>
                    <span className="mx-2">•</span>
                    <span>Batch: {job.eligibility.batch.join(', ')}</span>
                    {job.eligibility.requiresVerification && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Verification Required</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No jobs found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl mb-2">{selectedJob.title}</DialogTitle>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{selectedJob.companyName}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {hasApplied(selectedJob.id) && <Badge className="bg-blue-600">Applied</Badge>}
                  {selectedJob.isRemote && <Badge variant="secondary">Remote</Badge>}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Key details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Compensation</p>
                    <p>{selectedJob.stipend ? `${formatSalary(selectedJob.stipend)}/month` : formatSalary(selectedJob.salary!)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <p>{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p>{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="mb-2">Job Description</h4>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div>
                <h4 className="mb-2">Eligibility Criteria</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Minimum CGPA: {selectedJob.eligibility.minCgpa}</li>
                  <li>• Eligible Batches: {selectedJob.eligibility.batch.join(', ')}</li>
                  {selectedJob.eligibility.requiresVerification && (
                    <li>• Profile verification required</li>
                  )}
                </ul>
              </div>

              {/* Screening questions */}
              {selectedJob.screeningQuestions && selectedJob.screeningQuestions.length > 0 && (
                <div>
                  <h4 className="mb-2">Screening Questions</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {selectedJob.screeningQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Eligibility warning */}
              {!isEligible(selectedJob) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    You do not meet the eligibility criteria for this job.
                  </AlertDescription>
                </Alert>
              )}

              {/* Apply button */}
              {!hasApplied(selectedJob.id) && isEligible(selectedJob) && (
                <Button onClick={handleApplyClick} className="w-full">
                  Apply for this Position
                </Button>
              )}

              {hasApplied(selectedJob.id) && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    You have already applied to this position. Check "My Applications" for status updates.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>Submit your application with a cover letter</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you're interested in this position and why you'd be a good fit..."
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label>Resume</Label>
              <p className="text-sm text-gray-600">
                {profile?.resumeUrl || 'No resume uploaded. Please add one in your profile.'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowApplyDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication} className="flex-1">
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
