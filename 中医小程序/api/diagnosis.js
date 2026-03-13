import request from '@/utils/request.js';

export const uploadTongueImage = (userId, imageBase64) => {
  return request({
    url: '/diagnosis/tongue',
    method: 'POST',
    data: {
      userId: userId,
      imageBase64: imageBase64
    }
  });
};

export const uploadFaceImage = (userId, imageBase64) => {
  return request({
    url: '/diagnosis/face',
    method: 'POST',
    data: {
      userId: userId,
      imageBase64: imageBase64
    }
  });
};
