import { useState, useEffect } from 'react';
import { syllabusAPI } from '../../services/api';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisites: string[];
  semester: number;
  department: string;
}

interface TreeNode {
  course: Course;
  children: TreeNode[];
  level: number;
}

export default function SubjectTree() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      buildCourseTree();
    }
  }, [courses, selectedDepartment]);

  const fetchCourses = async () => {
    try {
      const response = await syllabusAPI.getAll('PUBLISHED');
      const coursesData = response.data.map((syllabus: any) => ({
        id: syllabus.id,
        courseCode: syllabus.courseCode,
        courseName: syllabus.courseName,
        credits: syllabus.credits,
        prerequisites: extractPrerequisites(syllabus.prerequisites),
        semester: getSemesterNumber(syllabus.courseCode),
        department: syllabus.department
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractPrerequisites = (prereqText: string): string[] => {
    if (!prereqText) return [];
    // Simple regex to extract course codes
    const matches = prereqText.match(/[A-Z]{2,4}\s*\d{3,4}/g);
    return matches ? matches.map(code => code.replace(/\s+/g, '')) : [];
  };

  const getSemesterNumber = (courseCode: string): number => {
    // Extract semester from course code (e.g., CS101 -> 1, CS201 -> 2)
    const match = courseCode.match(/\d+/);
    if (match) {
      const num = parseInt(match[0]);
      return Math.floor(num / 100);
    }
    return 1;
  };

  const buildCourseTree = () => {
    const filteredCourses = selectedDepartment 
      ? courses.filter(course => course.department === selectedDepartment)
      : courses;

    // Build tree structure
    const courseMap = new Map<string, Course>();
    filteredCourses.forEach(course => {
      courseMap.set(course.courseCode, course);
    });

    const buildNode = (course: Course, level: number = 0, visited: Set<string> = new Set()): TreeNode => {
      if (visited.has(course.courseCode)) {
        return { course, children: [], level };
      }
      
      visited.add(course.courseCode);
      
      const children: TreeNode[] = [];
      
      // Find courses that have this course as prerequisite
      filteredCourses.forEach(otherCourse => {
        if (otherCourse.prerequisites.includes(course.courseCode)) {
          children.push(buildNode(otherCourse, level + 1, new Set(visited)));
        }
      });

      return { course, children, level };
    };

    // Find root courses (courses with no prerequisites or prerequisites not in our dataset)
    const rootCourses = filteredCourses.filter(course => 
      course.prerequisites.length === 0 || 
      !course.prerequisites.some(prereq => courseMap.has(prereq))
    );

    const tree = rootCourses.map(course => buildNode(course));
    setTreeData(tree);
  };

  const renderTreeNode = (node: TreeNode) => {
    const { course, children, level } = node;
    const indentClass = `ml-${level * 8}`;
    
    return (
      <div key={course.id} className="mb-2">
        <div className={`flex items-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 ${indentClass}`}>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded">
                {course.courseCode}
              </span>
              <span className="font-medium text-gray-900">{course.courseName}</span>
              <span className="text-sm text-gray-500">{course.credits} credits</span>
            </div>
            {course.prerequisites.length > 0 && (
              <div className="mt-1 text-sm text-gray-600">
                Prerequisites: {course.prerequisites.join(', ')}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Semester {course.semester}
          </div>
        </div>
        
        {children.length > 0 && (
          <div className="mt-2">
            {children.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  const renderTableView = () => {
    const filteredCourses = selectedDepartment 
      ? courses.filter(course => course.department === selectedDepartment)
      : courses;

    const groupedBySemester = filteredCourses.reduce((acc, course) => {
      const sem = course.semester;
      if (!acc[sem]) acc[sem] = [];
      acc[sem].push(course);
      return acc;
    }, {} as Record<number, Course[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedBySemester)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([semester, semesterCourses]) => (
            <div key={semester} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Semester {semester}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {semesterCourses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded">
                        {course.courseCode}
                      </span>
                      <span className="text-sm text-gray-500">{course.credits} credits</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{course.courseName}</h4>
                    {course.prerequisites.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <strong>Prerequisites:</strong> {course.prerequisites.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Relationship Tree</h1>
          <p className="text-gray-600">Visualize course prerequisites and academic progression</p>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'tree'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🌳 Tree View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊 Semester View
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'tree' ? (
          <div className="space-y-4">
            {treeData.length > 0 ? (
              treeData.map(node => renderTreeNode(node))
            ) : (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🌳</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No course relationships found</h3>
                <p className="text-gray-600">
                  Try selecting a different department or check if courses have prerequisite information.
                </p>
              </div>
            )}
          </div>
        ) : (
          renderTableView()
        )}

        {/* Legend */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span>Course with prerequisites</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Foundation course (no prerequisites)</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Tree View:</strong> Shows prerequisite relationships as a hierarchical tree</p>
            <p><strong>Semester View:</strong> Groups courses by recommended semester progression</p>
          </div>
        </div>
      </div>
    </div>
  );
}