/* eslint-disable react/button-has-type, jsx-a11y/label-has-associated-control, no-alert, no-nested-ternary, no-void, react/no-array-index-key, import/no-duplicates */
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

import { API_BASE_URL as API_URL } from '../../lib/config';

interface InvestmentProject {
  id: number;
  project_name: string;
  description: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  created_at: string;
}

export default function AdminInvestment() {
  const { adminToken } = useAuthStore();
  const [list, setList] = useState<InvestmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Đang triển khai');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/investment`);
      setList(res.data);
    } catch (error) {
      console.error('Error fetching investment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: InvestmentProject) => {
    if (item) {
      setEditingId(item.id);
      setProjectName(item.project_name);
      setDescription(item.description);
      setStatus(item.status);
      setStartDate(item.start_date ? item.start_date.split('T')[0] : '');
      setEndDate(item.end_date ? item.end_date.split('T')[0] : '');
      setBudget(item.budget ? item.budget.toString() : '');
    } else {
      setEditingId(null);
      setProjectName('');
      setDescription('');
      setStatus('Đang triển khai');
      setStartDate('');
      setEndDate('');
      setBudget('');
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
        project_name: projectName,
        description,
        status,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        budget: budget ? parseFloat(budget) : null
      };
      
      if (editingId) {
        await axios.patch(`${API_URL}/investment/${editingId}`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        await axios.post(`${API_URL}/investment`, data, {
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
        await axios.delete(`${API_URL}/investment/${id}`, {
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
          <h2 className="text-lg font-semibold text-gray-800">Dự án Đầu tư</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh mục các dự án đang triển khai</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Thêm Dự Án
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Tên Dự án</th>
              <th className="p-4 border-b">Tiến độ</th>
              <th className="p-4 border-b">Vốn (Tỷ VNĐ)</th>
              <th className="p-4 border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Chưa có dữ liệu</td>
              </tr>
            ) : list.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 align-top">
                  <div className="font-medium text-gray-900">{item.project_name}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : ''} 
                    {item.end_date ? ` - ${new Date(item.end_date).toLocaleDateString('vi-VN')}` : ''}
                  </div>
                </td>
                <td className="p-4 align-top">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    item.status.includes('Hoàn thành') ? 'bg-green-100 text-green-800' :
                    item.status.includes('Tạm dừng') ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 align-top text-sm font-semibold text-gray-700">
                  {item.budget ? item.budget.toLocaleString() : 'N/A'}
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
              <h3 className="text-lg font-bold">{editingId ? 'Sửa Dự Án' : 'Thêm Dự Án'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Dự án</label>
                <input 
                  type="text" required value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả tóm tắt</label>
                <textarea 
                  required rows={4} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select 
                    value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Đang triển khai</option>
                    <option>Chuẩn bị đầu tư</option>
                    <option>Hoàn thành</option>
                    <option>Tạm dừng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tổng vốn (Tỷ VNĐ)</label>
                  <input 
                    type="number" step="0.1" value={budget} onChange={e => setBudget(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input 
                    type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày dự kiến hoàn thành</label>
                  <input 
                    type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
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
