import { login, bindStudent } from '../../api/user';
import Toast from 'tdesign-miniprogram/toast/index';
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    name: '',
    studentId: ''
  },

  onNameChange(e) {
    this.setData({ name: e.detail.value });
  },

  onStudentIdChange(e) {
    this.setData({ studentId: e.detail.value });
  },

  async handleLoginAndBind() {
    const { name, studentId } = this.data;
    if (!name || !studentId) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 3000,
        content: '请完整填写姓名和学号',
      });
      return;
    }

    try {
      wx.showLoading({ title: '登录中...' });
      // 1. 获取微信 code
      const loginRes = await wx.login();
      if (!loginRes.code) {
        throw new Error('微信登录失败');
      }

      // 2. 调用后端登录接口，换取初步的 token
      const authData = await login({ code: loginRes.code });
      if (authData && authData.token) {
         wx.setStorageSync('token', authData.token);
      }

      // 3. 绑定学号
      await bindStudent({ name, studentId });
      
      wx.hideLoading();
      Toast({
        context: this,
        selector: '#t-toast',
        message: '绑定成功',
        theme: 'success', 
      });

      // 绑定成功后跳转首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
        });
      }, 1000);

    } catch (err) {
      wx.hideLoading();
      Message.error({
        context: this,
        offset: [20, 32],
        duration: 3000,
        content: err.msg || '登录失败，请重试',
      });
    }
  }
});
