import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { userAPI, syllabusAPI } from '../services/api';

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    syllabi: 0,
    pending: 0,
    published: 0
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function getQuickStats() {
      try {
        const [u, s, p, pb] = await Promise.all([
          userAPI.getAll(),
          syllabusAPI.getAll(),
          syllabusAPI.getAll('PENDING_APPROVAL'),
          syllabusAPI.getAll('PUBLISHED')
        ]);
        setStats({
          users: u.data.length,
          syllabi: s.data.length,
          pending: p.data.length,
          published: pb.data.length
        });
      } catch (e) {
        console.error("Lỗi tải thống kê thực tế");
      } finally {
        setLoading(false);
      }
    }
    getQuickStats();
  }, []);

  const menuItems = [
    {
      title: "Người Dùng",
      desc: "Quản lý {n} tài khoản hệ thống",
      count: stats.users,
      path: "/admin/users",
      icon: "👥",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      title: "Đề Cương",
      desc: "{n} tài liệu đã xuất bản",
      count: stats.published,
      path: "/admin/dashboard",
      icon: "📖",
      color: "from-emerald-400 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Cấu Hình",
      desc: "Thiết lập thông số hệ thống",
      path: "/admin/system-config",
      icon: "⚙️",
      color: "from-slate-600 to-slate-800",
      bgColor: "from-slate-50 to-slate-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-10 relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Navigation / Header */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                  Hệ Thống <span className="text-indigo-600">SMD</span>
                </h1>
                <p className="text-slate-500 font-semibold mt-2 text-xl">Chào mừng trở lại, Quản trị viên</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl shadow-slate-200/40 border border-white/60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">AD</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest leading-none">Quyền hạn</p>
                <p className="text-lg font-black text-slate-700">System Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { label: "Người dùng", val: stats.users, icon: "👤", color: "text-blue-600", bgColor: "from-blue-50 to-indigo-50", borderColor: "border-blue-200" },
            { label: "Tổng đề cương", val: stats.syllabi, icon: "📄", color: "text-emerald-600", bgColor: "from-emerald-50 to-teal-50", borderColor: "border-emerald-200" },
            { label: "Đang chờ duyệt", val: stats.pending, icon: "⏳", color: "text-amber-500", bgColor: "from-amber-50 to-orange-50", borderColor: "border-amber-200" },
            { label: "Đã xuất bản", val: stats.published, icon: "✅", color: "text-indigo-600", bgColor: "from-indigo-50 to-purple-50", borderColor: "border-indigo-200" },
          ].map((s, i) => (
            <div
              key={i}
              className={`bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-slate-200/40 border border-white/60 hover:shadow-3xl hover:shadow-indigo-200/40 transition-all duration-500 hover:-translate-y-2 hover:scale-105`}
              style={{animationDelay: `${i * 150}ms`}}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color}`}>{loading ? '...' : s.val}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${s.bgColor} rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200/50 border ${s.borderColor}`}>
                  <span className="text-3xl">{s.icon}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${s.color.replace('text-', 'from-').replace('-600', '-400').replace('-500', '-400')} to-${s.color.replace('text-', '').replace('-600', '-600').replace('-500', '-600')} rounded-full transition-all duration-2000 ease-out shadow-sm`}
                  style={{
                    width: s.label === 'Người dùng' ? '100%' :
                           s.label === 'Tổng đề cương' ? `${(stats.syllabi / Math.max(stats.users, 1)) * 100}%` :
                           s.label === 'Đang chờ duyệt' ? `${(stats.pending / Math.max(stats.syllabi, 1)) * 100}%` :
                           `${(stats.published / Math.max(stats.syllabi, 1)) * 100}%`
                  }}
                ></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-ping"></div>
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-10 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left Column: Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-800">Lối tắt quản trị</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(item.path)}
                  className={`group bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-slate-200/40 border border-white/60 text-left hover:shadow-3xl hover:shadow-indigo-200/40 transition-all duration-500 hover:-translate-y-3 hover:scale-105 relative overflow-hidden`}
                  style={{animationDelay: `${idx * 200}ms`}}
                >
                  <div className={`absolute -right-4 -bottom-4 text-8xl opacity-5 group-hover:scale-110 transition-transform duration-500`}>{item.icon}</div>

                  <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl shadow-indigo-200/50 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-800 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-base font-semibold leading-relaxed group-hover:text-slate-700 transition-colors">
                    {item.desc.replace('{n}', item.count?.toString() || '0')}
                  </p>

                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-ping"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-800">Hoạt động mới</h2>
            </div>

            <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-slate-200/40 border border-white/60 space-y-6">
              {[
                { user: "TS. Nguyễn Văn A", action: "đã nộp đề cương mới", time: "2 phút trước", color: "bg-blue-500", icon: "📝" },
                { user: "Hệ thống", action: "đã cập nhật phiên bản 2.0", time: "1 giờ trước", color: "bg-slate-800", icon: "🔄" },
                { user: "Admin", action: "đã phê duyệt 5 đề cương", time: "3 giờ trước", color: "bg-emerald-500", icon: "✅" },
              ].map((act, i) => (
                <div
                  key={i}
                  className="group flex gap-4 items-start p-4 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-100/50"
                  style={{animationDelay: `${i * 150}ms`}}
                >
                  <div className={`w-12 h-12 ${act.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <span className="text-white text-lg">{act.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700 group-hover:text-slate-800 transition-colors">
                      {act.user} <span className="font-semibold text-slate-500">{act.action}</span>
                    </p>
                    <p className="text-xs font-black uppercase text-slate-400 mt-1 tracking-widest">{act.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-2 group-hover:bg-indigo-400 transition-colors"></div>
                </div>
              ))}

              <button className="group w-full py-4 mt-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-500 font-bold text-sm uppercase tracking-widest hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50/50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Xem tất cả nhật ký</span>
                </div>
              </button>
            </div>
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
