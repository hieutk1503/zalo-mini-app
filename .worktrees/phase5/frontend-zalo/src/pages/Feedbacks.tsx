import { useState } from 'react';
import { Camera, MapPin, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function Feedbacks() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/feedbacks', { content });
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
      {/* Header */}
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
          
          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Nội dung phản ánh <span className="text-rose-500">*</span></label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
              placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
              required
            ></textarea>
          </div>

          {/* Media & Location (Mock UI) */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex flex-col items-center justify-center gap-2 py-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-rose-500 hover:text-rose-500 transition-all">
              <Camera size={24} />
              <span className="text-xs font-semibold">Đính kèm ảnh</span>
            </button>
            <button type="button" className="flex flex-col items-center justify-center gap-2 py-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-rose-500 hover:text-rose-500 transition-all">
              <MapPin size={24} />
              <span className="text-xs font-semibold">Gắn toạ độ</span>
            </button>
          </div>

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
