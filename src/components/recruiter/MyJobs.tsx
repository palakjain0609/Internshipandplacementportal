import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Job } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { MapPin, DollarSign, Calendar, Users, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MyJobsProps {
  onViewApplications: (jobId: string) => void;
}

export function MyJobs({ onViewApplications }: MyJobsProps) {
  const { user } = useAuth();
  const { jobs, applications, updateJob, deleteJob } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const myJobs = jobs.filter(j => j.recruiterId === user!.id);

  const filteredJobs = myJobs.filter(job => {
    if (statusFilter === 'all') return true;
    return job.status === statusFilter;
  });

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const handleToggleStatus = (job: Job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    updateJob(job.id, { status: newStatus });
    toast.success(`Job ${newStatus === 'open' ? 'opened' : 'closed'} successfully`);
  };

  const handleDeleteJob = () => {
    if (!jobToDelete) return;
    
    const jobApps = getJobApplications(jobToDelete.id);
    if (jobApps.length > 0) {
      toast.error('Cannot delete job with existing applications');
      setJobToDelete(null);
      return;
    }

    deleteJob(jobToDelete.id);
    toast.success('Job deleted successfully');
    setJobToDelete(null);
  };

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const statusCounts = {
    all: myJobs.length,
    open: myJobs.filter(j => j.status === 'open').length,
    closed: myJobs.filter(j => j.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">My Jobs</h2>
        <p className="text-sm text-gray-600">Manage your job postings</p>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label className="min-w-fit">Filter by status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs ({statusCounts.all})</SelectItem>
                <SelectItem value="open">Open ({statusCounts.open})</SelectItem>
                <SelectItem value="closed">Closed ({statusCounts.closed})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs list */}
      <div className="grid gap-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {statusFilter === 'all'
                  ? "You haven't posted any jobs yet"
                  : `No ${statusFilter} jobs found`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map(job => {
            const jobApplications = getJobApplications(job.id);
            const shortlistedCount = jobApplications.filter(a => a.stage === 'shortlisted').length;
            const offeredCount = jobApplications.filter(a => a.stage === 'offered').length;

            return (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{job.title}</CardTitle>
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <CardDescription>{job.companyName}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(job)}
                      >
                        {job.status === 'open' ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setJobToDelete(job)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                      {job.skills.length > 5 && (
                        <Badge variant="outline">+{job.skills.length - 5} more</Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                        {job.isRemote && ' (Remote)'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {job.stipend ? `${formatSalary(job.stipend)}/mo` : formatSalary(job.salary!)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        {jobApplications.length} Applications
                      </div>
                    </div>

                    {jobApplications.length > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Shortlisted: <span className="text-purple-600">{shortlistedCount}</span>
                        </span>
                        <span className="text-gray-600">
                          Offered: <span className="text-green-600">{offeredCount}</span>
                        </span>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onViewApplications(job.id)}
                    >
                      View Applications ({jobApplications.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
              <DialogDescription>{selectedJob.companyName}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p>{selectedJob.location} {selectedJob.isRemote && '(Remote)'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Compensation</p>
                  <p>{selectedJob.stipend ? `${formatSalary(selectedJob.stipend)}/month` : formatSalary(selectedJob.salary!)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge variant={selectedJob.status === 'open' ? 'default' : 'secondary'}>
                    {selectedJob.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Deadline</p>
                  <p>{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Description</h4>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2">Eligibility</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Min CGPA: {selectedJob.eligibility.minCgpa}</li>
                  <li>• Eligible Batches: {selectedJob.eligibility.batch.join(', ')}</li>
                  <li>• Verification Required: {selectedJob.eligibility.requiresVerification ? 'Yes' : 'No'}</li>
                </ul>
              </div>

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
            </div>

            <DialogFooter>
              <Button onClick={() => onViewApplications(selectedJob.id)}>
                View Applications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
              {getJobApplications(jobToDelete?.id || '').length > 0 && (
                <span className="block mt-2 text-red-600">
                  This job has {getJobApplications(jobToDelete?.id || '').length} applications and cannot be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
