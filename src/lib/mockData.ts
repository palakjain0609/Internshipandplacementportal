// Mock data for the placement portal

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'faculty' | 'admin';
  department?: string;
  createdAt: string;
  isActive: boolean;
}

export interface StudentProfile {
  userId: string;
  program: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  resumeUrl: string;
  isVerified: boolean;
  verifiedFields: {
    transcript: boolean;
    certificate: boolean;
  };
}

export interface Job {
  id: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  title: string;
  description: string;
  skills: string[];
  eligibility: {
    minCgpa: number;
    batch: number[];
    requiresVerification: boolean;
  };
  location: string;
  isRemote: boolean;
  stipend?: number;
  salary?: number;
  status: 'open' | 'closed';
  deadline: string;
  createdAt: string;
  screeningQuestions?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  coverLetter: string;
  resumeUrl: string;
  stage: 'applied' | 'shortlisted' | 'interview' | 'offered' | 'rejected';
  scores: {
    aptitude?: number;
    tech?: number;
    communication?: number;
  };
  reviewerNotes: Array<{
    note: string;
    timestamp: string;
    reviewer: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  id: string;
  studentId: string;
  studentName: string;
  documentType: 'transcript' | 'certificate' | 'id_proof';
  fileUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

// Initial mock data
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@placement.edu',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'student1',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    role: 'student',
    department: 'Computer Science',
    createdAt: '2025-01-15T00:00:00Z',
    isActive: true,
  },
  {
    id: 'student2',
    name: 'Bob Smith',
    email: 'bob@student.edu',
    role: 'student',
    department: 'Electrical Engineering',
    createdAt: '2025-01-16T00:00:00Z',
    isActive: true,
  },
  {
    id: 'student3',
    name: 'Carol White',
    email: 'carol@student.edu',
    role: 'student',
    department: 'Computer Science',
    createdAt: '2025-01-17T00:00:00Z',
    isActive: true,
  },
  {
    id: 'recruiter1',
    name: 'David Brown',
    email: 'david@techcorp.com',
    role: 'recruiter',
    createdAt: '2025-01-10T00:00:00Z',
    isActive: true,
  },
  {
    id: 'recruiter2',
    name: 'Emma Davis',
    email: 'emma@innovate.com',
    role: 'recruiter',
    createdAt: '2025-01-11T00:00:00Z',
    isActive: true,
  },
  {
    id: 'faculty1',
    name: 'Prof. Frank Wilson',
    email: 'frank@placement.edu',
    role: 'faculty',
    department: 'Computer Science',
    createdAt: '2025-01-05T00:00:00Z',
    isActive: true,
  },
];

