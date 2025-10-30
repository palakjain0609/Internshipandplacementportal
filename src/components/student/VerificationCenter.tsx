import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Verification } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function VerificationCenter() {
  const { user } = useAuth();
  const { verifications, addVerification, getProfile } = useData();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [documentType, setDocumentType] = useState<Verification['documentType']>('transcript');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const profile = getProfile(user!.id);
  const myVerifications = verifications.filter(v => v.studentId === user!.id);

  const getStatusIcon = (status: Verification['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Verification['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const handleUpload = () => {
    if (!fileName.trim() || !fileUrl.trim()) {
      toast.error('Please provide both file name and URL');
      return;
    }

    // Check if already submitted this document type
    const existingDoc = myVerifications.find(
      v => v.documentType === documentType && v.status === 'pending'
    );

    if (existingDoc) {
      toast.error(`You already have a pending ${documentType} verification`);
      return;
    }

    addVerification({
      studentId: user!.id,
      studentName: user!.name,
      documentType,
      fileUrl,
      fileName,
      status: 'pending',
    });

    toast.success('Document submitted for verification');
    setShowUploadDialog(false);
    setFileName('');
    setFileUrl('');
    setDocumentType('transcript');
  };

  const statusCounts = {
    total: myVerifications.length,
    pending: myVerifications.filter(v => v.status === 'pending').length,
    approved: myVerifications.filter(v => v.status === 'approved').length,
    rejected: myVerifications.filter(v => v.status === 'rejected').length,
  };

  const getDocumentTypeLabel = (type: Verification['documentType']) => {
    switch (type) {
      case 'transcript':
        return 'Academic Transcript';
      case 'certificate':
        return 'Degree Certificate';
      case 'id_proof':
        return 'ID Proof';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Verification Center</h2>
          <p className="text-sm text-gray-600">Upload documents for faculty verification</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Verification status */}
      {profile?.isVerified ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <AlertDescription className="text-green-800 ml-2">
            Your profile is verified! You can now apply to all jobs including those requiring verification.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>
            Complete document verification to unlock jobs that require verified profiles. Upload transcripts and certificates for faculty review.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl mb-1">{statusCounts.total}</p>
            <p className="text-sm text-gray-600">Total Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-yellow-600 mb-1">{statusCounts.pending}</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-green-600 mb-1">{statusCounts.approved}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl text-red-600 mb-1">{statusCounts.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents list */}
      <div className="space-y-4">
        {myVerifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No documents uploaded yet</p>
              <Button onClick={() => setShowUploadDialog(true)}>
                Upload Your First Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          myVerifications.map(verification => (
            <Card key={verification.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStatusIcon(verification.status)}
                    </div>
                    <div>
                      <CardTitle className="mb-1">{getDocumentTypeLabel(verification.documentType)}</CardTitle>
                      <CardDescription>{verification.fileName}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(verification.status)}>
                    {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="mb-1">Submitted</p>
                      <p>{new Date(verification.submittedAt).toLocaleString()}</p>
                    </div>
                    {verification.reviewedAt && (
                      <div>
                        <p className="mb-1">Reviewed</p>
                        <p>{new Date(verification.reviewedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {verification.reviewedBy && (
                    <div className="text-sm">
                      <p className="text-gray-600 mb-1">Reviewed by</p>
                      <p>{verification.reviewedBy}</p>
                    </div>
                  )}

                  {verification.remarks && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm mb-1">Remarks</p>
                      <p className="text-sm text-gray-700">{verification.remarks}</p>
                    </div>
                  )}

                  <div>
                    <a
                      href={verification.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Document →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document for Verification</DialogTitle>
            <DialogDescription>
              Submit your academic documents for faculty review
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type *</Label>
              <Select value={documentType} onValueChange={(value: any) => setDocumentType(value)}>
                <SelectTrigger id="documentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transcript">Academic Transcript</SelectItem>
                  <SelectItem value="certificate">Degree Certificate</SelectItem>
                  <SelectItem value="id_proof">ID Proof</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileName">File Name *</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g., transcript_2025.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL *</Label>
              <Input
                id="fileUrl"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/documents/your-file.pdf"
              />
              <p className="text-xs text-gray-500">
                Upload your file to a cloud storage service and paste the link here
              </p>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Note: Documents typically take 1-3 business days to be reviewed by faculty. You'll be notified once the review is complete.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleUpload} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
