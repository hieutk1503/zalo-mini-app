import { useState } from 'react';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import SurveyModal from '../components/SurveyModal';

export default function Appointments() {
  const navigate = useNavigate();
  const { fullName: savedFullName, phone: savedPhone } = useAuthStore();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [content, setContent] = useState('');
  const [fullName, setFullName] = useState(savedFullName || '');
  const [phone, setPhone] = useState(savedPhone || '');
  const [cccd, setCccd] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', 
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot || !content || !fullName || !phone || !cccd) return;
    if (!/^\d{10}$/.test(phone)) {
      alert('Số điện thoại cần gồm 10 chữ số.');
      return;
    }
    if (!/^\d{12}$/.test(cccd)) {
      alert('CCCD cần gồm 12 chữ số.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/appointments', {
        date: new Date(date).toISOString(),
        timeSlot,
        content,
        fullName,
        phone,
        cccd
      });
      setSuccessTicket(res.data.ticket_number);
      setShowSurvey(true);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successTicket) {
    return (
      <div className="p-4 pt-8 animate-fade-in text-center h-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt lịch thành công!</h2>
        <p className="text-gray-500 mb-6">Mã vé của bạn là:</p>
        <div className="bg-white border-2 border-dashed border-primary px-8 py-4 rounded-2xl mb-8">
          <span className="text-3xl font-black text-primary tracking-widest">{successTicket}</span>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold w-full max-w-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/20"
        >
          Xem lịch sử hẹn
        </button>
        <SurveyModal visible={showSurvey} onClose={() => setShowSurvey(false)} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark pt-6 pb-10 px-4 rounded-b-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Link to="/" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all">
            <ChevronLeft size={20} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold">Đặt lịch làm việc</h1>
        </div>
        <p className="text-white/80 text-sm relative z-10 max-w-[280px]">
          Điền thông tin bên dưới để đăng ký làm việc tại UBND.
        </p>
      </div>

      <div className="px-4 -mt-6 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 space-y-5 border border-gray-100">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="09xxxxxxxx"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Căn cước công dân</label>
              <input
                type="text"
                value={cccd}
                onChange={e => setCccd(e.target.value.replace(/\D/g, '').slice(0, 12))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="12 chữ số"
                inputMode="numeric"
                required
              />
            </div>
          </div>
          
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Ngày hẹn
            </label>
            <input 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Khung giờ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2.5 px-2 rounded-xl text-sm font-semibold transition-all border ${
                    timeSlot === slot 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-[1.02]' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Nội dung công việc</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              placeholder="Vui lòng mô tả ngắn gọn nội dung công việc bạn cần hỗ trợ..."
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !date || !timeSlot || !content || !fullName || !phone || !cccd}
            className="w-full bg-gradient-to-r from-primary-dark to-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Xác nhận đặt lịch'}
          </button>
        </form>
      </div>
    </div>
  );
}
