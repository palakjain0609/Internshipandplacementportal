import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StudentProfile } from './StudentProfile';
import { JobsList } from './JobsList';
import { MyApplications } from './MyApplications';
import { VerificationCenter } from './VerificationCenter';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Briefcase, User, FileText, CheckCircle, LogOut } from 'lucide-react';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const { getProfile, applications, jobs } = useData();
  const [activeTab, setActiveTab] = useState('jobs');

  if (!user) return null;

  const profile = getProfile(user.id);
  const myApplications = applications.filter(app => app.studentId === user.id);
  const activeApplications = myApplications.filter(app => 
    app.stage !== 'rejected' && app.stage !== 'offered'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Campus Placement Portal</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm">{user.email}</p>
                <p className="text-xs text-gray-500">{user.department || 'Student'}</p>
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
                <p className="text-sm text-gray-600">Profile Status</p>
                <p className="text-2xl mt-1">{profile?.isVerified ? 'Verified' : 'Pending'}</p>
              </div>
              <CheckCircle className={`w-8 h-8 ${profile?.isVerified ? 'text-green-500' : 'text-gray-300'}`} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Applications</p>
                <p className="text-2xl mt-1">{activeApplications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl mt-1">{myApplications.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Jobs</p>
                <p className="text-2xl mt-1">{jobs.filter(j => j.status === 'open').length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="applications">
              <FileText className="w-4 h-4 mr-2" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              My Profile
            </TabsTrigger>
            <TabsTrigger value="verification">
              <CheckCircle className="w-4 h-4 mr-2" />
              Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <JobsList />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <MyApplications />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <StudentProfile />
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <VerificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
