// pages/Instructions/Instructions.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    catename:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that=this;
    var userid=app.d.userid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/cate/index',
      method: 'post',
      data: {"id":1},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
          that.setData({
            content: res.data[0].content,
            catename: res.data[0].catename
          })
      },
      fail:function(res){

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