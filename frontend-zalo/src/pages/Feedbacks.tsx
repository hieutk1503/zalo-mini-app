import { useRef, useState } from 'react';
import { Camera, MapPin, ChevronLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function Feedbacks() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nextFiles = [...selectedFiles, ...files].slice(0, 5);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setSelectedFiles(nextFiles);
    setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ lấy vị trí.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsLocating(false);
      },
      () => {
        alert('Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập vị trí.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return '';

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('images', file));
    const res = await api.post<{ urls: string[] }>('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.urls.join(',');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setIsSubmitting(true);
    try {
      const imageUrls = await uploadImages();
      await api.post('/feedbacks', { content, imageUrls, location });
      alert('Gửi phản ánh thành công!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-8">
      <div className="bg-gradient-to-br from-rose-500 to-rose-700 pt-6 pb-10 px-4 rounded-b-[2rem] text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Link to="/" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold">Phản ánh hiện trường</h1>
        </div>
        <p className="text-white/80 text-sm relative z-10 max-w-[280px]">
          Gửi phản ánh về các vấn đề dân sinh, an ninh trật tự trên địa bàn xã.
        </p>
      </div>

      <div className="px-4 -mt-6 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 space-y-5 border border-gray-100">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Nội dung phản ánh <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
              placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Camera size={16} className="text-rose-500" /> Ảnh minh chứng (tối đa 5)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleSelectImages}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-rose-500 hover:text-rose-500 transition-all"
            >
              <Camera size={20} />
              <span className="text-sm font-semibold">Chọn hoặc chụp ảnh</span>
            </button>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <img src={url} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-rose-500 hover:text-rose-500 transition-all disabled:opacity-60"
          >
            <MapPin size={20} />
            <span className="text-sm font-semibold">
              {isLocating ? 'Đang lấy tọa độ...' : location || 'Gắn tọa độ hiện tại'}
            </span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !content}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Gửi phản ánh'}
          </button>
        </form>
      </div>
    </div>
  );
}
