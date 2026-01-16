import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { syllabusAPI } from '../../services/api';

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function LecturerDashboard() {
  const router = useRouter();
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySyllabi();
  }, []);

  const fetchMySyllabi = async () => {
    try {
      const response = await syllabusAPI.getMy();
      setSyllabi(response.data);
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (id: number) => {
    try {
      await syllabusAPI.submit(id);
      fetchMySyllabi(); // Refresh list
      alert('Syllabus submitted for review');
    } catch (error) {
      alert('Error submitting syllabus');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_APPROVAL': return 'bg-blue-100 text-blue-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Syllabi</h1>
          <button
            onClick={() => router.push('/lecturer/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Syllabus
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {syllabi.map((syllabus) => (
              <li key={syllabus.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(syllabus.status)}`}>
                        {syllabus.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {syllabus.courseCode} - {syllabus.courseName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(syllabus.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/lecturer/edit/${syllabus.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    
                    {syllabus.status === 'DRAFT' && (
                      <button
                        onClick={() => handleSubmitForReview(syllabus.id)}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Submit for Review
                      </button>
                    )}
                    
                    <button
                      onClick={() => router.push(`/syllabus/${syllabus.id}`)}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {syllabi.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No syllabi found. Create your first syllabus!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}