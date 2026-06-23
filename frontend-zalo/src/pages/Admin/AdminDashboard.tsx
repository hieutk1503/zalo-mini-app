/* eslint-disable react/button-has-type, jsx-a11y/label-has-associated-control, no-alert, no-nested-ternary, no-void, react/no-array-index-key, import/no-duplicates */
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Users,
    MessageSquare,
    Calendar,
    FileText,
    Map,
    Building,
    Clipboard,
    Briefcase,
    FileCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { API_BASE_URL as API_URL } from "../../lib/config";

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
                    headers: { Authorization: `Bearer ${adminToken}` },
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

    if (loading || !stats)
        return (
            <div className="p-8 text-center text-gray-500">
                Đang tải dữ liệu...
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Tổng quan hệ thống
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Người dân
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.totalCitizens}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Phản ánh
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.totalFeedbacks}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Lịch hẹn
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.totalAppointments}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Tin tức
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.totalNews}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chức năng quản trị (Grid Menu) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                    Chức năng quản trị
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <Link
                        to="/admin/news"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <FileText size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Tin tức
                        </span>
                    </Link>
                    <Link
                        to="/admin/citizens"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Công dân
                        </span>
                    </Link>
                    <Link
                        to="/admin/appointments"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Calendar size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Lịch hẹn
                        </span>
                    </Link>
                    <Link
                        to="/admin/feedbacks"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <MessageSquare size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Phản ánh
                        </span>
                    </Link>
                    <Link
                        to="/admin/procedures"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <FileCheck size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Thủ tục
                        </span>
                    </Link>
                    <Link
                        to="/admin/planning"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Map size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Quy hoạch
                        </span>
                    </Link>
                    <Link
                        to="/admin/investment"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Building size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Dự án
                        </span>
                    </Link>
                    <Link
                        to="/admin/form-templates"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Clipboard size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Biểu mẫu
                        </span>
                    </Link>
                    <Link
                        to="/admin/bidding"
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center">
                            Đấu thầu
                        </span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        Lịch hẹn mới nhất
                    </h3>
                    <Link
                        to="/admin/appointments"
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        Xem tất cả
                    </Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {stats.recentAppointments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Chưa có lịch hẹn nào
                        </div>
                    ) : (
                        stats.recentAppointments.map(app => (
                            <div
                                key={app.id}
                                className="p-4 hover:bg-gray-50 flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        {app.citizen?.full_name || "Khách"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(
                                            app.appointment_date,
                                        ).toLocaleDateString("vi-VN")}{" "}
                                        lúc {app.time_slot}
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                        app.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : app.status === "APPROVED"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {app.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
