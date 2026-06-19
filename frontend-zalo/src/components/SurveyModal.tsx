import React, { useState } from 'react';
import { Modal, Box, Text, Button, Input, Icon } from 'zmp-ui';
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

  return (
    <Modal visible={visible} onClose={onClose} title="Đánh giá chất lượng dịch vụ">
      <Box className="flex flex-col items-center p-4">
        <Text className="mb-4 text-center">Vui lòng đánh giá mức độ hài lòng của bạn</Text>
        <Box className="flex justify-center mb-4 space-x-2">
          {[1,2,3,4,5].map(star => (
            <div key={star} onClick={() => setRating(star)}>
              <Icon icon="zi-star-solid" className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} size={32} />
            </div>
          ))}
        </Box>
        <Input.TextArea placeholder="Góp ý thêm (không bắt buộc)" value={comment} onChange={e => setComment(e.target.value)} className="mb-4" />
        <Button onClick={handleSubmit} fullWidth>Gửi đánh giá</Button>
      </Box>
    </Modal>
  );
}
