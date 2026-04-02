import request from '@/utils/request'

export const getHistoryList = (userId) => {
  return request({
    url: '/history/list',
    method: 'GET',
    data: {
      userId
    }
  })
}

export const saveInquiryRecord = (data) => {
  return request({
    url: '/inquiry/save',
    method: 'POST',
    data
  })
}
