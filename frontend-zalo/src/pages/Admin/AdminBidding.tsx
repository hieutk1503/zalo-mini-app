/* eslint-disable react/button-has-type, jsx-a11y/label-has-associated-control, no-alert, no-nested-ternary, no-void, react/no-array-index-key, import/no-duplicates */
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

import { API_BASE_URL as API_URL } from '../../lib/config';

interface Bidding {
  id: number;
  package_name: string;
  price: number | null;
  start_date: string | null;
  end_date: string | null;
  requirements_file: string | null;
  created_at: string;
}

export default function AdminBidding() {
  const { adminToken } = useAuthStore();
  const [list, setList] = useState<Bidding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requirementsFile, setRequirementsFile] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/bidding`);
      setList(res.data);
    } catch (error) {
      console.error('Error fetching bidding:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Bidding) => {
    if (item) {
      setEditingId(item.id);
      setPackageName(item.package_name);
      setPrice(item.price ? item.price.toString() : '');
      setStartDate(item.start_date ? item.start_date.split('T')[0] : '');
      setEndDate(item.end_date ? item.end_date.split('T')[0] : '');
      setRequirementsFile(item.requirements_file || '');
    } else {
      setEditingId(null);
      setPackageName('');
      setPrice('');
      setStartDate('');
      setEndDate('');
      setRequirementsFile('');
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
        package_name: packageName,
        price: price ? parseFloat(price) : null,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        requirements_file: requirementsFile
      };
      
      if (editingId) {
        await axios.patch(`${API_URL}/bidding/${editingId}`, data, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        await axios.post(`${API_URL}/bidding`, data, {
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
        await axios.delete(`${API_URL}/bidding/${id}`, {
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
          <h2 className="text-lg font-semibold text-gray-800">Quản lý Đấu thầu</h2>
          <p className="text-sm text-gray-500 mt-1">Các gói thầu, mời thầu của dự án</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Thêm Gói Thầu
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b">Tên Gói thầu</th>
              <th className="p-4 border-b">Giá trị (VNĐ)</th>
              <th className="p-4 border-b">Thời gian nhận hồ sơ</th>
              <th className="p-4 border-b">Hồ sơ mời thầu</th>
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
                <td className="p-4 align-top">
                  <div className="font-medium text-gray-900">{item.package_name}</div>
                </td>
                <td className="p-4 align-top text-sm font-semibold text-gray-700">
                  {item.price ? item.price.toLocaleString() : 'N/A'}
                </td>
                <td className="p-4 align-top text-sm text-gray-600">
                  {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : '...'} 
                  {' - '} 
                  {item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : '...'}
                </td>
                <td className="p-4 align-top">
                  {item.requirements_file ? (
                    <a href={item.requirements_file} target="_blank" className="text-blue-600 text-sm hover:underline" rel="noreferrer">Tải HSMT</a>
                  ) : <span className="text-gray-400 text-sm">Chưa có file</span>}
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
              <h3 className="text-lg font-bold">{editingId ? 'Sửa Gói Thầu' : 'Thêm Gói Thầu'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Gói Thầu</label>
                <input 
                  type="text" required value={packageName} onChange={e => setPackageName(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị dự toán (VNĐ)</label>
                <input 
                  type="number" value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu nhận hồ sơ</label>
                  <input 
                    type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc nhận hồ sơ</label>
                  <input 
                    type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Hồ sơ mời thầu (URL)</label>
                <input 
                  type="url" value={requirementsFile} onChange={e => setRequirementsFile(e.target.value)}
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
