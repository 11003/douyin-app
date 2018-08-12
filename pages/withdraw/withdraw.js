// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'wx', value: '微信', src:"/images/wx.png", url:"toWechat", checked: 'true' },
      { name: 'yhk', value: '银行卡', src: "/images/yhk.png", url:"toCard" },
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  toWechat(e){
    wx.navigateTo({
      url: '/pages/withWechat/withWechat',
    })
  },
  toCard(e) {
    wx.navigateTo({
      url: '/pages/withCard/withCard',
    })
  }
})