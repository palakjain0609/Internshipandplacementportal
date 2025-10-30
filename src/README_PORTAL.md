# Campus Placement Portal

A comprehensive full-stack internship and placement management system with role-based access control (RBAC), built with React and TypeScript.

## Features

### 🎓 For Students
- **Profile Management**: Build comprehensive profiles with skills, projects, and resume
- **Job Discovery**: Browse and filter job postings by location, skills, and requirements
- **Application Tracking**: Submit applications and track status through the hiring pipeline
- **Document Verification**: Upload transcripts and certificates for faculty verification
- **Eligibility Checks**: Automatic validation against CGPA, batch, and verification requirements

### 💼 For Recruiters
- **Job Posting**: Create detailed job listings with skills, eligibility criteria, and screening questions
- **Application Pipeline**: Review applications across stages (applied → shortlisted → interview → offered → rejected)
- **Candidate Evaluation**: Add scores and review notes for each applicant
- **Analytics Dashboard**: View recruitment metrics, conversion rates, and skills demand
- **Bulk Actions**: Efficiently manage multiple applications

### 👨‍🏫 For Faculty
- **Verification Queue**: Review student-submitted documents (transcripts, certificates)
- **Approve/Reject**: Verify documents with detailed remarks
- **Status Tracking**: Monitor pending, approved, and rejected verifications
- **Profile Verification**: Enable students to access verification-required jobs

### 🛡️ For Admins
- **User Management**: View, edit, and deactivate user accounts across all roles
- **System Analytics**: Campus-wide insights including placement funnels and batch statistics
- **Department & Skills**: Manage taxonomies for departments and technical skills
- **Comprehensive Reports**: Track recruiter performance and skills demand

## User Roles & Access Control

### Student
- Create and edit own profile
- Browse all open jobs
- Apply to eligible positions
- Track application status
- Submit documents for verification

### Recruiter
- Post and manage job listings
- Review applications for their jobs
- Update candidate stages
- Add evaluation scores and notes
- View recruitment analytics

### Faculty
- Review verification requests
- Approve/reject documents with remarks
- Update student verification status

### Admin
- Full system access
- Manage all users and roles
- View system-wide analytics
- Configure departments and skills

## Demo Accounts

Use these credentials to explore different roles:

- **Student**: alice@student.edu / student123
- **Recruiter**: david@techcorp.com / recruiter123
- **Faculty**: frank@placement.edu / faculty123
- **Admin**: admin@placement.edu / admin123

## Data Structure

### Core Models

**User**
- id, name, email, role (student|recruiter|faculty|admin)
- department, createdAt, isActive

**StudentProfile**
- userId, program, graduationYear, cgpa
- skills[], projects[], resumeUrl
- isVerified, verifiedFields{}

**Job**
- id, recruiterId, companyName, title, description
- skills[], location, isRemote
- eligibility{minCgpa, batch[], requiresVerification}
- stipend/salary, status, deadline

**Application**
- id, jobId, studentId, coverLetter, resumeUrl
- stage (applied|shortlisted|interview|offered|rejected)
- scores{aptitude, tech, communication}
- reviewerNotes[]

**Verification**
- id, studentId, documentType (transcript|certificate|id_proof)
- fileUrl, status (pending|approved|rejected)
- remarks, reviewedBy, reviewedAt

## Key Features

### RBAC (Role-Based Access Control)
- Server-side authorization middleware (simulated via context)
- Client-side route guards based on user role
- Granular permissions for data access and mutations

### Search & Filtering
- Job search by title, company, skills, location
- Application filtering by stage and job
- User management with role and status filters
- Verification queue filtering

### Pagination
- All listing pages support pagination
- Configurable page size
- Efficient data loading

### Analytics & Aggregations
- Placement funnel analysis
- Skills demand tracking
- Batch-wise placement rates
- Recruiter performance metrics
- Conversion rate calculations

### File Handling
- Resume URL storage
- Document upload for verification
- File metadata tracking
- Access control for document viewing

### Validation Rules
- Job eligibility checks (CGPA, batch, verification)
- One application per job per student
- Positive compensation amounts
- Stage transition controls
- Required field validation

## Application Flow

### Student Journey
1. Register/Login → Student Dashboard
2. Complete profile (program, skills, projects, resume)
3. Submit documents for verification (if required)
4. Browse jobs with filters
5. View job details and check eligibility
6. Apply with cover letter
7. Track application stages
8. Respond to offers

### Recruiter Journey
1. Login → Recruiter Dashboard
2. Create job posting with eligibility criteria
3. Review incoming applications
4. Filter by stage and add review notes
5. Score candidates (aptitude, technical, communication)
6. Move candidates through pipeline stages
7. Make offers
8. View analytics and performance

### Faculty Journey
1. Login → Faculty Dashboard
2. View verification queue
3. Review submitted documents
4. Approve/reject with remarks
5. Update student verification status

### Admin Journey
1. Login → Admin Dashboard
2. View system-wide analytics
3. Manage user accounts and roles
4. Configure departments and skills
5. Monitor platform health
6. Export reports

## Technical Implementation

### State Management
- React Context API for auth and data
- Local state for component-specific UI
- LocalStorage for data persistence

### Data Persistence
- Browser LocalStorage for simulating backend
- Automatic sync on data changes
- Initial seed data from mockData.ts

### UI Components
- Shadcn/ui component library
- Responsive design
- Accessible forms and controls
- Toast notifications for actions

### Type Safety
- TypeScript for type checking
- Defined interfaces for all data models
- Prop type validation

## Future Enhancements

- Real backend API integration (Node.js + MongoDB)
- File upload to cloud storage (AWS S3, Cloudflare R2)
- Email notifications for stage changes
- Interview scheduling system
- Resume parsing and skill extraction
- Advanced search with Elasticsearch
- Export to CSV/PDF
- Real-time updates with WebSockets
- Mobile app version

## Security Considerations

⚠️ **Important**: This is a frontend demonstration. For production use:
- Implement proper backend authentication (JWT, sessions)
- Hash passwords with bcrypt
- Add rate limiting and CSRF protection
- Validate all inputs server-side
- Use HTTPS and secure cookies
- Implement proper RBAC middleware
- Add audit logging
- Comply with data privacy regulations (GDPR, etc.)
- Never store PII without proper security measures

## Getting Started

1. Login with any demo account
2. Explore the role-specific dashboard
3. Try creating, editing, and managing data
4. Test the complete workflows
5. View analytics and reports

Enjoy exploring the Campus Placement Portal! 🎓
