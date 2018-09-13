// pages/love/love.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loveArr: [
      { head: "", name: "", time: "", img: "" },
    ],
    notComment:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId; //点赞者id
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/love',
      method: 'POST',
      data: { userid: userid },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var res = res.data;
        if (res == ''){
          that.setData({
            notComment: "没有人给你评论"
          })
 
        }else{
          var loveArr = [];
          for (var i in res) {
            loveArr.push({
              head: res[i].avatar,
              name: res[i].user_nickname,
              time: res[i].create_time,
              img: res[i].thumbnail
            })
            that.setData({
              loveArr: loveArr
            })
          }
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