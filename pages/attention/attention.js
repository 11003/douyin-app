// pages/attention/attention.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attenArr:[
      {
        img: "",
        headImg: "",
        name:"",
        arid:'',
        to_userid:'',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Concern/attention',
      method: 'POST',
      data: { userid: userid},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var res = res.data;
        var attenArr = [];
        for(var i in res){
          attenArr.push({
            img: res[i].thumbnail,
            headImg: res[i].to_avatar,
            name: res[i].to_username,
            arid: res[i].arid,
            to_userid: res[i].to_userid
          });
        }
        that.setData({
          attenArr: attenArr
        })
      }
    })
  },
  /**
   * 所属视频
   */
  toIndex(e){
    var id = e.currentTarget.dataset.arid;
    wx.navigateTo({
      url: '/pages/video/video?id=' + id,
    })
  },
  /**
   * 所属发布者
   */
  toUser(e){
    var id = e.currentTarget.dataset.to_userid;
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
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