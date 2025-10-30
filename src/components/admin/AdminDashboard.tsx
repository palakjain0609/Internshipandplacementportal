import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { UserManagement } from './UserManagement';
import { DepartmentSkillsManagement } from './DepartmentSkillsManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, Settings, BarChart3, LogOut, Briefcase, FileCheck } from 'lucide-react';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { users, jobs, applications, verifications } = useData();
  const [activeTab, setActiveTab] = useState('analytics');

  if (!user) return null;

  const activeUsers = users.filter(u => u.isActive).length;
  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const pendingVerifications = verifications.filter(v => v.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Admin Portal</h1>
              <p className="text-sm text-gray-600">System Administration & Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
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
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl mt-1">{activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl mt-1">{totalJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl mt-1">{totalApplications}</p>
              </div>
              <FileCheck className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verifications</p>
                <p className="text-2xl mt-1">{pendingVerifications}</p>
              </div>
              <FileCheck className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <DepartmentSkillsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
