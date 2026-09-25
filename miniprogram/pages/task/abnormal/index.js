import { searchStudents } from '../../../api/task';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    taskId: '',
    keyword: '',
    searchResults: [],
    selectedList: [] // { studentId, name, type }
  },

  onLoad(options) {
    if (options.taskId) {
      this.setData({ taskId: options.taskId });
    }
    const current = wx.getStorageSync('currentAbnormal');
    if (current && Array.isArray(current)) {
      this.setData({ selectedList: current });
      wx.removeStorageSync('currentAbnormal');
    }
  },

  onKeywordChange(e) {
    this.setData({ keyword: e.detail.value });
    // 可以加 debounce 自动搜索，目前采用点击搜索按钮
  },

  async handleSearch() {
    if (!this.data.keyword) {
      Toast({ context: this, selector: '#t-toast', message: '请输入搜索词' });
      return;
    }
    try {
      wx.showLoading({ title: '搜索中' });
      const results = await searchStudents(this.data.taskId, this.data.keyword);
      this.setData({ searchResults: results || [] });
    } catch (err) {
      Toast({ context: this, selector: '#t-toast', message: '搜索失败' });
    } finally {
      wx.hideLoading();
    }
  },

  addStudent(e) {
    const student = e.currentTarget.dataset.item;
    const { selectedList } = this.data;
    
    // 判断是否已存在
    const exists = selectedList.some(s => s.studentId === student.studentId);
    if (exists) {
      Toast({ context: this, selector: '#t-toast', message: '该学生已在列表中' });
      return;
    }

    selectedList.push({
      ...student,
      type: '旷课' // 默认类型
    });

    this.setData({ 
      selectedList,
      keyword: '',
      searchResults: [] 
    });
  },

  removeStudent(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedList } = this.data;
    selectedList.splice(index, 1);
    this.setData({ selectedList });
  },

  onTypeChange(e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const { selectedList } = this.data;
    selectedList[index].type = value;
    this.setData({ selectedList });
  },

  handleConfirm() {
    const { selectedList } = this.data;
    wx.setStorageSync('selectedAbnormal', selectedList);
    wx.navigateBack();
  }
});
