Page({
  handleLogout() {
    wx.removeStorageSync('token');
    wx.reLaunch({
      url: '/pages/login/index'
    });
  }
});
