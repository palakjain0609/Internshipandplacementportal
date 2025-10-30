import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export function RecruiterAnalytics() {
  const { user } = useAuth();
  const { jobs, applications } = useData();

  const myJobs = jobs.filter(j => j.recruiterId === user!.id);
  const myApplications = applications.filter(app =>
    myJobs.some(job => job.id === app.jobId)
  );

  // Calculate metrics
  const totalJobs = myJobs.length;
  const openJobs = myJobs.filter(j => j.status === 'open').length;
  const totalApplications = myApplications.length;
  const avgApplicationsPerJob = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0;

  // Stage breakdown
  const stageStats = {
    applied: myApplications.filter(a => a.stage === 'applied').length,
    shortlisted: myApplications.filter(a => a.stage === 'shortlisted').length,
    interview: myApplications.filter(a => a.stage === 'interview').length,
    offered: myApplications.filter(a => a.stage === 'offered').length,
    rejected: myApplications.filter(a => a.stage === 'rejected').length,
  };

  // Conversion rates
  const shortlistRate = totalApplications > 0 
    ? ((stageStats.shortlisted / totalApplications) * 100).toFixed(1)
    : 0;
  const offerRate = totalApplications > 0
    ? ((stageStats.offered / totalApplications) * 100).toFixed(1)
    : 0;

  // Skills in demand (from job postings)
  const skillsCount: Record<string, number> = {};
  myJobs.forEach(job => {
    job.skills.forEach(skill => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Job performance
  const jobPerformance = myJobs.map(job => {
    const jobApps = applications.filter(a => a.jobId === job.id);
    return {
      title: job.title,
      applications: jobApps.length,
      shortlisted: jobApps.filter(a => a.stage === 'shortlisted').length,
      offered: jobApps.filter(a => a.stage === 'offered').length,
    };
  }).sort((a, b) => b.applications - a.applications);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Analytics Dashboard</h2>
        <p className="text-sm text-gray-600">Insights into your recruitment performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl">{totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Positions</p>
                <p className="text-2xl">{openJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl">{totalApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Apps/Job</p>
                <p className="text-2xl">{avgApplicationsPerJob}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Funnel</CardTitle>
          <CardDescription>Application stage breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Applied</span>
                <span className="text-sm text-gray-600">{stageStats.applied}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalApplications > 0 ? (stageStats.applied / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Shortlisted</span>
                <span className="text-sm text-gray-600">{stageStats.shortlisted} ({shortlistRate}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalApplications > 0 ? (stageStats.shortlisted / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Interview</span>
                <span className="text-sm text-gray-600">{stageStats.interview}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalApplications > 0 ? (stageStats.interview / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Offered</span>
                <span className="text-sm text-gray-600">{stageStats.offered} ({offerRate}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalApplications > 0 ? (stageStats.offered / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Rejected</span>
                <span className="text-sm text-gray-600">{stageStats.rejected}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${totalApplications > 0 ? (stageStats.rejected / totalApplications) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills in Demand */}
        <Card>
          <CardHeader>
            <CardTitle>Skills in Demand</CardTitle>
            <CardDescription>Most requested skills in your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {topSkills.length === 0 ? (
              <p className="text-sm text-gray-500">No skills data available</p>
            ) : (
              <div className="space-y-3">
                {topSkills.map(([skill, count], index) => (
                  <div key={skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <Badge variant="secondary">{skill}</Badge>
                    </div>
                    <span className="text-sm text-gray-600">{count} {count === 1 ? 'job' : 'jobs'}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Job Performance</CardTitle>
            <CardDescription>Applications received per job</CardDescription>
          </CardHeader>
          <CardContent>
            {jobPerformance.length === 0 ? (
              <p className="text-sm text-gray-500">No jobs posted yet</p>
            ) : (
              <div className="space-y-4">
                {jobPerformance.slice(0, 5).map((job, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm truncate flex-1 mr-2">{job.title}</p>
                      <Badge variant="outline">{job.applications}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Shortlisted: {job.shortlisted}</span>
                      <span>•</span>
                      <span>Offered: {job.offered}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