export const mockProfiles: StudentProfile[] = [
  {
    userId: 'student1',
    program: 'B.Tech Computer Science',
    graduationYear: 2025,
    cgpa: 8.5,
    skills: ['React', 'Node.js', 'Python', 'MongoDB', 'Machine Learning'],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce application using MERN stack',
        link: 'https://github.com/alice/ecommerce',
      },
      {
        title: 'ML-based Recommendation System',
        description: 'Developed a content recommendation engine using collaborative filtering',
      },
    ],
    resumeUrl: 'https://example.com/resume/alice.pdf',
    isVerified: true,
    verifiedFields: {
      transcript: true,
      certificate: true,
    },
  },
  {
    userId: 'student2',
    program: 'B.Tech Electrical Engineering',
    graduationYear: 2025,
    cgpa: 7.8,
    skills: ['C++', 'Python', 'MATLAB', 'Embedded Systems', 'IoT'],
    projects: [
      {
        title: 'Smart Home Automation',
        description: 'IoT-based home automation system with voice control',
      },
    ],
    resumeUrl: 'https://example.com/resume/bob.pdf',
    isVerified: false,
    verifiedFields: {
      transcript: false,
      certificate: false,
    },
  },
  {
    userId: 'student3',
    program: 'B.Tech Computer Science',
    graduationYear: 2026,
    cgpa: 9.2,
    skills: ['Java', 'Spring Boot', 'React', 'Docker', 'Kubernetes', 'AWS'],
    projects: [
      {
        title: 'Microservices Architecture',
        description: 'Scalable microservices platform with container orchestration',
        link: 'https://github.com/carol/microservices',
      },
    ],
    resumeUrl: 'https://example.com/resume/carol.pdf',
    isVerified: true,
    verifiedFields: {
      transcript: true,
      certificate: true,
    },
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job1',
    recruiterId: 'recruiter1',
    recruiterName: 'David Brown',
    companyName: 'TechCorp Solutions',
    title: 'Software Engineer Intern',
    description: 'Join our team to work on cutting-edge web applications. You will collaborate with senior engineers to design and develop scalable solutions.',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    eligibility: {
      minCgpa: 7.5,
      batch: [2025, 2026],
      requiresVerification: true,
    },
    location: 'Bangalore',
    isRemote: false,
    stipend: 50000,
    status: 'open',
    deadline: '2025-11-30T23:59:59Z',
    createdAt: '2025-10-15T10:00:00Z',
    screeningQuestions: [
      'Why do you want to work at TechCorp?',
      'Describe a challenging project you worked on.',
    ],
  },
  {
    id: 'job2',
    recruiterId: 'recruiter2',
    recruiterName: 'Emma Davis',
    companyName: 'Innovate Labs',
    title: 'Machine Learning Intern',
    description: 'Work on exciting ML projects involving NLP and computer vision. Great opportunity to learn from industry experts.',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch'],
    eligibility: {
      minCgpa: 8.0,
      batch: [2025],
      requiresVerification: true,
    },
    location: 'Hyderabad',
    isRemote: true,
    stipend: 60000,
    status: 'open',
    deadline: '2025-12-15T23:59:59Z',
    createdAt: '2025-10-20T14:00:00Z',
  },
  {
    id: 'job3',
    recruiterId: 'recruiter1',
    recruiterName: 'David Brown',
    companyName: 'TechCorp Solutions',
    title: 'Full Stack Developer',
    description: 'Full-time position for graduating students. Work on enterprise applications with modern tech stack.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    eligibility: {
      minCgpa: 7.0,
      batch: [2025],
      requiresVerification: false,
    },
    location: 'Bangalore',
    isRemote: false,
    salary: 1200000,
    status: 'open',
    deadline: '2025-11-20T23:59:59Z',
    createdAt: '2025-10-10T09:00:00Z',
  },
  {
    id: 'job4',
    recruiterId: 'recruiter2',
    recruiterName: 'Emma Davis',
    companyName: 'Innovate Labs',
    title: 'Backend Developer Intern',
    description: 'Build scalable APIs and microservices. Learn cloud-native development practices.',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'MongoDB'],
    eligibility: {
      minCgpa: 7.5,
      batch: [2025, 2026],
      requiresVerification: false,
    },
    location: 'Mumbai',
    isRemote: true,
    stipend: 45000,
    status: 'open',
    deadline: '2025-12-01T23:59:59Z',
    createdAt: '2025-10-25T11:00:00Z',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app1',
    jobId: 'job1',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    studentEmail: 'alice@student.edu',
    coverLetter: 'I am very interested in this position because I have extensive experience with the MERN stack...',
    resumeUrl: 'https://example.com/resume/alice.pdf',
    stage: 'shortlisted',
    scores: {
      aptitude: 85,
      tech: 90,
      communication: 88,
    },
    reviewerNotes: [
      {
        note: 'Strong technical background. Good project portfolio.',
        timestamp: '2025-10-20T15:30:00Z',
        reviewer: 'David Brown',
      },
    ],
    createdAt: '2025-10-16T10:00:00Z',
    updatedAt: '2025-10-20T15:30:00Z',
  },
  {
    id: 'app2',
    jobId: 'job2',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    studentEmail: 'alice@student.edu',
    coverLetter: 'My passion for machine learning and previous projects make me an ideal candidate...',
    resumeUrl: 'https://example.com/resume/alice.pdf',
    stage: 'interview',
    scores: {
      aptitude: 88,
      tech: 85,
    },
    reviewerNotes: [
      {
        note: 'Impressive ML project. Schedule for technical interview.',
        timestamp: '2025-10-22T10:00:00Z',
        reviewer: 'Emma Davis',
      },
    ],
    createdAt: '2025-10-21T09:00:00Z',
    updatedAt: '2025-10-22T10:00:00Z',
  },
  {
    id: 'app3',
    jobId: 'job1',
    studentId: 'student3',
    studentName: 'Carol White',
    studentEmail: 'carol@student.edu',
    coverLetter: 'With my strong background in full-stack development and cloud technologies...',
    resumeUrl: 'https://example.com/resume/carol.pdf',
    stage: 'offered',
    scores: {
      aptitude: 95,
      tech: 92,
      communication: 90,
    },
    reviewerNotes: [
      {
        note: 'Exceptional candidate. Top of the cohort.',
        timestamp: '2025-10-25T14:00:00Z',
        reviewer: 'David Brown',
      },
      {
        note: 'Offer extended. Awaiting response.',
        timestamp: '2025-10-28T10:00:00Z',
        reviewer: 'David Brown',
      },
    ],
    createdAt: '2025-10-17T11:00:00Z',
    updatedAt: '2025-10-28T10:00:00Z',
  },
  {
    id: 'app4',
    jobId: 'job4',
    studentId: 'student3',
    studentName: 'Carol White',
    studentEmail: 'carol@student.edu',
    coverLetter: 'I am excited about the opportunity to work with microservices and Kubernetes...',
    resumeUrl: 'https://example.com/resume/carol.pdf',
    stage: 'applied',
    scores: {},
    reviewerNotes: [],
    createdAt: '2025-10-26T14:00:00Z',
    updatedAt: '2025-10-26T14:00:00Z',
  },
];

