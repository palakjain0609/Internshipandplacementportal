import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Verification } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { CheckCircle, XCircle, FileText, User, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function VerificationQueue() {
  const { user } = useAuth();
  const { verifications, updateVerification, profiles, updateProfile } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [remarks, setRemarks] = useState('');

  const filteredVerifications = verifications.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (docTypeFilter !== 'all' && v.documentType !== docTypeFilter) return false;
    return true;
  });

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

  const handleApprove = () => {
    if (!selectedVerification) return;

    updateVerification(selectedVerification.id, {
      status: 'approved',
      remarks: remarks || 'Document verified and approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: user!.name,
    });

    // Update student profile verification status
    const profile = profiles.find(p => p.userId === selectedVerification.studentId);
    if (profile) {
      const updatedFields = { ...profile.verifiedFields };
      if (selectedVerification.documentType === 'transcript') {
        updatedFields.transcript = true;
      } else if (selectedVerification.documentType === 'certificate') {
        updatedFields.certificate = true;
      }

      // Check if all required fields are verified
      const isFullyVerified = updatedFields.transcript && updatedFields.certificate;

      updateProfile(selectedVerification.studentId, {
        verifiedFields: updatedFields,
        isVerified: isFullyVerified,
      });
    }

    toast.success('Document approved successfully');
    setSelectedVerification(null);
    setRemarks('');
  };

  const handleReject = () => {
    if (!selectedVerification) return;

    if (!remarks.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    updateVerification(selectedVerification.id, {
      status: 'rejected',
      remarks,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user!.name,
    });

    toast.success('Document rejected');
    setSelectedVerification(null);
    setRemarks('');
  };

  const handleViewDocument = (verification: Verification) => {
    setSelectedVerification(verification);
    setRemarks(verification.remarks || '');
  };

  const statusCounts = {
    all: verifications.length,
    pending: verifications.filter(v => v.status === 'pending').length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Verification Queue</h2>
        <p className="text-sm text-gray-600">Review and approve student documents</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                  <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
                  <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filter by Document Type</Label>
              <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="transcript">Transcripts</SelectItem>
                  <SelectItem value="certificate">Certificates</SelectItem>
                  <SelectItem value="id_proof">ID Proofs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verifications list */}
      <div className="space-y-4">
        {filteredVerifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No verifications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredVerifications.map(verification => (
            <Card
              key={verification.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleViewDocument(verification)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <CardTitle className="text-lg">{verification.studentName}</CardTitle>
                      <Badge className={getStatusColor(verification.status)}>
                        {verification.status}
                      </Badge>
                    </div>
                    <CardDescription>{getDocumentTypeLabel(verification.documentType)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {verification.fileName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Submitted {new Date(verification.submittedAt).toLocaleDateString()}
                    </div>
                    {verification.reviewedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Reviewed {new Date(verification.reviewedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {verification.reviewedBy && (
                    <div className="text-sm text-gray-600">
                      Reviewed by: {verification.reviewedBy}
                    </div>
                  )}

                  {verification.remarks && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{verification.remarks}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Dialog */}
      {selectedVerification && (
        <Dialog open={!!selectedVerification} onOpenChange={(open) => !open && setSelectedVerification(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Review Document</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Student & Document Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Student</p>
                  <p>{selectedVerification.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Document Type</p>
                  <p>{getDocumentTypeLabel(selectedVerification.documentType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">File Name</p>
                  <p className="text-sm">{selectedVerification.fileName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted</p>
                  <p className="text-sm">{new Date(selectedVerification.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <Badge className={getStatusColor(selectedVerification.status)}>
                  {selectedVerification.status}
                </Badge>
              </div>

              {/* Document Link */}
              <div>
                <a
                  href={selectedVerification.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Document
                </a>
              </div>

              {/* Review Form */}
              {selectedVerification.status === 'pending' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks {selectedVerification.status === 'pending' && '(required for rejection)'}</Label>
                    <Textarea
                      id="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter your review comments..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </>
              )}

              {/* Previous Review Info */}
              {selectedVerification.status !== 'pending' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    Reviewed by {selectedVerification.reviewedBy} on{' '}
                    {selectedVerification.reviewedAt && new Date(selectedVerification.reviewedAt).toLocaleString()}
                  </p>
                  {selectedVerification.remarks && (
                    <p className="text-sm text-gray-700">{selectedVerification.remarks}</p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
