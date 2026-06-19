import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Investment() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/investment').then(res => {
      setData(res.data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-in pb-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-6 pb-6 px-4 rounded-b-[2rem] text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <Link to="/" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold">Dự án đầu tư</h1>
        </div>
      </div>
      <div className="px-4 mt-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500">Chưa có dữ liệu.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-800 leading-snug">{item.title || item.project_name || item.package_name || item.name}</h3>
                <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
