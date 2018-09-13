// pages/comment/comment.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentArr:[
      { head: "", name: "", info: "", time: "", img: "" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId; //评论者id
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/comment',
      method: 'POST',
      data: { userid: userid },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var res = res.data;
        var commentArr = [];
        for(var i in res){
          commentArr.push({
            head: res[i].avatar,
            name: res[i].user_nickname,
            info: res[i].content,
            time: res[i].create_time,
            img:  res[i].thumbnail
          })
          that.setData({
            commentArr: commentArr
          })
        }
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