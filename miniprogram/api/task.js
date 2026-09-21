import { request } from '../utils/request.js';

export const getTaskList = (params) => {
  return request({
    url: '/api/v1/tasks',
    method: 'GET',
    data: params // { week, status }
  });
};

export const getTaskDetail = (taskId) => {
  return request({
    url: `/api/v1/tasks/${taskId}`,
    method: 'GET'
  });
};

export const submitTaskResult = (taskId, data) => {
  return request({
    url: `/api/v1/tasks/${taskId}/submit`,
    method: 'POST',
    data // { isNormal, abnormalRecords: [...] }
  });
};

export const searchStudents = (taskId, keyword) => {
  return request({
    url: `/api/v1/tasks/${taskId}/students/search`,
    method: 'GET',
    data: { keyword }
  });
};
