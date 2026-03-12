import request from '@/utils/request';

export const sendChat = (data) => {
  return request({
    url: '/chat/send',
    method: 'POST',
    data
  });
};
