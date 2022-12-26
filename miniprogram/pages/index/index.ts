// pages/index/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasShowAddTips: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    try {
      const hasShowAddTips = wx.getStorageSync('addMyMiniprogram')
      this.setData({
        hasShowAddTips
      })
    } catch (e) {
      console.error(e)
    }    
  },
  hideTips() {
    this.setData({
      hasShowAddTips: 1
    })
    try {
      wx.setStorageSync('addMyMiniprogram', 1)
    } catch (e) {
      console.error(e)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let shareData = {
      title: '照片压缩、长图拼接，一个超好用的照片处理工具箱，快来试下吧😊',
      path: 'pages/index/index',
      imageUrl: '../images/index_share.png'
    };
    return shareData;
  }
})