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

interface DashboardStats {
  awaitingFinalApproval: number;
  publishedThisMonth: number;
  totalDepartments: number;
  overallProgress: number;
}

export default function PrincipalDashboard() {
  const router = useRouter();
  const [approvedSyllabi, setApprovedSyllabi] = useState<Syllabus[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    awaitingFinalApproval: 0,
    publishedThisMonth: 12,
    totalDepartments: 8,
    overallProgress: 78
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const approvedRes = await syllabusAPI.getAll('APPROVED');
      setApprovedSyllabi(approvedRes.data);
      
      setStats(prev => ({
        ...prev,
        awaitingFinalApproval: approvedRes.data.length
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSyllabus = async (syllabusId: number) => {
    try {
      await syllabusAPI.publish(syllabusId);
      fetchDashboardData();
      alert('Syllabus published successfully');
    } catch (error) {
      alert('Error publishing syllabus');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Principal Dashboard</h1>
          <p className="text-gray-600">Executive overview and final syllabus approvals</p>
        </div>

        {/* Executive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⚡</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Awaiting Final Approval</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.awaitingFinalApproval}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📚</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published This Month</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.publishedThisMonth}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🏢</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Departments</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalDepartments}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📈</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Overall Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.overallProgress}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Final Approvals */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Ready for Publication ({approvedSyllabi.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {approvedSyllabi.map((syllabus) => (
                <div key={syllabus.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {syllabus.courseCode} - {syllabus.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Department: {syllabus.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        Lecturer: {syllabus.createdBy}
                      </p>
                      <p className="text-xs text-gray-400">
                        Approved: {new Date(syllabus.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/syllabus/${syllabus.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handlePublishSyllabus(syllabus.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {approvedSyllabi.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No syllabi awaiting final approval
                </div>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Year Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Syllabi Completion</span>
                    <span>{stats.overallProgress}%</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${stats.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>• 156 syllabi published</p>
                  <p>• 23 pending approval</p>
                  <p>• 8 in review process</p>
                </div>
              </div>
            </div>

            {/* Department Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Department Status</h3>
              
              <div className="space-y-3">
                {[
                  { name: 'Computer Science', progress: 95, status: 'excellent' },
                  { name: 'Mathematics', progress: 88, status: 'good' },
                  { name: 'Physics', progress: 72, status: 'fair' },
                  { name: 'Chemistry', progress: 65, status: 'needs-attention' }
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{dept.progress}%</span>
                      <div className={`w-2 h-2 rounded-full ${
                        dept.status === 'excellent' ? 'bg-green-400' :
                        dept.status === 'good' ? 'bg-blue-400' :
                        dept.status === 'fair' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/principal/reports')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Executive Reports</div>
                  <div className="text-sm text-gray-500">Comprehensive academic reports</div>
                </button>
                
                <button
                  onClick={() => router.push('/principal/announcements')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">System Announcements</div>
                  <div className="text-sm text-gray-500">Broadcast messages to all users</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}