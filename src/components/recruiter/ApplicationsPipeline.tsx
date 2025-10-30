import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Application } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { User, Mail, FileText, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ApplicationsPipelineProps {
  selectedJobId: string | null;
}

export function ApplicationsPipeline({ selectedJobId }: ApplicationsPipelineProps) {
  const { user } = useAuth();
  const { jobs, applications, updateApplication } = useData();
  const [jobFilter, setJobFilter] = useState<string>(selectedJobId || 'all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStage, setNewStage] = useState<Application['stage']>('applied');
  const [reviewNote, setReviewNote] = useState('');
  const [aptitudeScore, setAptitudeScore] = useState<number | undefined>();
  const [techScore, setTechScore] = useState<number | undefined>();
  const [commScore, setCommScore] = useState<number | undefined>();

  const myJobs = jobs.filter(j => j.recruiterId === user!.id);
  const myApplications = applications.filter(app =>
    myJobs.some(job => job.id === app.jobId)
  );

  const filteredApplications = myApplications.filter(app => {
    if (jobFilter !== 'all' && app.jobId !== jobFilter) return false;
    if (stageFilter !== 'all' && app.stage !== stageFilter) return false;
    return true;
  });

  const getJob = (jobId: string) => jobs.find(j => j.id === jobId);

  const getStageColor = (stage: Application['stage']) => {
    switch (stage) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'interview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const handleOpenApplication = (app: Application) => {
    setSelectedApp(app);
    setNewStage(app.stage);
    setAptitudeScore(app.scores.aptitude);
    setTechScore(app.scores.tech);
    setCommScore(app.scores.communication);
    setReviewNote('');
  };

  const handleUpdateStage = () => {
    if (!selectedApp) return;

    updateApplication(selectedApp.id, {
      stage: newStage,
    });

    toast.success('Application stage updated');
  };

  const handleAddReview = () => {
    if (!selectedApp || !reviewNote.trim()) {
      toast.error('Please enter a review note');
      return;
    }

    const updatedNotes = [
      ...selectedApp.reviewerNotes,
      {
        note: reviewNote,
        timestamp: new Date().toISOString(),
        reviewer: user!.name,
      },
    ];

    updateApplication(selectedApp.id, {
      reviewerNotes: updatedNotes,
      scores: {
        aptitude: aptitudeScore,
        tech: techScore,
        communication: commScore,
      },
    });

    toast.success('Review added successfully');
    setReviewNote('');
    
    // Refresh the selected application
    const updated = applications.find(a => a.id === selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const stageCounts = {
    all: filteredApplications.length,
    applied: filteredApplications.filter(a => a.stage === 'applied').length,
    shortlisted: filteredApplications.filter(a => a.stage === 'shortlisted').length,
    interview: filteredApplications.filter(a => a.stage === 'interview').length,
    offered: filteredApplications.filter(a => a.stage === 'offered').length,
    rejected: filteredApplications.filter(a => a.stage === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Applications Pipeline</h2>
        <p className="text-sm text-gray-600">Review and manage candidate applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl mb-1">{stageCounts.all}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-blue-600 mb-1">{stageCounts.applied}</p>
            <p className="text-sm text-gray-600">Applied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-purple-600 mb-1">{stageCounts.shortlisted}</p>
            <p className="text-sm text-gray-600">Shortlisted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-yellow-600 mb-1">{stageCounts.interview}</p>
            <p className="text-sm text-gray-600">Interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-green-600 mb-1">{stageCounts.offered}</p>
            <p className="text-sm text-gray-600">Offered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-red-600 mb-1">{stageCounts.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filter by Job</Label>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {myJobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} ({applications.filter(a => a.jobId === job.id).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filter by Stage</Label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications list */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map(app => {
            const job = getJob(app.jobId);
            if (!job) return null;

            return (
              <Card
                key={app.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOpenApplication(app)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <CardTitle className="text-lg">{app.studentName}</CardTitle>
                        </div>
                        <Badge className={getStageColor(app.stage)}>
                          {app.stage}
                        </Badge>
                      </div>
                      <CardDescription>{job.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {app.studentEmail}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    {app.reviewerNotes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {app.reviewerNotes.length} review(s)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Application Review Dialog */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Application Review</DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left side - Application details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="mb-3">Candidate Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedApp.studentName}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedApp.studentEmail}</p>
                    <p><span className="text-gray-600">Applied:</span> {new Date(selectedApp.createdAt).toLocaleString()}</p>
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-block"
                    >
                      View Resume →
                    </a>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Cover Letter</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Review History</h4>
                  <div className="space-y-3">
                    {selectedApp.reviewerNotes.length === 0 ? (
                      <p className="text-sm text-gray-500">No reviews yet</p>
                    ) : (
                      selectedApp.reviewerNotes.map((note, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm mb-2">{note.note}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{note.reviewer}</span>
                            <span>•</span>
                            <span>{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="space-y-6">
                <div>
                  <h4 className="mb-3">Stage Management</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Current Stage</Label>
                      <Badge className={`${getStageColor(selectedApp.stage)} mt-2 w-full justify-center py-2`}>
                        {selectedApp.stage}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newStage">Move to Stage</Label>
                      <Select value={newStage} onValueChange={(value: any) => setNewStage(value)}>
                        <SelectTrigger id="newStage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offered">Offered</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleUpdateStage} className="w-full">
                      Update Stage
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Evaluation Scores</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="aptitudeScore">Aptitude (0-100)</Label>
                      <Input
                        id="aptitudeScore"
                        type="number"
                        min="0"
                        max="100"
                        value={aptitudeScore || ''}
                        onChange={(e) => setAptitudeScore(Number(e.target.value) || undefined)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="techScore">Technical (0-100)</Label>
                      <Input
                        id="techScore"
                        type="number"
                        min="0"
                        max="100"
                        value={techScore || ''}
                        onChange={(e) => setTechScore(Number(e.target.value) || undefined)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commScore">Communication (0-100)</Label>
                      <Input
                        id="commScore"
                        type="number"
                        min="0"
                        max="100"
                        value={commScore || ''}
                        onChange={(e) => setCommScore(Number(e.target.value) || undefined)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Add Review Note</h4>
                  <div className="space-y-3">
                    <Textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Enter your review comments..."
                      rows={4}
                    />
                    <Button onClick={handleAddReview} className="w-full">
                      Add Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
