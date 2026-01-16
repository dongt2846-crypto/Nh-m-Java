import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { syllabusAPI } from '../../services/api';

interface SyllabusForm {
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
}

export default function CreateSyllabus() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<SyllabusForm>();

  const onSubmit = async (data: SyllabusForm) => {
    setLoading(true);
    setError('');

    try {
      await syllabusAPI.create(data);
      router.push('/lecturer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating syllabus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Syllabus</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow px-6 py-6 rounded-lg">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Code</label>
              <input
                {...register('courseCode', { required: 'Course code is required' })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., CS101"
              />
              {errors.courseCode && (
                <p className="mt-1 text-sm text-red-600">{errors.courseCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                {...register('courseName', { required: 'Course name is required' })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Introduction to Computer Science"
              />
              {errors.courseName && (
                <p className="mt-1 text-sm text-red-600">{errors.courseName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                {...register('department')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Credits</label>
              <input
                {...register('credits', { 
                  required: 'Credits is required',
                  min: { value: 1, message: 'Credits must be at least 1' }
                })}
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="3"
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                {...register('semester')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <input
                {...register('academicYear')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="2024-2025"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe the course content and scope..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Learning Objectives</label>
            <textarea
              {...register('objectives')}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="List the learning objectives..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prerequisites</label>
            <textarea
              {...register('prerequisites')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="List course prerequisites..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assessment Methods</label>
            <textarea
              {...register('assessmentMethods')}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe assessment methods and grading..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Textbooks</label>
            <textarea
              {...register('textbooks')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="List required textbooks..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">References</label>
            <textarea
              {...register('references')}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="List additional references..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/lecturer')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Syllabus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}