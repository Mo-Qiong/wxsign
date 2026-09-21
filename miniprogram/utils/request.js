import { getBaseURL } from './env.js';

/**
 * 封装微信的 wx.request
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
export const request = (options) => {
  return new Promise((resolve, reject) => {
    const baseURL = getBaseURL();
    const token = wx.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };

    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: options.url.startsWith('http') ? options.url : `${baseURL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: header,
      success: (res) => {
        // HTTP 状态码 2xx
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 假设后端返回标准格式 { code: 0, data: ..., msg: ... }
          if (res.data && res.data.code === 0) {
            resolve(res.data.data);
          } else {
            wx.showToast({
              title: res.data?.msg || '业务错误',
              icon: 'none'
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // Token 失效或未登录
          wx.removeStorageSync('token');
          wx.showToast({
            title: '请重新登录',
            icon: 'none'
          });
          wx.reLaunch({
            url: '/pages/login/index'
          });
          reject(new Error('Unauthorized'));
        } else {
          wx.showToast({
            title: `服务器错误 ${res.statusCode}`,
            icon: 'none'
          });
          reject(new Error(`Server error: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络异常，请重试',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};
