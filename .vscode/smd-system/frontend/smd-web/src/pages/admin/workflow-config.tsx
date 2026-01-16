import { useState, useEffect } from 'react';

interface WorkflowState {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export default function WorkflowConfig() {
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([
    { id: 1, name: 'Nháp', description: 'Trạng thái nháp ban đầu', order: 1, isActive: true },
    { id: 2, name: 'Đã gửi', description: 'Đã gửi để xem xét', order: 2, isActive: true },
    { id: 3, name: 'Đang xem xét', description: 'Đang được xem xét bởi Trưởng khoa', order: 3, isActive: true },
    { id: 4, name: 'Xem xét của Phòng Đào tạo', description: 'Được xem xét bởi Phòng Đào tạo', order: 4, isActive: true },
    { id: 5, name: 'Phê duyệt của Hiệu trưởng', description: 'Phê duyệt cuối cùng bởi Hiệu trưởng', order: 5, isActive: true },
    { id: 6, name: 'Đã xuất bản', description: 'Đã xuất bản và hoạt động', order: 6, isActive: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleState = (id: number) => {
    setWorkflowStates(states =>
      states.map(state =>
        state.id === id ? { ...state, isActive: !state.isActive } : state
      )
    );
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Here you would call your API to save the workflow configuration
      console.log('Saving workflow configuration:', workflowStates);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu cấu hình quy trình');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Cấu hình Quy trình</h1>
          <p className="text-slate-500 font-medium mt-1">Cấu hình các trạng thái quy trình phê duyệt giáo trình</p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '💾' : '💾'} {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="underline uppercase text-xs tracking-widest">Bỏ Qua</button>
        </div>
      )}

      {/* Success Alert */}
      {!error && !loading && (
        <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 font-bold">
          ✅ Cấu hình quy trình đã được tải thành công
        </div>
      )}

      {/* Workflow States */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-50">
        <h3 className="text-2xl font-bold text-slate-800 mb-8">Trạng Thái Quy Trình</h3>

        <div className="space-y-6">
          {workflowStates.map((state, index) => (
            <div key={state.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-indigo-50 transition">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-bold text-slate-600">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{state.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">{state.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  state.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {state.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>

                <button
                  onClick={() => handleToggleState(state.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    state.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      state.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Visualization */}
        <div className="mt-12">
          <h4 className="text-xl font-bold text-slate-800 mb-6">Luồng Quy Trình</h4>
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {workflowStates.filter(state => state.isActive).map((state, index) => (
              <div key={state.id} className="flex items-center">
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-center min-w-[120px]">
                  {state.name}
                </div>
                {index < workflowStates.filter(s => s.isActive).length - 1 && (
                  <div className="mx-4 text-2xl text-slate-400">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Yêu Cầu Phê Duyệt</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">Yêu cầu phê duyệt của Trưởng khoa</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">Yêu cầu phê duyệt của Phòng Đào tạo</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">Yêu cầu phê duyệt của Hiệu trưởng</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Cài Đặt Thông Báo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">Thông báo qua email</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">Thông báo trong ứng dụng</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">Tích hợp Slack</span>
              <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
