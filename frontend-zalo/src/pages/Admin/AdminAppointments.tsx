import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Citizen {
  full_name: string;
  phone: string;
}

interface Appointment {
  id: number;
  appointment_date: string;
  time_slot: string;
  content: string;
  status: string;
  created_at: string;
  citizen: Citizen;
}

const AdminAppointments = () => {
  const { adminToken } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/appointments`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [adminToken]);

  const handleUpdateStatus = async (id: number, status: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn chuyển trạng thái thành: ${status}?`)) return;
    
    try {
      await axios.patch(`${API_URL}/admin/appointments/${id}/status`, {
        status
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Danh sách Lịch hẹn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý lịch hẹn làm thủ tục của người dân</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Người dân</th>
              <th className="p-4 border-b">Thời gian hẹn</th>
              <th className="p-4 border-b">Nội dung / Ghi chú</th>
              <th className="p-4 border-b">Trạng thái</th>
              <th className="p-4 border-b">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map(app => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 align-middle">
                  <div className="font-medium text-gray-900">{app.citizen.full_name}</div>
                  <div className="text-sm text-gray-500">{app.citizen.phone}</div>
                </td>
                <td className="p-4 align-middle">
                  <div className="text-sm font-semibold text-blue-700">{app.time_slot}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(app.appointment_date).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="p-4 align-middle max-w-xs text-sm text-gray-700">
                  {app.content || <span className="text-gray-400 italic">Không có</span>}
                </td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status === 'PENDING' ? 'Chờ duyệt' :
                     app.status === 'APPROVED' ? 'Đã duyệt' : 'Đã hủy'}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                        className="text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Không có lịch hẹn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;