export const mockVerifications: Verification[] = [
  {
    id: 'ver1',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    documentType: 'transcript',
    fileUrl: 'https://example.com/docs/alice-transcript.pdf',
    fileName: 'transcript_alice.pdf',
    status: 'approved',
    remarks: 'All documents verified. CGPA matches records.',
    submittedAt: '2025-10-05T10:00:00Z',
    reviewedAt: '2025-10-06T14:00:00Z',
    reviewedBy: 'Prof. Frank Wilson',
  },
  {
    id: 'ver2',
    studentId: 'student1',
    studentName: 'Alice Johnson',
    documentType: 'certificate',
    fileUrl: 'https://example.com/docs/alice-cert.pdf',
    fileName: 'degree_certificate.pdf',
    status: 'approved',
    remarks: 'Certificate verified.',
    submittedAt: '2025-10-05T10:05:00Z',
    reviewedAt: '2025-10-06T14:05:00Z',
    reviewedBy: 'Prof. Frank Wilson',
  },
  {
    id: 'ver3',
    studentId: 'student2',
    studentName: 'Bob Smith',
    documentType: 'transcript',
    fileUrl: 'https://example.com/docs/bob-transcript.pdf',
    fileName: 'transcript_bob.pdf',
    status: 'pending',
    submittedAt: '2025-10-28T09:00:00Z',
  },
  {
    id: 'ver4',
    studentId: 'student3',
    studentName: 'Carol White',
    documentType: 'transcript',
    fileUrl: 'https://example.com/docs/carol-transcript.pdf',
    fileName: 'transcript_carol.pdf',
    status: 'approved',
    remarks: 'Excellent academic record.',
    submittedAt: '2025-10-01T10:00:00Z',
    reviewedAt: '2025-10-02T11:00:00Z',
    reviewedBy: 'Prof. Frank Wilson',
  },
];

export const mockDepartments: Department[] = [
  { id: 'dept1', name: 'Computer Science', code: 'CS' },
  { id: 'dept2', name: 'Electrical Engineering', code: 'EE' },
  { id: 'dept3', name: 'Mechanical Engineering', code: 'ME' },
  { id: 'dept4', name: 'Information Technology', code: 'IT' },
  { id: 'dept5', name: 'Electronics and Communication', code: 'EC' },
];

export const mockSkills: Skill[] = [
  { id: 'skill1', name: 'React', category: 'Frontend' },
  { id: 'skill2', name: 'Node.js', category: 'Backend' },
  { id: 'skill3', name: 'Python', category: 'Programming' },
  { id: 'skill4', name: 'Java', category: 'Programming' },
  { id: 'skill5', name: 'MongoDB', category: 'Database' },
  { id: 'skill6', name: 'PostgreSQL', category: 'Database' },
  { id: 'skill7', name: 'Machine Learning', category: 'AI/ML' },
  { id: 'skill8', name: 'TensorFlow', category: 'AI/ML' },
  { id: 'skill9', name: 'AWS', category: 'Cloud' },
  { id: 'skill10', name: 'Docker', category: 'DevOps' },
  { id: 'skill11', name: 'Kubernetes', category: 'DevOps' },
  { id: 'skill12', name: 'Spring Boot', category: 'Backend' },
];
