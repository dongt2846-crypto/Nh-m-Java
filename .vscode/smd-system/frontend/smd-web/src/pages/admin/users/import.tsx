import { useState } from 'react';
import { useRouter } from 'next/router';
import { userAPI } from '../../../services/api';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function ImportUsers() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setImportResult(null);

      // Preview CSV data
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(h => h.trim());
          const data = lines.slice(1, 6).map(line => {
            const values = line.split(',');
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index]?.trim() || '';
            });
            return obj;
          });
          setPreviewData(data);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file để nhập');
      return;
    }

    setLoading(true);
    setError(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await userAPI.importUsers(formData);
      setImportResult(response.data);
    } catch (err: any) {
      setError(err?.message || 'Không thể nhập dữ liệu từ file');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `username,email,fullName,department,password,roles
nguyen.van.a,nguyen@university.edu.vn,Nguyễn Văn A,Công nghệ thông tin,password123,SYSTEM_ADMIN
tran.thi.b,tran@university.edu.vn,Trần Thị B,Kinh tế,password123,LECTURER
le.van.c,le@university.edu.vn,Lê Văn C,Toán học,password123,STUDENT`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nhập Người Dùng Từ File</h1>
            <p className="text-slate-500 font-medium mt-2">Tải lên file CSV để nhập nhiều người dùng cùng lúc</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Instructions Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-8">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Hướng dẫn nhập dữ liệu</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4">📋 Định dạng file CSV</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• <strong>username:</strong> Tên đăng nhập (bắt buộc)</li>
                <li>• <strong>email:</strong> Địa chỉ email (bắt buộc)</li>
                <li>• <strong>fullName:</strong> Họ và tên đầy đủ (bắt buộc)</li>
                <li>• <strong>department:</strong> Đơn vị công tác</li>
                <li>• <strong>password:</strong> Mật khẩu (bắt buộc)</li>
                <li>• <strong>roles:</strong> Vai trò (SYSTEM_ADMIN, LECTURER, HOD, STUDENT)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4">⚠️ Lưu ý quan trọng</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• File phải có tiêu đề ở dòng đầu tiên</li>
                <li>• Mỗi vai trò cách nhau bằng dấu phẩy</li>
                <li>• Username và email phải là duy nhất</li>
                <li>• Mật khẩu sẽ được mã hóa tự động</li>
                <li>• Các hàng có lỗi sẽ được bỏ qua</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={downloadTemplate}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              <span>📥</span> Tải file mẫu
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-8">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Chọn file để nhập</h2>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex justify-between items-center">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="underline uppercase text-xs tracking-widest">Ẩn</button>
            </div>
          )}

          {/* File Upload Area */}
          <div className="mb-6">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">📁</div>
                <div className="text-lg font-bold text-slate-700 mb-2">
                  {selectedFile ? selectedFile.name : 'Nhấp để chọn file CSV'}
                </div>
                <div className="text-sm text-slate-500">
                  hoặc kéo thả file vào đây
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Xem trước dữ liệu (5 hàng đầu)</h3>
              <div className="bg-slate-50 rounded-2xl p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {Object.keys(previewData[0]).map(header => (
                        <th key={header} className="text-left py-2 px-3 font-bold text-slate-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="py-2 px-3 text-slate-700">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Kết quả nhập dữ liệu</h3>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-600">{importResult.success}</div>
                    <div className="text-sm text-green-700 font-bold">Thành công</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-red-600">{importResult.failed}</div>
                    <div className="text-sm text-red-700 font-bold">Thất bại</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-600">{importResult.success + importResult.failed}</div>
                    <div className="text-sm text-slate-700 font-bold">Tổng số</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold text-red-700 mb-2">Chi tiết lỗi:</h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedFile || loading}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {loading ? 'Đang nhập...' : 'Bắt đầu nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
