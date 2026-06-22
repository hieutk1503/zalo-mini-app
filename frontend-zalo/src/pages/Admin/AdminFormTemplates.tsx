import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Procedure {
  id: number;
  title: string;
}

interface FormTemplate {
  id: number;
  name: string;
  file_url: string;
  procedure_id: number | null;
  created_at: string;
  procedure?: Procedure;
}

export default function AdminFormTemplates() {
  const { adminToken } = useAuthStore();
  const [list, setList] = useState<FormTemplate[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [procedureId, setProcedureId] = useState<string>('');

  const fetchData = async () => {
    try {
      const [resTemplates, resProcedures] = await Promise.all([
        axios.get(`${API_URL}/form-template`),
        axios.get(`${API_URL}/procedures`)
      ]);
      setList(resTemplates.data);
      setProcedures(resProcedures.data);
    } catch (error) {
      console.error('Error fetching form templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: FormTemplate) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setFileUrl(item.file_url);
      setProcedureId(item.procedure_id ? item.procedure_id.toString() : '');
    } else {
      setEditingId(null);
      setName('');
      setFileUrl('');
      setProcedureId('');
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
        name,
        file_url: fileUrl,
        procedure_id: procedureId ? parseInt(procedureId) : null
      };
      
      if (editingId) {
        await axios.patch(`${API_URL}/form-template/${editingId}`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        await axios.post(`${API_URL}/form-template`, data, {
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
        await axios.delete(`${API_URL}/form-template/${id}`, {
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
          <h2 className="text-lg font-semibold text-gray-800">Kho Mẫu Đơn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các file biểu mẫu (Word/PDF) cho người dân tải về</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Thêm Mẫu Đơn
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Tên mẫu đơn</th>
              <th className="p-4 border-b">Thuộc thủ tục</th>
              <th className="p-4 border-b">File đính kèm</th>
              <th className="p-4 border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Chưa có dữ liệu</td>
              </tr>
            ) : list.map(item => {
              const proc = procedures.find(p => p.id === item.procedure_id);
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="p-4 align-top text-sm text-gray-600">
                    {proc ? proc.title : <span className="text-gray-400">Không gắn thủ tục</span>}
                  </td>
                  <td className="p-4 align-top">
                    <a href={item.file_url} target="_blank" className="text-blue-600 text-sm hover:underline">Tải File</a>
                  </td>
                  <td className="p-4 align-top text-right space-x-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? 'Sửa Mẫu Đơn' : 'Thêm Mẫu Đơn'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên mẫu đơn</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link File (Word/PDF)</label>
                <input 
                  type="url" required value={fileUrl} onChange={e => setFileUrl(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gắn với Thủ tục hành chính</label>
                <select 
                  value={procedureId} onChange={e => setProcedureId(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">-- Không gắn thủ tục (Dùng chung) --</option>
                  {procedures.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
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
