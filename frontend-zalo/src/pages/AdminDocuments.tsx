import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DocumentModel {
  id: number;
  document_no: string;
  abstract: string;
  file_url: string;
  type: string;
  created_at: string;
}

export default function AdminDocuments() {
  const { adminToken } = useAuthStore();
  const [list, setList] = useState<DocumentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [documentNo, setDocumentNo] = useState('');
  const [abstract, setAbstract] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [type, setType] = useState('Luật');

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents`);
      setList(res.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: DocumentModel) => {
    if (item) {
      setEditingId(item.id);
      setDocumentNo(item.document_no);
      setAbstract(item.abstract);
      setFileUrl(item.file_url);
      setType(item.type);
    } else {
      setEditingId(null);
      setDocumentNo('');
      setAbstract('');
      setFileUrl('');
      setType('Luật');
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
        document_no: documentNo,
        abstract,
        file_url: fileUrl,
        type
      };
      
      if (editingId) {
        await axios.patch(`${API_URL}/documents/${editingId}`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        await axios.post(`${API_URL}/documents`, data, {
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
        await axios.delete(`${API_URL}/documents/${id}`, {
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
          <h2 className="text-lg font-semibold text-gray-800">Văn bản Pháp luật</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các văn bản, quyết định, nghị định</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Thêm Văn Bản
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Số hiệu</th>
              <th className="p-4 border-b">Loại văn bản</th>
              <th className="p-4 border-b">Trích yếu</th>
              <th className="p-4 border-b">File đính kèm</th>
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
                <td className="p-4 align-top font-semibold text-gray-800">
                  {item.document_no}
                </td>
                <td className="p-4 align-top">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                    {item.type}
                  </span>
                </td>
                <td className="p-4 align-top">
                  <div className="text-sm text-gray-600 line-clamp-3">{item.abstract}</div>
                </td>
                <td className="p-4 align-top">
                  {item.file_url ? (
                    <a href={item.file_url} target="_blank" className="text-blue-600 text-sm hover:underline">Xem File</a>
                  ) : <span className="text-gray-400 text-sm">Không có file</span>}
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
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? 'Sửa Văn Bản' : 'Thêm Văn Bản'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số hiệu văn bản</label>
                  <input 
                    type="text" required value={documentNo} onChange={e => setDocumentNo(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại văn bản</label>
                  <select 
                    value={type} onChange={e => setType(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Luật</option>
                    <option>Nghị định</option>
                    <option>Thông tư</option>
                    <option>Quyết định</option>
                    <option>Chỉ thị</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trích yếu nội dung</label>
                <textarea 
                  required rows={4} value={abstract} onChange={e => setAbstract(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link File đính kèm (URL)</label>
                <input 
                  type="url" required value={fileUrl} onChange={e => setFileUrl(e.target.value)}
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
