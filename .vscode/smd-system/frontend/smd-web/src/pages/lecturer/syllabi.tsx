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
  department: string;
}

export default function MySyllabi() {
  const router = useRouter();
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const filteredSyllabi = syllabi.filter(syllabus => {
    const matchesSearch = syllabus.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         syllabus.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || syllabus.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return { bg: 'bg-gradient-to-r from-slate-100 to-slate-200', text: 'text-slate-700', border: 'border-slate-200' };
      case 'PENDING_REVIEW': return { bg: 'bg-gradient-to-r from-yellow-100 to-orange-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'PENDING_APPROVAL': return { bg: 'bg-gradient-to-r from-blue-100 to-indigo-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'APPROVED': return { bg: 'bg-gradient-to-r from-emerald-100 to-green-100', text: 'text-emerald-800', border: 'border-emerald-200' };
      case 'PUBLISHED': return { bg: 'bg-gradient-to-r from-emerald-100 to-teal-100', text: 'text-emerald-800', border: 'border-emerald-200' };
      case 'REJECTED': return { bg: 'bg-gradient-to-r from-red-100 to-rose-100', text: 'text-red-800', border: 'border-red-200' };
      default: return { bg: 'bg-gradient-to-r from-slate-100 to-slate-200', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return '📝';
      case 'PENDING_REVIEW': return '⏳';
      case 'PENDING_APPROVAL': return '🔄';
      case 'APPROVED': return '✅';
      case 'PUBLISHED': return '🌟';
      case 'REJECTED': return '❌';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-ping"></div>
        </div>

        <div className={`flex flex-col items-center relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent shadow-lg"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-400 border-t-transparent animate-spin-slow opacity-50"></div>
          </div>
          <p className="mt-6 text-slate-600 font-bold text-lg tracking-wide">Đang tải đề cương...</p>
          <div className="mt-4 flex space-x-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 border-2 border-indigo-300/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border-2 border-purple-300/30 rounded-lg rotate-45 animate-float-reverse"></div>
        <div className="absolute top-40 right-1/4 w-3 h-3 border-2 border-pink-300/30 rounded-full animate-bounce-slow"></div>
      </div>

      {/* Header Section */}
      <div className={`max-w-7xl mx-auto mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                  Đề Cương Của Tôi
                </h1>
                <p className="text-slate-500 font-semibold mt-2 text-xl">Quản lý và theo dõi các đề cương môn học</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/lecturer/create')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200/50 hover:shadow-indigo-300/60 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 hover:-translate-y-1 hover:scale-105"
            >
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-lg">➕</span>
              </div>
              <span>TẠO ĐỀ CƯƠNG MỚI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div className={`max-w-7xl mx-auto bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-slate-200/40 border border-white/60 mb-10 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Tìm kiếm chi tiết</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo mã môn hoặc tên môn học..."
                className="w-full bg-white/80 border-2 border-slate-200 rounded-2xl px-12 py-4 text-slate-700 placeholder-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Lọc trạng thái</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white/80 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-600 font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 appearance-none cursor-pointer shadow-sm hover:shadow-md"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">📝 Nháp</option>
              <option value="PENDING_REVIEW">⏳ Chờ xem xét</option>
              <option value="PENDING_APPROVAL">🔄 Chờ phê duyệt</option>
              <option value="APPROVED">✅ Đã phê duyệt</option>
              <option value="PUBLISHED">🌟 Đã xuất bản</option>
              <option value="REJECTED">❌ Đã từ chối</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={() => { setSearchTerm(''); setSelectedStatus(''); }}
              className="w-full py-4 text-slate-500 font-black text-sm uppercase tracking-widest hover:text-rose-500 transition-all duration-300 relative group"
            >
              <span className="relative z-10">Làm mới</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Syllabi Grid */}
      <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {filteredSyllabi.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSyllabi.map((syllabus, index) => {
              const statusStyle = getStatusColor(syllabus.status);
              return (
                <div
                  key={syllabus.id}
                  className="group bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/40 border border-white/60 overflow-hidden hover:shadow-3xl hover:shadow-indigo-200/40 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Header with status */}
                  <div className="relative p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">{syllabus.courseCode.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="text-sm font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-xl uppercase tracking-wider">
                            {syllabus.courseCode}
                          </span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} shadow-sm`}>
                        <span className="text-lg">{getStatusIcon(syllabus.status)}</span>
                        <span className="text-xs font-black uppercase tracking-wider">
                          {syllabus.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-indigo-800 transition-colors leading-tight">
                      {syllabus.courseName}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{syllabus.department || 'Chưa xác định'}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-3 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Ngày tạo</p>
                          <p className="font-semibold text-slate-700">{new Date(syllabus.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cập nhật</p>
                          <p className="font-semibold text-slate-700">{new Date(syllabus.updatedAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-t border-slate-100/50">
                    <div className="flex justify-between items-center gap-3">
                      <button
                        onClick={() => router.push(`/lecturer/edit/${syllabus.id}`)}
                        className="group/btn flex-1 flex items-center justify-center gap-2 p-3 bg-white text-indigo-600 rounded-2xl border border-slate-200 shadow-lg hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-200/50 transition-all transform hover:scale-105 active:scale-95 font-bold"
                      >
                        <svg className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="font-bold">Chỉnh sửa</span>
                      </button>

                      <button
                        onClick={() => router.push(`/syllabus/${syllabus.id}`)}
                        className="group/btn flex-1 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl shadow-lg hover:shadow-xl hover:shadow-slate-200/50 transition-all transform hover:scale-105 active:scale-95 font-bold"
                      >
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-bold">Xem chi tiết</span>
                      </button>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-ping"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-16 text-center shadow-2xl shadow-slate-200/40 border border-white/60">
            <div className="relative mx-auto mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center shadow-xl">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-bounce opacity-60"></div>
            </div>
            <h3 className="text-3xl font-black text-slate-700 mb-4">Không tìm thấy đề cương</h3>
            <p className="text-slate-500 font-semibold text-lg mb-8 px-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái của bạn.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedStatus(''); }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Làm mới bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-25px) rotate(45deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 12s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
