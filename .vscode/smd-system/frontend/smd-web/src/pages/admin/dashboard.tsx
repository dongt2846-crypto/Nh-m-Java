import { useState, useEffect } from 'react';
import { userAPI, syllabusAPI } from '../../services/api';

// GIỮ NGUYÊN INTERFACE CỦA BẠN
interface DashboardStats {
  totalUsers: number;
  totalSyllabi: number;
  pendingApprovals: number;
  publishedSyllabi: number;
}

export default function AdminDashboard() {
  // GIỮ NGUYÊN STATE CỦA BẠN
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSyllabi: 0,
    pendingApprovals: 0,
    publishedSyllabi: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  // GIỮ NGUYÊN LOGIC GOI API CỦA BẠN
  const fetchDashboardData = async () => {
    setError(null);
    try {
      const [usersRes, syllabiRes, pendingRes, publishedRes] = await Promise.all([
        userAPI.getAll(),
        syllabusAPI.getAll(),
        syllabusAPI.getAll('PENDING_APPROVAL'),
        syllabusAPI.getAll('PUBLISHED')
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalSyllabi: syllabiRes.data.length,
        pendingApprovals: pendingRes.data.length,
        publishedSyllabi: publishedRes.data.length
      });
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err?.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Mảng bổ trợ để render giao diện (Không ảnh hưởng logic)
  const cardItems = [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: '👥', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50', textColor: 'text-blue-600' },
    { label: 'Tổng đề cương', value: stats.totalSyllabi, icon: '📚', color: 'from-purple-500 to-fuchsia-600', bgColor: 'from-purple-50 to-fuchsia-50', textColor: 'text-purple-600' },
    { label: 'Chờ phê duyệt', value: stats.pendingApprovals, icon: '⏳', color: 'from-orange-400 to-red-500', bgColor: 'from-orange-50 to-red-50', textColor: 'text-orange-600' },
    { label: 'Đã xuất bản', value: stats.publishedSyllabi, icon: '✅', color: 'from-emerald-400 to-teal-600', bgColor: 'from-emerald-50 to-teal-50', textColor: 'text-emerald-600' },
  ];

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
          <p className="mt-6 text-slate-600 font-bold text-lg tracking-wide">Đang tải dữ liệu...</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                  Quản Trị Hệ Thống
                </h1>
                <p className="text-slate-500 font-semibold mt-2 text-xl">Giám sát người dùng và hoạt động đề cương</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchDashboardData}
              className="group px-6 py-4 bg-white/80 backdrop-blur-xl text-slate-700 rounded-2xl font-bold shadow-xl shadow-slate-200/50 border border-white/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-300 flex items-center gap-3 hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white text-sm">🔄</span>
              </div>
              <span className="font-bold">Làm mới dữ liệu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`max-w-7xl mx-auto mb-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-3xl text-rose-600 font-bold flex justify-between items-center shadow-xl shadow-rose-100/50 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <span className="text-lg">{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats Cards - Enhanced with glassmorphism and animations */}
      <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {cardItems.map((card, index) => (
          <div
            key={index}
            className={`group bg-white/70 backdrop-blur-2xl p-8 rounded-3xl border border-white/50 shadow-2xl shadow-slate-200/30 hover:shadow-3xl hover:shadow-indigo-200/40 transition-all duration-500 hover:-translate-y-3 hover:scale-105`}
            style={{animationDelay: `${index * 150}ms`}}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <p className={`text-xs font-black uppercase tracking-[0.2em] ${card.textColor} opacity-70`}>{card.label}</p>
                <h3 className={`text-4xl font-black ${card.textColor}`}>{card.value}</h3>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200/50 group-hover:shadow-2xl group-hover:shadow-indigo-300/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-2000 ease-out shadow-sm`}
                style={{
                  width: card.label === 'Tổng người dùng' ? '100%' :
                         card.label === 'Tổng đề cương' ? `${(stats.totalSyllabi / Math.max(stats.totalUsers, 1)) * 100}%` :
                         card.label === 'Chờ phê duyệt' ? `${(stats.pendingApprovals / Math.max(stats.totalSyllabi, 1)) * 100}%` :
                         `${(stats.publishedSyllabi / Math.max(stats.totalSyllabi, 1)) * 100}%`
                }}
              ></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-ping"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl shadow-slate-200/40 border border-white/60">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-800">Hoạt động gần đây</h3>
          </div>

          <div className="space-y-6">
            <div className="group flex items-center p-6 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-3xl hover:from-indigo-50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer border border-slate-100/50 hover:border-indigo-200/50 hover:shadow-xl hover:shadow-indigo-100/30">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-lg mr-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-slate-100">
                <span className="text-2xl">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-black text-lg group-hover:text-indigo-800 transition-colors">Đề cương mới</p>
                <p className="text-slate-500 font-semibold mt-1 group-hover:text-indigo-600 transition-colors">Dr. Smith vừa nộp đề cương CS101</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">2 giờ trước</span>
                <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mt-2 shadow-sm"></div>
              </div>
            </div>

            <div className="group flex items-center p-6 bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-3xl hover:from-emerald-50 hover:to-teal-50/50 transition-all duration-300 cursor-pointer border border-slate-100/50 hover:border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-100/30">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-lg mr-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-slate-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-black text-lg group-hover:text-emerald-800 transition-colors">Phê duyệt hoàn tất</p>
                <p className="text-slate-500 font-semibold mt-1 group-hover:text-emerald-600 transition-colors">HoD đã phê duyệt đề cương IT202</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">4 giờ trước</span>
                <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mt-2 shadow-sm"></div>
              </div>
            </div>

            <div className="group flex items-center p-6 bg-gradient-to-r from-slate-50 to-orange-50/50 rounded-3xl hover:from-orange-50 hover:to-red-50/50 transition-all duration-300 cursor-pointer border border-slate-100/50 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/30">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-lg mr-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-slate-100">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-black text-lg group-hover:text-orange-800 transition-colors">Chờ phê duyệt</p>
                <p className="text-slate-500 font-semibold mt-1 group-hover:text-orange-600 transition-colors">Đề cương MATH301 đang chờ HoD duyệt</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">6 giờ trước</span>
                <div className="w-3 h-3 bg-orange-400 rounded-full mx-auto mt-2 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 text-white shadow-2xl shadow-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black">Thao tác nhanh</h3>
            </div>

            <div className="space-y-4">
              <a
                href="/admin/users"
                className="group block w-full p-5 bg-white/10 hover:bg-white/20 rounded-3xl transition-all duration-300 font-bold text-center border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  <span className="font-black">Quản lý người dùng</span>
                </div>
              </a>

              <a
                href="/admin/system-config"
                className="group block w-full p-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-3xl transition-all duration-300 font-bold text-center shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-sm">⚙️</span>
                  </div>
                  <span className="font-black">Cấu hình hệ thống</span>
                </div>
              </a>

              <button className="group w-full p-5 bg-gradient-to-r from-white to-slate-100 text-slate-900 rounded-3xl transition-all duration-300 font-black text-center hover:from-slate-100 hover:to-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 border border-white/20">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <span>XUẤT BÁO CÁO</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-indigo-100/50 shadow-xl shadow-indigo-100/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">🤖</span>
              </div>
              <p className="text-indigo-600 font-black text-sm uppercase tracking-widest">Hỗ trợ AI</p>
            </div>
            <p className="text-indigo-900 font-bold text-base leading-relaxed mb-6">
              Bạn có thể sử dụng AI để tự động tóm tắt các đề cương đang chờ duyệt.
            </p>
            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 hover:from-indigo-600 hover:to-purple-700">
              Khởi động AI
            </button>
          </div>
        </div>
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
