import React, { useState } from 'react';
import api from '../lib/axios';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SurveyModal({ visible, onClose }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/survey', { rating, comment });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Đánh giá dịch vụ</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Vui lòng đánh giá mức độ hài lòng của bạn</p>
        
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={star <= rating ? "#FBBF24" : "none"} stroke={star <= rating ? "#FBBF24" : "#D1D5DB"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          ))}
        </div>
        
        <textarea
          placeholder="Góp ý thêm (không bắt buộc)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />
        
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Đóng</button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer">Gửi đánh giá</button>
        </div>
      </div>
    </div>
  );
}
