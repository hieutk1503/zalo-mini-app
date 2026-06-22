import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Citizen {
  full_name: string;
  phone: string;
}

interface Feedback {
  id: number;
  content: string;
  image_urls?: string;
  location?: string;
  status: string;
  admin_reply?: string;
  created_at: string;
  citizen: Citizen;
}

const AdminFeedbacks = () => {
  const { adminToken } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/feedbacks`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setFeedbacks(res.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [adminToken]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`${API_URL}/admin/feedbacks/${id}`, {
        status,
        admin_reply: replyText || undefined
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSelectedId(null);
      setReplyText('');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Danh sách Phản ánh</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý và phản hồi kiến nghị của người dân</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Người dân</th>
              <th className="p-4 border-b">Nội dung</th>
              <th className="p-4 border-b">Trạng thái</th>
              <th className="p-4 border-b">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedbacks.map(fb => (
              <tr key={fb.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 align-top">
                  <div className="font-medium text-gray-900">{fb.citizen.full_name}</div>
                  <div className="text-sm text-gray-500">{fb.citizen.phone}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(fb.created_at).toLocaleString('vi-VN')}</div>
                </td>
                <td className="p-4 align-top max-w-md">
                  <p className="text-sm text-gray-800">{fb.content}</p>
                  {fb.location && (
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                      📍 {fb.location}
                    </div>
                  )}
                  {fb.image_urls && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {fb.image_urls.split(',').map((url, idx) => (
                        <img key={idx} src={url.startsWith('http') ? url : `${API_URL}${url}`} alt="Feedback" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                      ))}
                    </div>
                  )}
                  {fb.admin_reply && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200 border-l-4 border-l-blue-500">
                      <strong>Cán bộ trả lời:</strong> {fb.admin_reply}
                    </div>
                  )}
                </td>
                <td className="p-4 align-top">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                    fb.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    fb.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    fb.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {fb.status === 'PENDING' ? 'Chờ xử lý' :
                     fb.status === 'IN_PROGRESS' ? 'Đang xử lý' :
                     fb.status === 'RESOLVED' ? 'Đã giải quyết' : 'Từ chối'}
                  </span>
                </td>
                <td className="p-4 align-top">
                  {selectedId === fb.id ? (
                    <div className="space-y-2 min-w-[200px]">
                      <textarea
                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={2}
                        placeholder="Nhập nội dung phản hồi..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(fb.id, 'RESOLVED')}
                          className="flex-1 bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(fb.id, 'REJECTED')}
                          className="flex-1 bg-red-600 text-white text-xs py-1.5 rounded hover:bg-red-700"
                        >
                          Từ chối
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="w-full text-gray-500 text-xs hover:text-gray-700 mt-1"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedId(fb.id);
                        setReplyText(fb.admin_reply || '');
                      }}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800"
                    >
                      Phản hồi & Cập nhật
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Không có phản ánh nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedbacks;
