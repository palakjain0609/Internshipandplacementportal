import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Briefcase, TrendingUp, Award, GraduationCap } from 'lucide-react';

export function AdminAnalytics() {
  const { users, jobs, applications, profiles, verifications } = useData();

  // User analytics
  const usersByRole = {
    student: users.filter(u => u.role === 'student').length,
    recruiter: users.filter(u => u.role === 'recruiter').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  const activeUsers = users.filter(u => u.isActive).length;

  // Job analytics
  const openJobs = jobs.filter(j => j.status === 'open').length;
  const closedJobs = jobs.filter(j => j.status === 'closed').length;

  // Application analytics by stage
  const applicationsByStage = {
    applied: applications.filter(a => a.stage === 'applied').length,
    shortlisted: applications.filter(a => a.stage === 'shortlisted').length,
    interview: applications.filter(a => a.stage === 'interview').length,
    offered: applications.filter(a => a.stage === 'offered').length,
    rejected: applications.filter(a => a.stage === 'rejected').length,
  };

  // Placement stats by batch
  const batchStats = profiles.reduce((acc, profile) => {
    const year = profile.graduationYear;
    if (!acc[year]) {
      acc[year] = {
        total: 0,
        applied: 0,
        offered: 0,
      };
    }
    acc[year].total++;

    const studentApps = applications.filter(a => a.studentId === profile.userId);
    if (studentApps.length > 0) acc[year].applied++;
    if (studentApps.some(a => a.stage === 'offered')) acc[year].offered++;

    return acc;
  }, {} as Record<number, { total: number; applied: number; offered: number }>);

  const batchYears = Object.keys(batchStats).sort((a, b) => Number(a) - Number(b));

  // Skills demand from jobs
  const skillsCount: Record<string, number> = {};
  jobs.forEach(job => {
    job.skills.forEach(skill => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Verification stats
  const verificationStats = {
    pending: verifications.filter(v => v.status === 'pending').length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
  };

  // Recruiter performance
  const recruiterPerformance = users
    .filter(u => u.role === 'recruiter')
    .map(recruiter => {
      const recruiterJobs = jobs.filter(j => j.recruiterId === recruiter.id);
      const recruiterApps = applications.filter(app =>
        recruiterJobs.some(job => job.id === app.jobId)
      );
      return {
        name: recruiter.name,
        jobs: recruiterJobs.length,
        applications: recruiterApps.length,
        offers: recruiterApps.filter(a => a.stage === 'offered').length,
      };
    })
    .filter(r => r.jobs > 0)
    .sort((a, b) => b.applications - a.applications);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Analytics Dashboard</h2>
        <p className="text-sm text-gray-600">System-wide insights and metrics</p>
      </div>

      {/* User Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Breakdown of users by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="bg-gray-100 p-3 rounded-lg mb-2">
                <Users className="w-6 h-6 text-gray-600 mx-auto" />
              </div>
              <p className="text-2xl">{activeUsers}</p>
              <p className="text-xs text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <GraduationCap className="w-6 h-6 text-blue-600 mx-auto" />
              </div>
              <p className="text-2xl text-blue-600">{usersByRole.student}</p>
              <p className="text-xs text-gray-600">Students</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-2">
                <Briefcase className="w-6 h-6 text-green-600 mx-auto" />
              </div>
              <p className="text-2xl text-green-600">{usersByRole.recruiter}</p>
              <p className="text-xs text-gray-600">Recruiters</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-2">
                <Users className="w-6 h-6 text-purple-600 mx-auto" />
              </div>
              <p className="text-2xl text-purple-600">{usersByRole.faculty}</p>
              <p className="text-xs text-gray-600">Faculty</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-lg mb-2">
                <Users className="w-6 h-6 text-red-600 mx-auto" />
              </div>
              <p className="text-2xl text-red-600">{usersByRole.admin}</p>
              <p className="text-xs text-gray-600">Admins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placement Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Placement Funnel</CardTitle>
          <CardDescription>Application stage distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Applied</span>
                <span className="text-sm text-gray-600">{applicationsByStage.applied}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      applications.length > 0 ? (applicationsByStage.applied / applications.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Shortlisted</span>
                <span className="text-sm text-gray-600">
                  {applicationsByStage.shortlisted} (
                  {applications.length > 0
                    ? ((applicationsByStage.shortlisted / applications.length) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      applications.length > 0 ? (applicationsByStage.shortlisted / applications.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Interview</span>
                <span className="text-sm text-gray-600">{applicationsByStage.interview}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      applications.length > 0 ? (applicationsByStage.interview / applications.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Offered</span>
                <span className="text-sm text-gray-600">
                  {applicationsByStage.offered} (
                  {applications.length > 0
                    ? ((applicationsByStage.offered / applications.length) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      applications.length > 0 ? (applicationsByStage.offered / applications.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Rejected</span>
                <span className="text-sm text-gray-600">{applicationsByStage.rejected}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      applications.length > 0 ? (applicationsByStage.rejected / applications.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Batch-wise Placement */}
        <Card>
          <CardHeader>
            <CardTitle>Batch-wise Placement</CardTitle>
            <CardDescription>Placement statistics by graduation year</CardDescription>
          </CardHeader>
          <CardContent>
            {batchYears.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No batch data available</p>
            ) : (
              <div className="space-y-4">
                {batchYears.map(year => {
                  const stats = batchStats[Number(year)];
                  const placementRate =
                    stats.total > 0 ? ((stats.offered / stats.total) * 100).toFixed(1) : 0;
                  return (
                    <div key={year} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Batch {year}</span>
                        <Badge variant="outline">{stats.total} students</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>Applied: {stats.applied}</div>
                        <div>Placed: {stats.offered}</div>
                        <div>Rate: {placementRate}%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${placementRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Demand */}
        <Card>
          <CardHeader>
            <CardTitle>Skills in Demand</CardTitle>
            <CardDescription>Most requested skills across all job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {topSkills.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No skills data available</p>
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

        {/* Verification Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Document verification breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Review</span>
                <Badge variant="outline" className="bg-yellow-50">{verificationStats.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <Badge variant="outline" className="bg-green-50">{verificationStats.approved}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rejected</span>
                <Badge variant="outline" className="bg-red-50">{verificationStats.rejected}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruiter Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Recruiter Performance</CardTitle>
            <CardDescription>Top recruiters by activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recruiterPerformance.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No recruiter data available</p>
            ) : (
              <div className="space-y-4">
                {recruiterPerformance.slice(0, 5).map((recruiter, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1 mr-2">{recruiter.name}</span>
                      <Badge variant="outline">{recruiter.jobs} jobs</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Apps: {recruiter.applications}</span>
                      <span>•</span>
                      <span>Offers: {recruiter.offers}</span>
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
