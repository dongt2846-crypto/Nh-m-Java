import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userAPI } from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  department: string;
  roles: Array<{ name: string; description: string }>;
  active: boolean;
  createdAt: string;
}

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError(null);
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    // Cập nhật giao diện ngay lập tức (Optimistic Update)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !currentStatus } : u));

    try {
      await userAPI.update(userId, { active: !currentStatus });
    } catch (err: any) {
      // Hoàn tác nếu lỗi
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: currentStatus } : u));
      alert('Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || user.roles.some(role => role.name === selectedRole);
    return matchesSearch && matchesRole;
  });

  if (loading) return (
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
      <div className="max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Đang hoạt động</p>
            <p className="text-3xl font-black text-emerald-500 mt-1">{users.filter(u => u.active).length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Tổng người dùng</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Vai trò chính</p>
            <p className="text-3xl font-black text-indigo-500 mt-1">Giảng viên</p>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Tìm kiếm chi tiết</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên, Email hoặc Mã nhân viên..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-5 py-4 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Lọc vai trò</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-600 appearance-none cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              <option value="SYSTEM_ADMIN">Quản trị viên</option>
              <option value="LECTURER">Giảng viên</option>
              <option value="HOD">Trưởng bộ môn</option>
              <option value="STUDENT">Sinh viên</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={() => { setSearchTerm(''); setSelectedRole(''); }}
              className="w-full py-4 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Thông tin người dùng</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Đơn vị</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Vai trò</th>
                <th className="px-6 py-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Avatar with Gradient */}
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-base">{user.fullName}</div>
                        <div className="text-xs text-slate-400 font-bold mt-0.5 group-hover:text-indigo-400 transition-colors">
                          @{user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-black text-slate-500 uppercase tracking-tighter">
                      {user.department || 'Chưa xác định'}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.map((role, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {role.name.replace('ROLE_', '').replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(user.id, user.active)}
                        disabled={updatingUserId === user.id}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all shadow-sm ${
                          user.active ? 'bg-emerald-500' : 'bg-slate-300'
                        } ${updatingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                          user.active ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                      <span className={`text-[10px] font-black uppercase ${user.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {user.active ? 'Đang bật' : 'Đã khóa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                        className="p-3 bg-white text-indigo-600 rounded-xl border border-slate-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        className="p-3 bg-white text-rose-500 rounded-xl border border-slate-100 shadow-sm hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                        title="Xóa người dùng"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🔍
            </div>
            <h3 className="text-xl font-black text-slate-800">Không tìm thấy kết quả</h3>
            <p className="text-slate-400 font-medium mt-2 px-6">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}