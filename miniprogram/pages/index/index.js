import { getUserInfo } from '../../api/user';

const roleMap = {
  'STUDENT': '普通学生',
  'VOLUNTEER': '志愿者',
  'ADMIN': '教师管理员',
  'SUPER_ADMIN': '超级管理员'
};

Page({
  data: {
    userInfo: {},
    roleName: '',
    isVolunteer: false,
    isAdmin: false
  },

  onShow() {
    this.fetchUserInfo();
  },

  async fetchUserInfo() {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        // 未登录则跳转到登录页
        wx.reLaunch({ url: '/pages/login/index' });
        return;
      }
      const data = await getUserInfo();
      const role = data.role || 'STUDENT';
      
      this.setData({
        userInfo: data,
        roleName: roleMap[role] || role,
        isVolunteer: role === 'VOLUNTEER' || role === 'SUPER_ADMIN',
        isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN'
      });
    } catch (err) {
      console.error('Failed to fetch user info', err);
    }
  },

  goToTaskList() {
    wx.navigateTo({ url: '/pages/task/list/index' });
  },

  goToAdminPanel() {
    wx.navigateTo({ url: '/pages/admin/index' });
  }
});
