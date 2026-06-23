/* eslint-disable react/button-has-type, jsx-a11y/label-has-associated-control, no-alert, no-nested-ternary, no-void, react/no-array-index-key, import/no-duplicates */
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

import { API_BASE_URL as API_URL } from "../../lib/config";

interface Planning {
    id: number;
    title: string;
    content: string;
    image: string | null;
    file_url: string | null;
    created_at: string;
}

export default function AdminPlanning() {
    const { adminToken } = useAuthStore();
    const [list, setList] = useState<Planning[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/planning`);
            setList(res.data);
        } catch (error) {
            console.error("Error fetching planning:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item?: Planning) => {
        if (item) {
            setEditingId(item.id);
            setTitle(item.title);
            setContent(item.content);
            setImage(item.image || "");
            setFileUrl(item.file_url || "");
        } else {
            setEditingId(null);
            setTitle("");
            setContent("");
            setImage("");
            setFileUrl("");
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
            const data = { title, content, image, file_url: fileUrl };
            if (editingId) {
                await axios.patch(`${API_URL}/planning/${editingId}`, data, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
            } else {
                await axios.post(`${API_URL}/planning`, data, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            try {
                await axios.delete(`${API_URL}/planning/${id}`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                fetchData();
            } catch (err) {
                console.error(err);
                alert("Có lỗi xảy ra!");
            }
        }
    };

    if (loading)
        return (
            <div className="p-8 text-center text-gray-500">
                Đang tải dữ liệu...
            </div>
        );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Quản lý Quy hoạch
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Thông tin quy hoạch sử dụng đất, xây dựng
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <Plus size={16} /> Thêm Quy Hoạch
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm">
                            <th className="p-4 border-b">Tiêu đề</th>
                            <th className="p-4 border-b">Ngày đăng</th>
                            <th className="p-4 border-b">
                                Bản đồ/File đính kèm
                            </th>
                            <th className="p-4 border-b text-right">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {list.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-8 text-center text-gray-500"
                                >
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            list.map(item => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-gray-900">
                                            {item.title}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {item.content}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top text-sm text-gray-600">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="p-4 align-top">
                                        {item.image && (
                                            <a
                                                href={item.image}
                                                target="_blank"
                                                className="text-blue-600 text-sm hover:underline block"
                                                rel="noreferrer"
                                            >
                                                Xem bản đồ
                                            </a>
                                        )}
                                        {item.file_url && (
                                            <a
                                                href={item.file_url}
                                                target="_blank"
                                                className="text-blue-600 text-sm hover:underline block mt-1"
                                                rel="noreferrer"
                                            >
                                                Tải Quyết định
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-4 align-top text-right space-x-2">
                                        <button
                                            onClick={() =>
                                                handleOpenModal(item)
                                            }
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold">
                                {editingId ? "Sửa Quy hoạch" : "Thêm Quy hoạch"}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 overflow-y-auto flex-1 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề / Tên đồ án
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nội dung mô tả
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đường dẫn ảnh bản đồ (URL)
                                </label>
                                <input
                                    type="url"
                                    value={image}
                                    onChange={e => setImage(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đường dẫn File Quyết định (URL PDF/Word)
                                </label>
                                <input
                                    type="url"
                                    value={fileUrl}
                                    onChange={e => setFileUrl(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                                >
                                    {editingId ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
