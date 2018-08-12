// pages/atten/atten.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attenArr: [
      { headImg: "/images/head.png", userName: "活捉一个捡子", fans: "2w", work: "19", info: "记住该记住的，忘记该忘记的。", fansShow: true },
      { headImg: "/images/head.png", userName: "活捉一个捡子", fans: "2w", work: "19", info: "记住该记住的，忘记该忘记的。", fansShow: true },
      { headImg: "/images/head.png", userName: "活捉一个捡子", fans: "2w", work: "19", info: "记住该记住的，忘记该忘记的。", fansShow: true },
      { headImg: "/images/head.png", userName: "活捉一个捡子", fans: "2w", work: "19", info: "记住该记住的，忘记该忘记的。", fansShow: true },
      { headImg: "/images/head.png", userName: "活捉一个捡子", fans: "2w", work: "19", info: "记住该记住的，忘记该忘记的。", fansShow: true },
      { headImg: "/images/head.png", userName: "活捉一个捡子", fans: "2w", work: "19", info: "记住该记住的，忘记该忘记的。", fansShow: true }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  attenPerson(e) {
    var that = this;
    var idx = e.currentTarget.dataset.show;
    if (that.data.attenArr[idx].fansShow == false) {
      that.data.attenArr[idx].fansShow = true;
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.attenArr[idx].fansShow = false;
    }
    that.setData({
      attenArr: that.data.attenArr
    })
  },
  cancleAtten(e) {
    var that = this;
    var idx = e.currentTarget.dataset.show;
    if (that.data.attenArr[idx].fansShow == true) {
      that.data.attenArr[idx].fansShow = false
      wx.showToast({
        title: '您已取消关注',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.attenArr[idx].fansShow = true
    }
    that.setData({
      attenArr: that.data.attenArr
    })
  }
})