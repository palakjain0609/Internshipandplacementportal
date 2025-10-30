import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MyJobs } from './MyJobs';
import { CreateJobForm } from './CreateJobForm';
import { ApplicationsPipeline } from './ApplicationsPipeline';
import { RecruiterAnalytics } from './RecruiterAnalytics';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Briefcase, PlusCircle, Users, BarChart3, LogOut } from 'lucide-react';

export function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const { jobs, applications } = useData();
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  if (!user) return null;

  const myJobs = jobs.filter(j => j.recruiterId === user.id);
  const myApplications = applications.filter(app =>
    myJobs.some(job => job.id === app.jobId)
  );

  const openJobs = myJobs.filter(j => j.status === 'open').length;
  const totalApplications = myApplications.length;
  const offeredCount = myApplications.filter(a => a.stage === 'offered').length;

  const handleViewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab('applications');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Recruiter Portal</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm">{user.email}</p>
                <p className="text-xs text-gray-500">Recruiter</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl mt-1">{myJobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Positions</p>
                <p className="text-2xl mt-1">{openJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl mt-1">{totalApplications}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offers Made</p>
                <p className="text-2xl mt-1">{offeredCount}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="create">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Job
            </TabsTrigger>
            <TabsTrigger value="applications">
              <Users className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <MyJobs onViewApplications={handleViewApplications} />
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <CreateJobForm onSuccess={() => setActiveTab('jobs')} />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationsPipeline selectedJobId={selectedJobId} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <RecruiterAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
