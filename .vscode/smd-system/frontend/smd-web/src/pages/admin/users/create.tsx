import { useState } from 'react';
import { useRouter } from 'next/router';
import { userAPI } from '../../../services/api';

interface Role {
  name: string;
  description: string;
}

export default function CreateUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    department: '',
    password: '',
    confirmPassword: '',
    roles: [] as string[]
  });

  const availableRoles: Role[] = [
    { name: 'SYSTEM_ADMIN', description: 'Quản trị viên hệ thống' },
    { name: 'LECTURER', description: 'Giảng viên' },
    { name: 'HOD', description: 'Trưởng bộ môn' },
    { name: 'STUDENT', description: 'Sinh viên' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleToggle = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(r => r !== roleName)
        : [...prev.roles, roleName]
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Tên đăng nhập là bắt buộc';
    if (!formData.email.trim()) return 'Email là bắt buộc';
    if (!formData.fullName.trim()) return 'Họ tên là bắt buộc';
    if (!formData.password) return 'Mật khẩu là bắt buộc';
    if (formData.password !== formData.confirmPassword) return 'Mật khẩu xác nhận không khớp';
    if (formData.roles.length === 0) return 'Phải chọn ít nhất một vai trò';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        department: formData.department,
        password: formData.password,
        roles: formData.roles
      };

      await userAPI.create(userData);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo người dùng mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Thêm Người Dùng Mới</h1>
            <p className="text-slate-500 font-medium mt-2">Tạo tài khoản mới cho hệ thống</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-8 md:p-12">
          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex justify-between items-center">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="underline uppercase text-xs tracking-widest">Ẩn</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Tên đăng nhập *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="vd: nguyen.van.a"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="vd: nguyen@university.edu.vn"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Họ và tên *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="vd: Nguyễn Văn A"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Đơn vị</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
              >
                <option value="">Chọn đơn vị</option>
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                <option value="Kỹ thuật điện">Kỹ thuật điện</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
                <option value="Toán học">Toán học</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Mật khẩu *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          </div>

          {/* Roles */}
          <div className="mt-8">
            <label className="block text-sm font-bold text-slate-700 mb-4">Vai trò *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRoles.map((role) => (
                <div
                  key={role.name}
                  onClick={() => handleRoleToggle(role.name)}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    formData.roles.includes(role.name)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.roles.includes(role.name)
                        ? 'bg-indigo-500 border-indigo-500'
                        : 'border-slate-300'
                    }`}>
                      {formData.roles.includes(role.name) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{role.name.replace('_', ' ')}</div>
                      <div className="text-sm text-slate-500">{role.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {loading ? 'Đang tạo...' : 'Tạo người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
