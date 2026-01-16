import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { syllabusAPI } from '../../services/api';

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  status: string;
  createdBy: string;
  createdAt: string;
  department: string;
}

export default function Home() {
  const router = useRouter();
  const [pendingSyllabi, setPendingSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
  const [comments, setComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingSyllabi();
  }, []);

  const fetchPendingSyllabi = async () => {
    try {
      const response = await syllabusAPI.getPendingReview();
      setPendingSyllabi(response.data);
    } catch (error) {
      console.error('Error fetching pending syllabi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (syllabusId: number) => {
    setActionLoading(true);
    try {
      await syllabusAPI.approve(syllabusId, comments);
      alert('Syllabus approved successfully');
      fetchPendingSyllabi();
      setSelectedSyllabus(null);
      setComments('');
    } catch (error) {
      alert('Error approving syllabus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (syllabusId: number) => {
    if (!comments.trim()) {
      alert('Please provide comments for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await syllabusAPI.reject(syllabusId, comments);
      alert('Syllabus rejected');
      fetchPendingSyllabi();
      setSelectedSyllabus(null);
      setComments('');
    } catch (error) {
      alert('Error rejecting syllabus');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_APPROVAL': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">HoD Dashboard</h1>
          <p className="text-gray-600">Review and approve syllabi submissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Syllabi List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Pending Review ({pendingSyllabi.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {pendingSyllabi.map((syllabus) => (
                <div
                  key={syllabus.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedSyllabus?.id === syllabus.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedSyllabus(syllabus)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {syllabus.courseCode} - {syllabus.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        By: {syllabus.createdBy}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(syllabus.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(syllabus.status)}`}>
                      {syllabus.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
              
              {pendingSyllabi.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No syllabi pending review
                </div>
              )}
            </div>
          </div>

          {/* Review Panel */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedSyllabus ? 'Review Syllabus' : 'Select a Syllabus'}
              </h2>
            </div>
            
            {selectedSyllabus ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedSyllabus.courseCode} - {selectedSyllabus.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Department: {selectedSyllabus.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted by: {selectedSyllabus.createdBy}
                  </p>
                </div>

                <div className="mb-6">
                  <button
                    onClick={() => router.push(`/syllabus/${selectedSyllabus.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View Full Syllabus →
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (Optional for approval, Required for rejection)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add your comments here..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedSyllabus.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                  
                  <button
                    onClick={() => handleReject(selectedSyllabus.id)}
                    disabled={actionLoading || !comments.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {/* TODO: Trigger AI analysis */}}
                    className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded"
                  >
                    🤖 Run AI Change Detection
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a syllabus from the list to review
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}