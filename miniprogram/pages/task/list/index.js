import { getTaskList } from '../../../api/task';

Page({
  data: {
    status: 'TODO',
    tasks: []
  },

  onShow() {
    this.fetchTasks();
  },

  onTabChange(e) {
    this.setData(
      { status: e.detail.value },
      () => {
        this.fetchTasks();
      }
    );
  },

  async fetchTasks() {
    try {
      wx.showLoading({ title: '加载中' });
      const res = await getTaskList({ status: this.data.status });
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      const tasks = (res || []).map(item => {
        const d = new Date(item.date);
        const dayStr = Number.isNaN(d.getDay()) ? '' : ' 星期' + dayNames[d.getDay()];
        return {
          ...item,
          timeStr: `第${item.academicWeek}周${dayStr} ${item.period}节`
        };
      });
      this.setData({ tasks });
    } catch (err) {
      console.error(err);
    } finally {
      wx.hideLoading();
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/task/detail/index?id=${id}`
    });
  }
});
