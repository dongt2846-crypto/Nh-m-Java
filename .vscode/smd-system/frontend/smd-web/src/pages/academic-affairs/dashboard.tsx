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
  pendingApproval: number;
  approvedThisMonth: number;
  totalPrograms: number;
  complianceScore: number;
}

export default function AcademicAffairsDashboard() {
  const router = useRouter();
  const [pendingSyllabi, setPendingSyllabi] = useState<Syllabus[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pendingApproval: 0,
    approvedThisMonth: 0,
    totalPrograms: 5,
    complianceScore: 85
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const pendingRes = await syllabusAPI.getAll('PENDING_APPROVAL');
      setPendingSyllabi(pendingRes.data);
      
      setStats(prev => ({
        ...prev,
        pendingApproval: pendingRes.data.length
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Academic Affairs Dashboard</h1>
          <p className="text-gray-600">Manage program structure, PLOs, and final syllabus approvals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingApproval}</dd>
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
                    <span className="text-white text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved This Month</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.approvedThisMonth}</dd>
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
                    <span className="text-white text-sm font-medium">🎓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Programs</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalPrograms}</dd>
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
                    <span className="text-white text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Compliance Score</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.complianceScore}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Pending Final Approval ({pendingSyllabi.length})
              </h2>
              <button
                onClick={() => router.push('/academic-affairs/review')}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {pendingSyllabi.slice(0, 5).map((syllabus) => (
                <div key={syllabus.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {syllabus.courseCode} - {syllabus.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Department: {syllabus.department}
                      </p>
                      <p className="text-xs text-gray-400">
                        Submitted: {new Date(syllabus.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/academic-affairs/review/${syllabus.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingSyllabi.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No syllabi pending approval
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* PLO Management */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Program Learning Outcomes</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/academic-affairs/plo-management')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Manage PLOs</div>
                  <div className="text-sm text-gray-500">Define and update program learning outcomes</div>
                </button>
                
                <button
                  onClick={() => router.push('/academic-affairs/program-structure')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Program Structure</div>
                  <div className="text-sm text-gray-500">Manage curriculum and course relationships</div>
                </button>
              </div>
            </div>

            {/* Reports & Analytics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reports & Analytics</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/academic-affairs/reports')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Compliance Reports</div>
                  <div className="text-sm text-gray-500">CLO-PLO alignment and compliance analysis</div>
                </button>
                
                <button
                  onClick={() => router.push('/academic-affairs/analytics')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Program Analytics</div>
                  <div className="text-sm text-gray-500">Program performance and improvement insights</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">PLO updated for Computer Science program</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Syllabus CS301 approved for publication</span>
                <span className="text-xs text-gray-400">3 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Compliance report generated for Fall 2024</span>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}