import { useState } from 'react';
import axiosAdmin from '../../lib/axiosAdmin';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, RefreshCw } from 'lucide-react';

type ImportPreview = {
  newCount: number;
  conflictCount: number;
  conflicts: { 'Mã thủ tục': string; 'Tên thủ tục': string }[];
};

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosAdmin.post('/procedures/import/preview', formData);
      setPreview(res.data);
      setSuccess(false);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi đọc file.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('overwrite', overwrite.toString());
      const res = await axiosAdmin.post('/procedures/import/execute', formData);
      alert(`Thành công! Đã nhập ${res.data.successCount} thủ tục.`);
      setPreview(null);
      setFile(null);
      setSuccess(true);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAI = async () => {
    if (!window.confirm('Quá trình đồng bộ dữ liệu sang AI có thể mất vài phút tùy vào số lượng thủ tục. Bạn có muốn bắt đầu?')) return;
    setLoading(true);
    try {
      await axiosAdmin.post('/ai-sync/trigger-all');
      alert('Đồng bộ dữ liệu AI thành công! Trợ lý ảo đã học được các thủ tục mới.');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi đồng bộ AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'Mã thủ tục,Tên thủ tục,Mô tả,Lệ phí,Thời gian,Các bước\n' +
      'TTHC-001,Đăng ký khai sinh,Thủ tục đăng ký khai sinh cho trẻ mới sinh,Miễn phí,1 ngày làm việc,Bước 1: Nộp hồ sơ...\n';
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Template_ThuTuc.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6" />
              Công cụ quản trị - Nhập liệu thủ tục
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Upload file Excel (.xlsx, .csv) để thêm hàng loạt thủ tục hành chính.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSyncAI}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-2 rounded-lg text-sm transition-colors shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Đồng bộ AI
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded-lg text-sm transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              File mẫu
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {!preview && !success && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer relative">
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700">
                {file ? file.name : 'Kéo thả hoặc click để chọn file'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Hỗ trợ file Excel hoặc CSV</p>

              {file && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    void handlePreview();
                  }}
                  disabled={loading}
                  className="mt-6 bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 relative z-10"
                >
                  {loading ? 'Đang phân tích...' : 'Xem trước dữ liệu'}
                </button>
              )}
            </div>
          )}

          {success && (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Nhập dữ liệu thành công!</h2>
              <p className="text-gray-600 mt-2">Dữ liệu thủ tục đã được cập nhật vào hệ thống.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Nhập file khác
              </button>
            </div>
          )}

          {preview && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6 bg-blue-50 text-blue-800 p-4 rounded-lg">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>
                  Đã phân tích file thành công. Phát hiện <strong>{preview.newCount}</strong> thủ tục mới và{' '}
                  <strong>{preview.conflictCount}</strong> thủ tục đã tồn tại.
                </p>
              </div>

              {preview.conflictCount > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Danh sách thủ tục trùng lặp:</h3>
                  <div className="bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-2">Mã thủ tục</th>
                          <th className="px-4 py-2">Tên thủ tục trong file</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.conflicts.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b bg-yellow-50/30">
                            <td className="px-4 py-2 font-medium text-yellow-700">{row['Mã thủ tục']}</td>
                            <td className="px-4 py-2 text-gray-600">{row['Tên thủ tục']}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {preview.conflictCount > 10 && (
                      <div className="p-2 text-center text-gray-500 text-xs bg-gray-50">
                        ... và {preview.conflictCount - 10} dòng khác.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Tùy chọn ghi đè</h3>
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    checked={overwrite}
                    onChange={e => setOverwrite(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Cập nhật dữ liệu thủ tục bị trùng mã bằng nội dung từ file. Nếu không chọn, các dòng trùng sẽ bị bỏ qua.
                  </span>
                </label>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                    }}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => void handleExecute()}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                    {loading ? 'Đang lưu...' : 'Xác nhận nhập dữ liệu'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

