import { useState, useEffect } from 'react';
import { Search, ChevronLeft, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

interface Procedure {
  id: number;
  code: string;
  title: string;
}

export default function Procedures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProcedures = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/procedures', {
          params: { q: searchQuery }
        });
        setProcedures(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchProcedures();
    }, 500); // 500ms debounce

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 pt-6 pb-12 px-4 rounded-b-[2rem] text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Link to="/" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold">Tra cứu thủ tục</h1>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20">
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-lg shadow-gray-200/50 mb-6 flex items-center border border-gray-100">
          <div className="pl-3 pr-2 text-amber-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập tên thủ tục hoặc từ khóa..."
            className="w-full bg-transparent border-none py-3 text-sm focus:ring-0 outline-none text-gray-800"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <span className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></span>
            </div>
          ) : procedures.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500">Không tìm thấy thủ tục nào.</p>
            </div>
          ) : (
            procedures.map(proc => (
              <Link 
                key={proc.id} 
                to={`/procedures/${proc.id}`}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-amber-500/30 transition-all active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">{proc.title}</h3>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-200">
                    Mã: {proc.code}
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
