import { request } from '../utils/request.js';

export const login = (data) => {
  return request({
    url: '/api/v1/auth/login',
    method: 'POST',
    data // { code: 'wx_code' }
  });
};

export const bindStudent = (data) => {
  return request({
    url: '/api/v1/auth/bind',
    method: 'POST',
    data // { studentId, name }
  });
};

export const getUserInfo = () => {
  return request({
    url: '/api/v1/user/info',
    method: 'GET'
  });
};
