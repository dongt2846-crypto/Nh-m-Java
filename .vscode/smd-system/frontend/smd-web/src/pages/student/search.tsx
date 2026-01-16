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
  createdBy: string;
}

export default function StudentSearch() {
  const router = useRouter();
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [filteredSyllabi, setFilteredSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCredits, setSelectedCredits] = useState('');

  // Debounce search term to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const semesters = ['Fall', 'Spring', 'Summer', 'Winter'];
  const creditOptions = ['1', '2', '3', '4', '5', '6'];

  useEffect(() => {
    fetchSyllabi();
  }, []);

  useEffect(() => {
    filterSyllabi();
  }, [syllabi, debouncedTerm, selectedDepartment, selectedSemester, selectedCredits]);

  const fetchSyllabi = async () => {
    try {
      const response = await syllabusAPI.getAll('PUBLISHED');
      setSyllabi(response.data);
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSyllabi = () => {
    let filtered = syllabi;

    // Text search
    if (debouncedTerm) {
      filtered = filtered.filter(syllabus =>
        syllabus.courseCode.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        syllabus.courseName.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        syllabus.description.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment) {
      filtered = filtered.filter(syllabus => syllabus.department === selectedDepartment);
    }

    // Semester filter
    if (selectedSemester) {
      filtered = filtered.filter(syllabus => syllabus.semester === selectedSemester);
    }

    // Credits filter
    if (selectedCredits) {
      filtered = filtered.filter(syllabus => syllabus.credits.toString() === selectedCredits);
    }

    setFilteredSyllabi(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedSemester('');
    setSelectedCredits('');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-gray-600">Search and explore available course syllabi</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Courses
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by course code, name, or description..."
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            {/* Credits Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credits
              </label>
              <select
                value={selectedCredits}
                onChange={(e) => setSelectedCredits(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Any Credits</option>
                {creditOptions.map(credit => (
                  <option key={credit} value={credit}>{credit} Credits</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredSyllabi.length} of {syllabi.length} courses
            </div>
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabi.map((syllabus) => (
            <div
              key={syllabus.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/student/syllabus-detail/${syllabus.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    {syllabus.courseCode}
                  </span>
                  <span className="text-sm text-gray-500">
                    {syllabus.credits} Credits
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {syllabus.courseName}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {syllabus.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{syllabus.department}</span>
                  <span>{syllabus.semester} {syllabus.academicYear}</span>
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  Instructor: {syllabus.createdBy}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">View Details</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSyllabi.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or clearing the filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Quick Stats */}
        {filteredSyllabi.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {filteredSyllabi.length}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(filteredSyllabi.map(s => s.department)).size}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredSyllabi.reduce((sum, s) => sum + s.credits, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Credits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(filteredSyllabi.map(s => s.createdBy)).size}
                </div>
                <div className="text-sm text-gray-600">Instructors</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}