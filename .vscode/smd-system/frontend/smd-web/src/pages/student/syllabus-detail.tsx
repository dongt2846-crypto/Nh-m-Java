import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { syllabusAPI } from '../../services/api';

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  academicYear: string;
  description: string;
  objectives: string;
  prerequisites: string;
  assessmentMethods: string;
  textbooks: string;
  references: string;
  createdBy: string;
  createdAt: string;
}

export default function SyllabusDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSyllabus();
    }
  }, [id]);

  const fetchSyllabus = async () => {
    try {
      const response = await syllabusAPI.getById(Number(id));
      setSyllabus(response.data);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (!syllabus) return;
    
    setLoadingSummary(true);
    try {
      // Simulate AI summary generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiSummary(`This course provides a comprehensive introduction to ${syllabus.courseName}. Students will learn key concepts and practical applications through lectures, assignments, and projects. The course covers fundamental principles and prepares students for advanced topics in the field.`);
    } catch (error) {
      console.error('Error generating AI summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!syllabus) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Syllabus Not Found</h1>
          <p className="text-gray-600 mt-2">The requested syllabus could not be found.</p>
          <button
            onClick={() => router.push('/student/search')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'objectives', name: 'Learning Objectives', icon: '🎯' },
    { id: 'assessment', name: 'Assessment', icon: '📊' },
    { id: 'resources', name: 'Resources', icon: '📚' },
    { id: 'ai-summary', name: 'AI Summary', icon: '🤖' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Search
            </button>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {syllabus.courseCode}
                </span>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  {syllabus.credits} Credits
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {syllabus.courseName}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📍 {syllabus.department}</span>
                <span>📅 {syllabus.semester} {syllabus.academicYear}</span>
                <span>👨‍🏫 {syllabus.createdBy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Course Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {syllabus.description || 'No description available.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Prerequisites</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {syllabus.prerequisites || 'No prerequisites specified.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Course Code:</dt>
                        <dd className="font-medium">{syllabus.courseCode}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Credits:</dt>
                        <dd className="font-medium">{syllabus.credits}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Department:</dt>
                        <dd className="font-medium">{syllabus.department}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Semester:</dt>
                        <dd className="font-medium">{syllabus.semester} {syllabus.academicYear}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Instructor Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Instructor:</dt>
                        <dd className="font-medium">{syllabus.createdBy}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Last Updated:</dt>
                        <dd className="font-medium">{new Date(syllabus.createdAt).toLocaleDateString()}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Objectives Tab */}
            {activeTab === 'objectives' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Objectives</h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {syllabus.objectives || 'No learning objectives specified.'}
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Tab */}
            {activeTab === 'assessment' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Methods</h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {syllabus.assessmentMethods || 'No assessment methods specified.'}
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Required Textbooks</h3>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {syllabus.textbooks || 'No textbooks specified.'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional References</h3>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {syllabus.references || 'No additional references specified.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary Tab */}
            {activeTab === 'ai-summary' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">AI-Generated Summary</h3>
                  <button
                    onClick={generateAISummary}
                    disabled={loadingSummary}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {loadingSummary ? 'Generating...' : 'Generate Summary'}
                  </button>
                </div>

                {aiSummary ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">AI Summary</h4>
                        <p className="text-blue-700 leading-relaxed">{aiSummary}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-4 block">🤖</span>
                    <p>Click "Generate Summary" to get an AI-powered overview of this course.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}