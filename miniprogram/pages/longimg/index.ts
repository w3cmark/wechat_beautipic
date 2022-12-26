// index.ts

Page({
  data: {
    imgFiles: <any>[],
    type: 1, // 1 竖向；2 横向
    canvas_h: 750,
    tempFilePath: '',
    canvas: undefined
  },
  // 事件处理函数
  bindViewTap() {
    const fs = wx.getFileSystemManager();
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['original'],
      camera: 'back',
      success: (res) => {
        console.log(res)
        if (res.tempFiles.length < 2) {
          wx.showToast({
            title: '最少2张照片',
            icon: 'error',
            duration: 3000
          })
          return
        }
        if (res.tempFiles.length > 9) {
          wx.showToast({
            title: '最多9张照片',
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
  getImageInfo(src: any) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success(res) {
          resolve({ ...res
          })
        },
        fail(e) {
          console.error(e)
          //获取图片高度失败时自动填充750
          reject({
            type:'error',
            height: 750,
            src
          })
        }
      })
    })
  },
  imageOnLoadSync(canvas: any, src: string) {
    return new Promise((resolve) => {
      const image = canvas.createImage()
      image.onload = () => {
        resolve(image)
      }
      // 设置图片src
      image.src = src
    })
  },
  async drawPreview() {
    let max_w = 0
    let max_h = 0

    for (let i = 0; i < this.data.imgFiles.length; i++) {
      let item = this.data.imgFiles[i]
      const res: any = await this.getImageInfo(item.tempFilePath)
      item.width = res.width
      if (res.width > max_w) {
        max_w = res.width
      }
      max_h += res.height
    }
    const res = wx.getSystemInfoSync()
    const canvas_h = res.windowHeight * 0.9
    const canvas_w = max_w*canvas_h/max_h
    this.setData({
      canvas_h,
      canvas_w
    })
    // const canvas_r = canvas_w/canvas_h
    const query = wx.createSelectorQuery()
    query.select('#previewCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node
        this.data.canvas = canvas
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = canvas_w * dpr
        canvas.height = canvas_h * dpr
        ctx.scale(dpr, dpr)
        ctx.fillStyle ='white'
        ctx.fillRect(0, 0, canvas_w, canvas_h)
        let y = 0
        for (const iterator of this.data.imgFiles) {
          const image: any = await this.imageOnLoadSync(canvas, iterator.tempFilePath)
          // 将图片绘制到 canvas 上
          const c_w = image.width < max_w ? image.width*canvas_h/max_h : canvas_w
          const c_h = c_w * image.height/image.width
          console.log(y, canvas_w, canvas_h, image.width, image.height, c_w, c_h, dpr)
          ctx.drawImage(image, 0, 0, image.width, image.height, (canvas_w - c_w)/2, y, c_w, c_h)
          y += c_h
        }
      })
  },
  bindLayoutTap(e: any) {
    // this.setData({
    //   imgLayout: e?.currentTarget?.dataset?.layout || '1'
    // })
  },
  onLoad() {
  },
  onShareAppMessage() {
    let shareData = {
      title: '一个超好用的长图拼接工具，快来试下吧😊',
      path: 'pages/longimg/index',
      imageUrl: '../images/longimg_share.png'
    };
    return shareData;
  },
  getTempFilePath() {
    wx.canvasToTempFilePath({
      canvasId: 'previewCanvas',
      canvas: this.data.canvas,
      success: (res) => {
        this.saveImage(res.tempFilePath)
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: res.errMsg,
          icon: 'error',
          duration: 5000
        })        
      }
    }, this)
  },
  saveImage(tempFilePath: string) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(res) {
        if(res.errMsg === 'saveImageToPhotosAlbum:ok') {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })          
        }
      }
    })
  },
  clear() {
    this.setData({
      imgFiles: []
    })
  }
})
