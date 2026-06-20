import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface WorkSchedule {
  id: number;
  title: string;
  event_date: string;
  time: string | null;
  location: string | null;
  attendees: string | null;
  created_at: string;
}

export default function AdminWorkSchedule() {
  const { adminToken } = useAuthStore();
  const [list, setList] = useState<WorkSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/work-schedule`);
      setList(res.data);
    } catch (error) {
      console.error('Error fetching work schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: WorkSchedule) => {
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setEventDate(item.event_date.split('T')[0]);
      setTime(item.time || '');
      setLocation(item.location || '');
      setAttendees(item.attendees || '');
    } else {
      setEditingId(null);
      setTitle('');
      setEventDate('');
      setTime('');
      setLocation('');
      setAttendees('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title,
        event_date: new Date(eventDate).toISOString(),
        time,
        location,
        attendees
      };
      
      if (editingId) {
        await axios.patch(`${API_URL}/work-schedule/${editingId}`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        await axios.post(`${API_URL}/work-schedule`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await axios.delete(`${API_URL}/work-schedule/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra!');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Lịch Công Tác</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý lịch làm việc của Lãnh đạo phường</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Thêm Lịch Trình
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Thời gian</th>
              <th className="p-4 border-b">Nội dung công việc</th>
              <th className="p-4 border-b">Địa điểm</th>
              <th className="p-4 border-b">Thành phần</th>
              <th className="p-4 border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có dữ liệu</td>
              </tr>
            ) : list.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 align-top w-40">
                  <div className="font-semibold text-gray-800">{new Date(item.event_date).toLocaleDateString('vi-VN')}</div>
                  <div className="text-sm text-gray-500">{item.time}</div>
                </td>
                <td className="p-4 align-top">
                  <div className="font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="p-4 align-top text-sm text-gray-600">{item.location}</td>
                <td className="p-4 align-top text-sm text-gray-600">{item.attendees}</td>
                <td className="p-4 align-top text-right space-x-2">
                  <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? 'Sửa Lịch Trình' : 'Thêm Lịch Trình'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung công việc</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày diễn ra</label>
                  <input 
                    type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (Giờ)</label>
                  <input 
                    type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="VD: 08:00 - 10:00"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                <input 
                  type="text" value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phần tham dự</label>
                <input 
                  type="text" value={attendees} onChange={e => setAttendees(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
