import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { GraduationCap, Briefcase, UserCheck, Shield } from 'lucide-react';

export function LoginPage() {
  const { login, register } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'student' | 'recruiter' | 'faculty' | 'admin'>('student');
  const [registerDepartment, setRegisterDepartment] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await login(loginEmail, loginPassword);
    if (!result) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerName || !registerEmail || !registerPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const result = await register(
      registerName,
      registerEmail,
      registerPassword,
      registerRole,
      registerDepartment || undefined
    );

    if (!result) {
      setError('Email already exists. Please use a different email.');
    } else {
      setSuccess('Registration successful! Redirecting...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl mb-4">Campus Placement Portal</h1>
            <p className="text-xl text-gray-600">Connect students, recruiters, and faculty in one comprehensive platform</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-1">For Students</h3>
                <p className="text-sm text-gray-600">Build your profile, showcase projects, and apply to exciting opportunities</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="mb-1">For Recruiters</h3>
                <p className="text-sm text-gray-600">Post jobs, manage applications, and track your hiring pipeline</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="mb-1">For Faculty</h3>
                <p className="text-sm text-gray-600">Verify student credentials and support the placement process</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="mb-1">For Admins</h3>
                <p className="text-sm text-gray-600">Manage users, oversee operations, and generate analytics</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1 font-mono text-gray-700">
              <p>Student: alice@student.edu / student123</p>
              <p>Recruiter: david@techcorp.com / recruiter123</p>
              <p>Faculty: frank@placement.edu / faculty123</p>
              <p>Admin: admin@placement.edu / admin123</p>
            </div>
          </div>
        </div>

        {/* Right side - Forms */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <Select value={registerRole} onValueChange={(value: any) => setRegisterRole(value)}>
                      <SelectTrigger id="register-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="recruiter">Recruiter</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(registerRole === 'student' || registerRole === 'faculty') && (
                    <div className="space-y-2">
                      <Label htmlFor="register-department">Department (Optional)</Label>
                      <Input
                        id="register-department"
                        type="text"
                        placeholder="e.g., Computer Science"
                        value={registerDepartment}
                        onChange={(e) => setRegisterDepartment(e.target.value)}
                      />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
