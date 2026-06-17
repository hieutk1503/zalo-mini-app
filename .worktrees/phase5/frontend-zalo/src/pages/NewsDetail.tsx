import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

interface NewsDetail {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published_at: string;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy thông tin bài viết.
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8 bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-800">Tin tức</span>
      </div>

      {news.thumbnail && (
        <div className="w-full h-48 bg-gray-200">
          <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 py-5 space-y-4">
        <h1 className="text-xl font-extrabold text-gray-900 leading-snug">
          {news.title}
        </h1>
        
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary" />
            {new Date(news.published_at).toLocaleDateString('vi-VN')}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-primary" />
            UBND Phường Tự Lạn
          </div>
        </div>

        <div 
          className="text-sm text-gray-700 leading-relaxed space-y-4 pt-2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  );
}
