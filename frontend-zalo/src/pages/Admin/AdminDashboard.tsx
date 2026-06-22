/* eslint-disable react/button-has-type, jsx-a11y/label-has-associated-control, no-alert, no-nested-ternary, no-void, react/no-array-index-key, import/no-duplicates */
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageSquare, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import { API_BASE_URL as API_URL } from '../../lib/config';

interface DashboardStats {
  totalCitizens: number;
  totalFeedbacks: number;
  totalAppointments: number;
  totalNews: number;
  recentAppointments: any[];
}

export default function AdminDashboard() {
  const { adminToken } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [adminToken]);

  if (loading || !stats) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Người dân</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCitizens}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phản ánh</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalFeedbacks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lịch hẹn</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tin tức</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Lịch hẹn mới nhất</h3>
          <Link to="/admin/appointments" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Xem tất cả</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recentAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Chưa có lịch hẹn nào</div>
          ) : stats.recentAppointments.map(app => (
            <div key={app.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{app.citizen?.full_name || 'Khách'}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(app.appointment_date).toLocaleDateString('vi-VN')} lúc {app.time_slot}</div>
              </div>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
