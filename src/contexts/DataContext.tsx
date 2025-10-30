import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  StudentProfile,
  Job,
  Application,
  Verification,
  Department,
  Skill,
  mockUsers,
  mockProfiles,
  mockJobs,
  mockApplications,
  mockVerifications,
  mockDepartments,
  mockSkills,
} from '../lib/mockData';

interface DataContextType {
  // Users
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  
  // Profiles
  profiles: StudentProfile[];
  getProfile: (userId: string) => StudentProfile | undefined;
  updateProfile: (userId: string, updates: Partial<StudentProfile>) => void;
  
  // Jobs
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  
  // Applications
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplicationsByJob: (jobId: string) => Application[];
  getApplicationsByStudent: (studentId: string) => Application[];
  
  // Verifications
  verifications: Verification[];
  addVerification: (verification: Omit<Verification, 'id' | 'submittedAt'>) => void;
  updateVerification: (id: string, updates: Partial<Verification>) => void;
  
  // Departments & Skills
  departments: Department[];
  skills: Skill[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Initialize data from localStorage or mock data
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedProfiles = localStorage.getItem('profiles');
    const storedJobs = localStorage.getItem('jobs');
    const storedApplications = localStorage.getItem('applications');
    const storedVerifications = localStorage.getItem('verifications');
    const storedDepartments = localStorage.getItem('departments');
    const storedSkills = localStorage.getItem('skills');

    setUsers(storedUsers ? JSON.parse(storedUsers) : mockUsers);
    setProfiles(storedProfiles ? JSON.parse(storedProfiles) : mockProfiles);
    setJobs(storedJobs ? JSON.parse(storedJobs) : mockJobs);
    setApplications(storedApplications ? JSON.parse(storedApplications) : mockApplications);
    setVerifications(storedVerifications ? JSON.parse(storedVerifications) : mockVerifications);
    setDepartments(storedDepartments ? JSON.parse(storedDepartments) : mockDepartments);
    setSkills(storedSkills ? JSON.parse(storedSkills) : mockSkills);
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (users.length > 0) localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (profiles.length > 0) localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (jobs.length > 0) localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    if (applications.length > 0) localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (verifications.length > 0) localStorage.setItem('verifications', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    if (departments.length > 0) localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    if (skills.length > 0) localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  // User operations
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  // Profile operations
  const getProfile = (userId: string) => {
    return profiles.find(p => p.userId === userId);
  };

  const updateProfile = (userId: string, updates: Partial<StudentProfile>) => {
    setProfiles(prev => {
      const existing = prev.find(p => p.userId === userId);
      if (existing) {
        return prev.map(p => p.userId === userId ? { ...p, ...updates } : p);
      } else {
        // Create new profile if doesn't exist
        return [...prev, { userId, ...updates } as StudentProfile];
      }
    });
  };

  // Job operations
  const addJob = (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...job,
      id: `job${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  // Application operations
  const addApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newApplication: Application = {
      ...application,
      id: `app${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications(prev => [newApplication, ...prev]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, ...updates, updatedAt: new Date().toISOString() }
          : app
      )
    );
  };

  const getApplicationsByJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getApplicationsByStudent = (studentId: string) => {
    return applications.filter(app => app.studentId === studentId);
  };

  // Verification operations
  const addVerification = (verification: Omit<Verification, 'id' | 'submittedAt'>) => {
    const newVerification: Verification = {
      ...verification,
      id: `ver${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setVerifications(prev => [newVerification, ...prev]);
  };

  const updateVerification = (id: string, updates: Partial<Verification>) => {
    setVerifications(prev =>
      prev.map(ver => ver.id === id ? { ...ver, ...updates } : ver)
    );
  };

  // Department & Skill operations
  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...department,
      id: `dept${Date.now()}`,
    };
    setDepartments(prev => [...prev, newDept]);
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: `skill${Date.now()}`,
    };
    setSkills(prev => [...prev, newSkill]);
  };

  return (
    <DataContext.Provider
      value={{
        users,
        updateUser,
        profiles,
        getProfile,
        updateProfile,
        jobs,
        addJob,
        updateJob,
        deleteJob,
        applications,
        addApplication,
        updateApplication,
        getApplicationsByJob,
        getApplicationsByStudent,
        verifications,
        addVerification,
        updateVerification,
        departments,
        skills,
        addDepartment,
        addSkill,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
