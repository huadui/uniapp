export const BASE_URL = 'http://127.0.0.1:8080'; // 真机调试地址，请确认手机和电脑在同一局域网

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === '200') {
            resolve(res.data);
          } else {
            uni.showToast({
              title: res.data.msg || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else {
          uni.showToast({
            title: '系统错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

export default request;
