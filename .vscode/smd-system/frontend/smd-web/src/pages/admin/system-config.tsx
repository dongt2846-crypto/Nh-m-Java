import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface SystemConfig {
  academicYear: string;
  currentSemester: string;
  allowSyllabusEdit: boolean;
  requireApproval: boolean;
  enableAIFeatures: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  emailNotifications: boolean;
  autoPublish: boolean;
}

export default function SystemConfiguration() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Dữ liệu mẫu ban đầu
  const initialData: SystemConfig = {
    academicYear: '2024-2025',
    currentSemester: 'Fall',
    allowSyllabusEdit: true,
    requireApproval: true,
    enableAIFeatures: true,
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'docx', 'doc'],
    emailNotifications: true,
    autoPublish: false
  };

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<SystemConfig>({
    defaultValues: initialData
  });

  const onSubmit = async (data: SystemConfig) => {
    setLoading(true);
    try {
      console.log('Saving configuration:', data);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập gọi API
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Lỗi khi lưu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  // Helper để render custom Toggle Switch
  const ToggleField = ({ label, name, description }: { label: string, name: keyof SystemConfig, description?: string }) => {
    const value = watch(name) as boolean;
    return (
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
        <div className="flex-1 pr-4">
          <p className="text-sm font-bold text-slate-800">{label}</p>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => setValue(name, !value as any)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Cấu Hình Hệ Thống</h1>
          <p className="text-slate-500 font-medium mt-1">Thiết lập các tham số vận hành và quy trình phê duyệt</p>
        </div>
        
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-600 font-bold text-sm animate-bounce flex items-center gap-1">
              ✅ Đã lưu thành công
            </span>
          )}
          <button
            type="button"
            onClick={() => reset(initialData)}
            className="px-6 py-3 bg-white text-slate-600 rounded-2xl font-bold shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            Hoàn tác
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'LƯU CẤU HÌNH'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Academic & Workflow Card */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-amber-100 rounded-xl text-lg">🎓</span> Học thuật & Quy trình
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Năm học</label>
                  <input
                    {...register('academicYear', { required: true })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 transition font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Học kỳ hiện tại</label>
                  <select
                    {...register('currentSemester')}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 transition font-bold text-slate-700"
                  >
                    <option value="Fall">Học kỳ 1 (Fall)</option>
                    <option value="Spring">Học kỳ 2 (Spring)</option>
                    <option value="Summer">Học kỳ phụ (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <ToggleField 
                  label="Cho phép sửa sau khi nộp" 
                  name="allowSyllabusEdit" 
                  description="Giảng viên có thể chỉnh sửa đề cương khi đang chờ duyệt"
                />
                <ToggleField 
                  label="Bắt buộc phê duyệt" 
                  name="requireApproval" 
                  description="Mọi đề cương mới phải qua quy trình kiểm tra"
                />
                <ToggleField 
                  label="Tự động xuất bản" 
                  name="autoPublish" 
                  description="Công khai ngay sau khi được cấp quản lý duyệt"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-blue-100 rounded-xl text-lg">🔔</span> Thông báo
            </h2>
            <ToggleField 
              label="Thông báo qua Email" 
              name="emailNotifications" 
              description="Gửi email khi có cập nhật trạng thái phê duyệt"
            />
          </div>
        </div>

        {/* AI & File Upload Card */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="p-2 bg-indigo-500/30 rounded-xl text-lg">🤖</span> Trí tuệ nhân tạo (AI)
            </h2>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <ToggleField 
                label="Kích hoạt tính năng AI" 
                name="enableAIFeatures" 
                description="Tóm tắt, phân tích CLO-PLO và kiểm tra trùng lặp"
              />
              <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">✅ Tóm tắt đề cương</div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">✅ Đối soát CLO-PLO</div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">✅ Trích xuất OCR</div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">✅ Phát hiện thay đổi</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-emerald-100 rounded-xl text-lg">📁</span> Tệp tin tải lên
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Dung lượng tối đa (MB)</label>
                <input
                  type="number"
                  {...register('maxFileSize', { min: 1, max: 100 })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-emerald-500 transition font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Định dạng cho phép</label>
                <div className="flex flex-wrap gap-3">
                  {['pdf', 'docx', 'doc', 'txt', 'rtf'].map((type) => (
                    <label key={type} className="relative flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        value={type}
                        {...register('allowedFileTypes')}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase text-slate-400 peer-checked:bg-emerald-500 peer-checked:text-white transition-all group-hover:scale-105">
                        .{type}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}