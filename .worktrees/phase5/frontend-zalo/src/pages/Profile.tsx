import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, ChevronLeft, LogOut, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';

interface Appointment {
  id: number;
  ticket_number: string;
  appointment_date: string;
  time_slot: string;
  content: string;
  status: string;
}

interface Feedback {
  id: number;
  content: string;
  status: string;
  created_at: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { fullName, phone, zaloId, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'appointments' | 'feedbacks'>('appointments');
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!zaloId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [apptRes, fbRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/feedbacks')
        ]);
        setAppointments(apptRes.data);
        setFeedbacks(fbRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [zaloId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-600';
      case 'NEW': return 'bg-blue-100 text-blue-600';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-600';
      case 'COMPLETED': return 'bg-green-100 text-green-600';
      case 'REJECTED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 pt-6 pb-20 px-4 rounded-b-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <Link to="/" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </Link>
          <button onClick={handleLogout} className="p-2 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/40 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-24 relative z-20">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden -mt-12 mb-3">
            <img src={`https://ui-avatars.com/api/?name=${fullName ? encodeURIComponent(fullName) : 'User'}&background=f3f4f6&color=111827&size=200`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{fullName || 'Chưa đăng nhập'}</h2>
          <p className="text-gray-500 text-sm mt-1">{phone || 'Không có SĐT'}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'appointments' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Calendar size={16} /> Lịch hẹn
          </button>
          <button 
            onClick={() => setActiveTab('feedbacks')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'feedbacks' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare size={16} /> Phản ánh
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <span className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></span>
            </div>
          ) : (
            <>
              {activeTab === 'appointments' && (
                appointments.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Bạn chưa có lịch hẹn nào.</p>
                  </div>
                ) : (
                  appointments.map(apt => (
                    <div key={apt.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono font-bold text-gray-800">{apt.ticket_number}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(apt.status)}`}>{apt.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{apt.content}</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500 bg-gray-50 p-3 rounded-xl">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(apt.appointment_date).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {apt.time_slot}</span>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeTab === 'feedbacks' && (
                feedbacks.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Bạn chưa có phản ánh nào.</p>
                  </div>
                ) : (
                  feedbacks.map(fb => (
                    <div key={fb.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(fb.status)}`}>{fb.status}</span>
                        <span className="text-xs text-gray-400">{new Date(fb.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p className="text-sm text-gray-700">{fb.content}</p>
                    </div>
                  ))
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
