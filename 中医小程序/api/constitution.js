import request from '@/utils/request.js';

// 提交体质辨识测试
export const submitConstitutionTest = (userId, answers) => {
  return request({
    url: '/constitution/test',
    method: 'POST',
    data: {
      userId: userId,
      answers: answers
    }
  });
};
