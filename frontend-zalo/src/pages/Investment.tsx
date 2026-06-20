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
          <div className="space-y-4">
            {data.map((item: any) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <h3 className="text-base font-bold text-gray-800 leading-snug">{item.project_name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    item.status.includes('Hoàn thành') ? 'bg-green-100 text-green-700' :
                    item.status.includes('Tạm dừng') ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                  {item.budget && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                      Vốn: {item.budget.toLocaleString()} Tỷ VNĐ
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                {(item.start_date || item.end_date) && (
                  <div className="text-xs text-gray-500 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100 flex gap-2">
                    <span className="text-primary font-bold">Tiến độ:</span>
                    <span>
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : '...'} 
                      {' - '} 
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : 'Dự kiến'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
