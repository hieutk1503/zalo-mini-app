import { useState, useEffect } from 'react';
import { ChevronLeft, Search, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

interface DocumentItem {
  id: number;
  document_no: string;
  abstract: string;
  file_url: string;
  type: string;
  created_at: string;
}

export default function Documents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/documents', {
          params: { 
            type: activeTab === 'Tất cả' ? undefined : activeTab, 
            q: searchQuery 
          }
        });
        setDocuments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchDocuments();
    }, 500);

    return () => clearTimeout(timerId);
  }, [activeTab, searchQuery]);

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 pt-6 pb-12 px-4 rounded-b-[2rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold">Kho văn bản</h1>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 space-y-4">
        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
          {['Tất cả', 'Quyết định', 'Nghị định', 'Thông tư'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-none px-4 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center border border-gray-100">
          <div className="pl-3 pr-2 text-indigo-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập số hiệu hoặc trích yếu..."
            className="w-full bg-transparent border-none py-3 text-sm focus:ring-0 outline-none text-gray-800"
          />
        </div>

        {/* List */}
        <div className="space-y-3 pt-2">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <span className="w-8 h-8 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">Không tìm thấy văn bản nào.</p>
            </div>
          ) : (
            documents.map(doc => (
              <div 
                key={doc.id} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-500/30 transition-all flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md mb-1.5 border border-gray-200">
                      Số: {doc.document_no}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{doc.abstract}</h3>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400 font-medium">
                    Ban hành: {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                  </span>
                  <a 
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    <Download size={14} /> Tải về
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
