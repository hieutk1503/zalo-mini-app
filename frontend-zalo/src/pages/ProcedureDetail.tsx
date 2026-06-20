import { useState, useEffect } from 'react';
import { ChevronLeft, Clock, DollarSign, FileText, Download, MessageCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

interface ProcedureDetail {
  id: number;
  code: string;
  title: string;
  description: string;
  fee: string;
  duration: string;
  process_steps: string;
}

export default function ProcedureDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proc, setProc] = useState<ProcedureDetail | null>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        const res = await api.get(`/procedures/${id}`);
        setProc(res.data);
        const formsRes = await api.get('/form-template');
        setForms(formsRes.data.filter((f: any) => f.procedure_id === Number(id)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProcedure();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!proc) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy thông tin thủ tục.
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 pt-6 pb-12 px-4 rounded-b-[2rem] text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <span className="text-sm font-semibold opacity-90">Chi tiết thủ tục</span>
        </div>
        <h1 className="text-xl font-extrabold relative z-10 leading-tight mb-2">
          {proc.title}
        </h1>
        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold border border-white/30">
          Mã: {proc.code}
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20 space-y-4">
        {/* Badges Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thời gian</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{proc.duration || 'Chưa quy định'}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lệ phí</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{proc.fee || 'Miễn phí'}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          {proc.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" /> Mô tả
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{proc.description}</p>
            </div>
          )}

          {proc.process_steps && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" /> Trình tự thực hiện
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {proc.process_steps}
              </div>
            </div>
          )}
        </div>

        {/* Mẫu đơn đính kèm */}
        {forms.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Download size={16} className="text-amber-500" /> Biểu mẫu đính kèm
            </h3>
            <div className="space-y-2">
              {forms.map(form => (
                <a key={form.id} href={form.file_url} target="_blank" className="block p-3 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors">
                  <div className="text-sm font-bold text-amber-900">{form.name}</div>
                  <div className="text-[10px] text-amber-600 mt-1">Nhấn để tải về</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link to="/chatbot" className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <MessageCircle size={18} /> Hỏi AI về thủ tục này
          </Link>
        </div>
      </div>
    </div>
  );
}
