import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Citizen {
  id: number;
  zalo_id: string;
  full_name: string;
  phone: string | null;
  cccd: string | null;
  avatar_url: string | null;
  created_at: string;
  appointments: any[];
}

export default function AdminCitizens() {
  const { adminToken } = useAuthStore();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/citizens`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setCitizens(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCitizens();
  }, [adminToken]);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Danh sách Người dân</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản công dân đã đăng nhập qua Zalo</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Thông tin chung</th>
              <th className="p-4 border-b">Số điện thoại</th>
              <th className="p-4 border-b">CCCD</th>
              <th className="p-4 border-b">Ngày tham gia</th>
              <th className="p-4 border-b text-center">Số lịch hẹn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {citizens.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có người dân nào</td>
              </tr>
            ) : citizens.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name)}`} alt="avatar" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                    <div>
                      <div className="font-semibold text-gray-900">{c.full_name}</div>
                      <div className="text-xs text-gray-500 font-mono" title={c.zalo_id}>Zalo ID: {c.zalo_id.substring(0, 10)}...</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle text-sm text-gray-700">{c.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}</td>
                <td className="p-4 align-middle text-sm text-gray-700">{c.cccd || <span className="text-gray-400 italic">Chưa cập nhật</span>}</td>
                <td className="p-4 align-middle text-sm text-gray-600">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="p-4 align-middle text-center">
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full text-xs">
                    {c.appointments?.length || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
