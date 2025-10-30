import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Application } from '../../lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { FileText, Building2, MapPin, Calendar, TrendingUp } from 'lucide-react';

export function MyApplications() {
  const { user } = useAuth();
  const { applications, jobs } = useData();
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const myApplications = applications.filter(app => app.studentId === user!.id);

  const filteredApplications = myApplications.filter(app => {
    if (stageFilter === 'all') return true;
    return app.stage === stageFilter;
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageLabel = (stage: Application['stage']) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  const stageCounts = {
    all: myApplications.length,
    applied: myApplications.filter(a => a.stage === 'applied').length,
    shortlisted: myApplications.filter(a => a.stage === 'shortlisted').length,
    interview: myApplications.filter(a => a.stage === 'interview').length,
    offered: myApplications.filter(a => a.stage === 'offered').length,
    rejected: myApplications.filter(a => a.stage === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">My Applications</h2>
        <p className="text-sm text-gray-600">Track the status of your job applications</p>
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

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label className="min-w-fit">Filter by status:</Label>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications ({stageCounts.all})</SelectItem>
                <SelectItem value="applied">Applied ({stageCounts.applied})</SelectItem>
                <SelectItem value="shortlisted">Shortlisted ({stageCounts.shortlisted})</SelectItem>
                <SelectItem value="interview">Interview ({stageCounts.interview})</SelectItem>
                <SelectItem value="offered">Offered ({stageCounts.offered})</SelectItem>
                <SelectItem value="rejected">Rejected ({stageCounts.rejected})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications list */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {stageFilter === 'all' 
                  ? "You haven't applied to any jobs yet"
                  : `No applications with status: ${getStageLabel(stageFilter as Application['stage'])}`
                }
              </p>
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
                onClick={() => setSelectedApplication(app)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{job.companyName}</span>
                      </div>
                      <CardTitle className="mb-1">{job.title}</CardTitle>
                      <CardDescription>Applied on {new Date(app.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge className={getStageColor(app.stage)}>
                      {getStageLabel(app.stage)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Updated {new Date(app.updatedAt).toLocaleDateString()}
                    </div>
                    {app.reviewerNotes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {app.reviewerNotes.length} reviewer note(s)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Application Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {(() => {
                const job = getJob(selectedApplication.jobId);
                if (!job) return null;

                return (
                  <>
                    {/* Job info */}
                    <div>
                      <h4 className="mb-3">Position</h4>
                      <div className="space-y-2">
                        <p className="text-xl">{job.title}</p>
                        <p className="text-gray-600">{job.companyName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                          {job.isRemote && <Badge variant="secondary">Remote</Badge>}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Application status */}
                    <div>
                      <h4 className="mb-3">Status</h4>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStageColor(selectedApplication.stage)} px-4 py-2`}>
                          {getStageLabel(selectedApplication.stage)}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <p>Applied: {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                          <p>Last Updated: {new Date(selectedApplication.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Cover letter */}
                    <div>
                      <h4 className="mb-3">Cover Letter</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>

                    {/* Scores */}
                    {(selectedApplication.scores.aptitude || selectedApplication.scores.tech || selectedApplication.scores.communication) && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="mb-3">Evaluation Scores</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {selectedApplication.scores.aptitude && (
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl text-blue-600">{selectedApplication.scores.aptitude}</p>
                                <p className="text-sm text-gray-600">Aptitude</p>
                              </div>
                            )}
                            {selectedApplication.scores.tech && (
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-2xl text-purple-600">{selectedApplication.scores.tech}</p>
                                <p className="text-sm text-gray-600">Technical</p>
                              </div>
                            )}
                            {selectedApplication.scores.communication && (
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl text-green-600">{selectedApplication.scores.communication}</p>
                                <p className="text-sm text-gray-600">Communication</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Reviewer notes */}
                    {selectedApplication.reviewerNotes.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="mb-3">Reviewer Notes</h4>
                          <div className="space-y-3">
                            {selectedApplication.reviewerNotes.map((note, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm mb-2">{note.note}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{note.reviewer}</span>
                                  <span>•</span>
                                  <span>{new Date(note.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
