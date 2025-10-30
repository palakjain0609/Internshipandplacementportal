import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: User['role'], department?: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from localStorage or use defaults
    const usersJson = localStorage.getItem('users');
    const credentials = localStorage.getItem('credentials') || '{}';
    const creds = JSON.parse(credentials);

    // For demo purposes, allow any password for existing users
    // In production, this would verify against hashed passwords
    if (usersJson) {
      const users = JSON.parse(usersJson);
      const foundUser = users.find((u: User) => u.email === email && u.isActive);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
    }

    // Demo accounts (for easy testing)
    const demoAccounts = [
      { email: 'admin@placement.edu', password: 'admin123', role: 'admin' },
      { email: 'alice@student.edu', password: 'student123', role: 'student' },
      { email: 'david@techcorp.com', password: 'recruiter123', role: 'recruiter' },
      { email: 'frank@placement.edu', password: 'faculty123', role: 'faculty' },
    ];

    const demoAccount = demoAccounts.find(acc => acc.email === email);
    if (demoAccount) {
      // Get the corresponding user from mock data
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const foundUser = users.find((u: User) => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          return true;
        }
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: User['role'],
    department?: string
  ): Promise<boolean> => {
    const usersJson = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersJson);

    // Check if user already exists
    if (users.some((u: User) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user${Date.now()}`,
      name,
      email,
      role,
      department,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Store credentials (in production, would hash password)
    const credentials = JSON.parse(localStorage.getItem('credentials') || '{}');
    credentials[email] = password;
    localStorage.setItem('credentials', JSON.stringify(credentials));

    // Auto-login after registration
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // If student, create empty profile
    if (role === 'student') {
      const profilesJson = localStorage.getItem('profiles') || '[]';
      const profiles = JSON.parse(profilesJson);
      profiles.push({
        userId: newUser.id,
        program: '',
        graduationYear: new Date().getFullYear() + 1,
        cgpa: 0,
        skills: [],
        projects: [],
        resumeUrl: '',
        isVerified: false,
        verifiedFields: {
          transcript: false,
          certificate: false,
        },
      });
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
