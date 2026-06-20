import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Bidding() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/bidding').then(res => {
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
          <h1 className="text-xl font-bold">Thông tin đấu thầu</h1>
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
                <h3 className="text-base font-bold text-gray-800 leading-snug">{item.package_name}</h3>
                
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Giá trị gói thầu:</span>
                    <span className="font-semibold text-gray-900">{item.price ? item.price.toLocaleString() + ' VNĐ' : 'Đang cập nhật'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-500">Thời gian nhận hồ sơ:</span>
                    <span className="font-medium text-gray-800">
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : '...'} 
                      {' - '} 
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : '...'}
                    </span>
                  </div>
                </div>

                {item.requirements_file && (
                  <div className="mt-2 pt-3 border-t border-gray-100">
                    <a href={item.requirements_file} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl text-center hover:bg-primary/20 transition-colors inline-block w-full">
                      Tải Hồ Sơ Mời Thầu
                    </a>
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
