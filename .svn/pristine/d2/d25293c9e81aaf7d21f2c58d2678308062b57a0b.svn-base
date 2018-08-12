// pages/news/news.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageArr: [
      { 
        img: "", 
        post_title: "", 
        published_time: "", 
        post_content: ""
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.d.ceshiUrl);
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/info',
      method: 'POST',
      data: { voice: 0},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        that.setData({
         messageArr: res.data,
        })
        console.log(data.res.messageArrs);
      }
    })
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
  
  }
})