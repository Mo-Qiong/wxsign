import { getTaskDetail, submitTaskResult } from '../../../api/task';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    taskId: '',
    task: {},
    resultType: 'NORMAL',
    abnormalList: [], // { studentId, name, type }
    fileList: []
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ taskId: options.id });
      this.fetchDetail(options.id);
    }
  },

  onShow() {
    // 从异常选择页面返回时，读取全局存储或事件通道获取已选名单
    const selectedAbnormal = wx.getStorageSync('selectedAbnormal');
    if (selectedAbnormal) {
      this.setData({ abnormalList: selectedAbnormal });
      wx.removeStorageSync('selectedAbnormal');
    }
  },

  async fetchDetail(id) {
    try {
      wx.showLoading();
      const task = await getTaskDetail(id);
      if (task && task.date) {
        const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
        const d = new Date(task.date);
        const dayStr = Number.isNaN(d.getDay()) ? '' : ' 星期' + dayNames[d.getDay()];
        task.timeStr = `第${task.academicWeek}周${dayStr} ${task.period}节`;
      }
      this.setData({ task });
    } catch (err) {
      console.error(err);
    } finally {
      wx.hideLoading();
    }
  },

  onResultTypeChange(e) {
    this.setData({ resultType: e.detail.value });
    if (e.detail.value === 'NORMAL') {
      this.setData({ abnormalList: [] });
    }
  },

  goToAbnormalPage() {
    // 携带当前已选的进去，方便回显或追加（此版本简单化为覆盖或直接跳转）
    wx.setStorageSync('currentAbnormal', this.data.abnormalList);
    wx.navigateTo({
      url: `/pages/task/abnormal/index?taskId=${this.data.taskId}`
    });
  },

  onAddPhoto(e) {
    const { files } = e.detail;
    // 实际项目中这里应该调用 wx.uploadFile 上传到 COS
    // 这里简单把本地路径放进去作为演示
    const currentFiles = this.data.fileList;
    const newFiles = files.map((file) => ({
      url: file.url,
      name: 'photo',
      type: 'image',
    }));
    this.setData({ fileList: currentFiles.concat(newFiles) });
  },

  onRemovePhoto(e) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({ fileList });
  },

  async handleSubmit() {
    const { resultType, abnormalList, fileList, task, taskId } = this.data;

    if (resultType === 'ABNORMAL' && abnormalList.length === 0) {
      Toast({ context: this, selector: '#t-toast', message: '请添加异常学生名单' });
      return;
    }

    if (task.requirePhoto && fileList.length === 0) {
      Toast({ context: this, selector: '#t-toast', message: '必须上传现场照片' });
      return;
    }

    try {
      wx.showLoading({ title: '提交中' });
      const photoUrls = fileList.map(f => f.url);
      await submitTaskResult(taskId, {
        isNormal: resultType === 'NORMAL',
        abnormalRecords: resultType === 'NORMAL' ? [] : abnormalList,
        photos: photoUrls
      });

      wx.hideLoading();
      Toast({ context: this, selector: '#t-toast', message: '提交成功', theme: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      wx.hideLoading();
      Toast({ context: this, selector: '#t-toast', message: err.msg || '提交失败' });
    }
  }
});
