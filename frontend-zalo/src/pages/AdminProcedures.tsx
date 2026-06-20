import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Procedure {
  id: number;
  code: string;
  title: string;
  description: string;
  fee: string;
  duration: string;
  process_steps: string;
  is_active: boolean;
}

export default function AdminProcedures() {
  const { adminToken } = useAuthStore();
  const [list, setList] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [duration, setDuration] = useState('');
  const [processSteps, setProcessSteps] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/procedures`);
      setList(res.data);
    } catch (error) {
      console.error('Error fetching procedures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Procedure) => {
    if (item) {
      setEditingId(item.id);
      setCode(item.code);
      setTitle(item.title);
      setDescription(item.description || '');
      setFee(item.fee || '');
      setDuration(item.duration || '');
      setProcessSteps(item.process_steps || '');
      setIsActive(item.is_active);
    } else {
      setEditingId(null);
      setCode('');
      setTitle('');
      setDescription('');
      setFee('');
      setDuration('');
      setProcessSteps('');
      setIsActive(true);
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
        code,
        title,
        description,
        fee,
        duration,
        process_steps: processSteps,
        is_active: isActive
      };
      
      if (editingId) {
        await axios.patch(`${API_URL}/procedures/${editingId}`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        await axios.post(`${API_URL}/procedures`, data, {
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
        await axios.delete(`${API_URL}/procedures/${id}`, {
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
          <h2 className="text-lg font-semibold text-gray-800">Thủ tục hành chính</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh mục các thủ tục hành chính công</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Thêm Thủ Tục
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Mã TT</th>
              <th className="p-4 border-b">Tên Thủ tục</th>
              <th className="p-4 border-b">Lệ phí</th>
              <th className="p-4 border-b">Thời gian XL</th>
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
                <td className="p-4 align-top font-semibold text-gray-700">
                  {item.code}
                </td>
                <td className="p-4 align-top">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</div>
                  {!item.is_active && <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded">Đã ẩn</span>}
                </td>
                <td className="p-4 align-top text-sm text-gray-600">{item.fee || 'Miễn phí'}</td>
                <td className="p-4 align-top text-sm text-gray-600">{item.duration}</td>
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
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? 'Sửa Thủ Tục' : 'Thêm Thủ Tục'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã thủ tục</label>
                  <input 
                    type="text" required value={code} onChange={e => setCode(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <label className="flex items-center mt-2">
                    <input 
                      type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-600">Hiển thị (Active)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên thủ tục</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả tóm tắt</label>
                <textarea 
                  rows={2} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lệ phí (nếu có)</label>
                  <input 
                    type="text" value={fee} onChange={e => setFee(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian xử lý</label>
                  <input 
                    type="text" value={duration} onChange={e => setDuration(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trình tự thực hiện (Các bước)</label>
                <textarea 
                  rows={5} value={processSteps} onChange={e => setProcessSteps(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                ></textarea>
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
