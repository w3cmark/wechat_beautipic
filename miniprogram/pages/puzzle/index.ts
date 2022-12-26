// pages/filter/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgFiles: <any>[],
    imgLayout: '1',
    imgSize: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },

  bindViewTap() {
    const fs = wx.getFileSystemManager();
    wx.chooseMedia({
      //count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['original'],
      camera: 'back',
      success: (res) => {
        console.log(res)
        if (res.tempFiles.length < 2) {
          wx.showToast({
            title: '至少要两张照片',
            icon: 'error',
            duration: 3000
          })
          return          
        }
        this.setData({
          imgFiles: res.tempFiles
        })
        this.drawPreview()
      }
    })
  },
  drawPreview() {
    const query = wx.createSelectorQuery()
    query.select('#previewCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        // ctx.fillRect(0, 0, 100, 100)
        let index = 0
        for await (const iterator of this.data.imgFiles) {
          const element = iterator;
          console.log(element)
          const image = canvas.createImage()
          const y = index * canvas._height/2
          index++
          image.onload = () => {
            // 将图片绘制到 canvas 上
            const c_left = 0
            const c_top = 0
            const c_w = image.width
            const c_h = image.width * (canvas._height / (2*canvas._width))
            console.log(canvas._width, canvas._height, c_w, c_h)
            ctx.drawImage(image, c_left, c_top, c_w, c_h, 0, y, canvas._width, canvas._height/2)
          }
          // 设置图片src
          image.src = element.tempFilePath
        }
        // for (let index = 0; index < imgs.length; index++) {
        //   const element = imgs[index];
        //   const image = canvas.createImage()
        //   const y = index * 100
        //   image.onload = () => {
        //     // 将图片绘制到 canvas 上
        //     ctx.drawImage(image, 0, y)
        //   }
        //   // 设置图片src
        //   image.src = element.tempFilePath
        // }
      })
  },
  bindLayoutTap(e: any) {
    this.setData({
      imgLayout: e?.currentTarget?.dataset?.layout || '1'
    })
  },
  bindScaleTap(e: any) {
    this.setData({
      imgSize: e?.currentTarget?.dataset?.size || '1'
    })
    this.drawPreview()
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

  }
})