import React, { useState, useEffect } from 'react';
import { syllabusAPI } from '../../services/api';

interface Syllabus {
  id: number;
  title: string;
  subjectCode: string;
  lecturer: string;
  status: string;
  lastModified: string;
  version: number;
}

interface PublishBatch {
  id: number;
  name: string;
  description: string;
  syllabusCount: number;
  createdDate: string;
  status: 'draft' | 'ready' | 'published';
}

export default function Publish() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loadingSyllabi, setLoadingSyllabi] = useState(true);

  // Load approved syllabi on component mount
  useEffect(() => {
    const loadSyllabi = async () => {
      try {
        const response = await syllabusAPI.getAll('approved');
        // Transform API response to match our interface
        const transformedSyllabi = response.data.map((syllabus: any) => ({
          id: syllabus.id,
          title: syllabus.title,
          subjectCode: syllabus.subjectCode,
          lecturer: syllabus.lecturer?.fullName || 'Unknown',
          status: syllabus.status,
          lastModified: syllabus.updatedAt?.split('T')[0] || syllabus.createdAt?.split('T')[0],
          version: syllabus.version || 1,
        }));
        setSyllabi(transformedSyllabi);
      } catch (err) {
        console.error('Failed to load syllabi:', err);
        // Fallback to sample data if API fails
        setSyllabi([
          { id: 1, title: 'Introduction to Computer Science', subjectCode: 'CS101', lecturer: 'Dr. Smith', status: 'approved', lastModified: '2024-01-15', version: 2 },
          { id: 2, title: 'Data Structures and Algorithms', subjectCode: 'CS201', lecturer: 'Prof. Johnson', status: 'approved', lastModified: '2024-01-14', version: 1 },
          { id: 3, title: 'Database Systems', subjectCode: 'CS301', lecturer: 'Dr. Brown', status: 'approved', lastModified: '2024-01-13', version: 3 },
          { id: 4, title: 'Software Engineering', subjectCode: 'CS401', lecturer: 'Prof. Davis', status: 'approved', lastModified: '2024-01-12', version: 1 },
        ]);
      } finally {
        setLoadingSyllabi(false);
      }
    };

    loadSyllabi();
  }, []);

  const [publishBatches, setPublishBatches] = useState<PublishBatch[]>([
    { id: 1, name: 'Spring 2024 Batch', description: 'All approved syllabi for Spring 2024', syllabusCount: 15, createdDate: '2024-01-10', status: 'ready' },
    { id: 2, name: 'Fall 2023 Batch', description: 'Fall semester syllabus updates', syllabusCount: 8, createdDate: '2023-12-15', status: 'published' },
  ]);

  const [selectedSyllabi, setSelectedSyllabi] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchName, setBatchName] = useState('');
  const [batchDescription, setBatchDescription] = useState('');
  const [showCreateBatch, setShowCreateBatch] = useState(false);

  const handleSelectSyllabus = (id: number) => {
    setSelectedSyllabi(prev =>
      prev.includes(id)
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedSyllabi(
      selectedSyllabi.length === syllabi.length
        ? []
        : syllabi.map(s => s.id)
    );
  };

  const handleCreateBatch = async () => {
    if (!batchName.trim()) {
      setError('Tên lô là bắt buộc');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBatch: PublishBatch = {
        id: publishBatches.length + 1,
        name: batchName,
        description: batchDescription,
        syllabusCount: selectedSyllabi.length,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft'
      };

      setPublishBatches(prev => [newBatch, ...prev]);
      setBatchName('');
      setBatchDescription('');
      setShowCreateBatch(false);
      setSelectedSyllabi([]);
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo lô');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishBatch = async (batchId: number) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPublishBatches(prev =>
        prev.map(batch =>
          batch.id === batchId
            ? { ...batch, status: 'published' as const }
            : batch
        )
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to publish batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Xuất bản Giáo trình</h1>
          <p className="text-slate-500 font-medium mt-1">Tạo và quản lý các lô xuất bản giáo trình</p>
        </div>
        <button
          onClick={() => setShowCreateBatch(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
        >
          📦 Tạo Lô
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="underline uppercase text-xs tracking-widest">Bỏ qua</button>
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreateBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Tạo Lô Xuất bản</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên Lô</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ví dụ: Lô Xuân 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={batchDescription}
                  onChange={(e) => setBatchDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả tùy chọn..."
                />
              </div>

              <div className="text-sm text-slate-600">
                Giáo trình đã chọn: {selectedSyllabi.length}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateBatch(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateBatch}
                disabled={loading || selectedSyllabi.length === 0}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tạo...' : 'Tạo Lô'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publication Batches */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Các Lô Xuất bản</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {publishBatches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{batch.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{batch.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  batch.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : batch.status === 'ready'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {batch.status === 'published' ? 'Đã xuất bản' : batch.status === 'ready' ? 'Sẵn sàng' : 'Nháp'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                <span>{batch.syllabusCount} giáo trình</span>
                <span>Tạo: {batch.createdDate}</span>
              </div>

              {batch.status === 'ready' && (
                <button
                  onClick={() => handlePublishBatch(batch.id)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xuất bản...' : '🚀 Xuất bản Lô'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Approved Syllabi for Publishing */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Giáo trình Đã duyệt</h2>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition"
          >
            {selectedSyllabi.length === syllabi.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>
        </div>

        <div className="space-y-4">
          {syllabi.map((syllabus) => (
            <div key={syllabus.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-indigo-50 transition">
              <div className="flex items-center space-x-6">
                <input
                  type="checkbox"
                  checked={selectedSyllabi.includes(syllabus.id)}
                  onChange={() => handleSelectSyllabus(syllabus.id)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />

                <div>
                  <h4 className="text-lg font-bold text-slate-800">{syllabus.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                    <span>📚 {syllabus.subjectCode}</span>
                    <span>👨‍🏫 {syllabus.lecturer}</span>
                    <span>📅 {syllabus.lastModified}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      v{syllabus.version}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  ✅ Đã duyệt
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedSyllabi.length > 0 && (
          <div className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">
                {selectedSyllabi.length} giáo trình đã chọn
              </span>
              <button
                onClick={() => setShowCreateBatch(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition"
              >
                📦 Tạo Lô
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
