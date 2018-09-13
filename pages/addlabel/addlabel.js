// pages/addlabel/addlabel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },

  /**
   * 用户提交自定义标签 
   */
  formSubmit:function(e){
    var that = this;
    var info = e.detail.value;
    var userid = app.d.userId;
    info.userid = app.d.userId;
    console.log(info);
    if (info.name.length == 0){
      wx.showToast({
        title: "请输入标签",
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/addlabel',
      method: 'POST',
      data: info,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        wx.showToast({
          title: res.data.arr,
          duration: 2000
        });
        setTimeout(function () {
          wx.reLaunch({
            url: "/pages/person/person"
          })
        }, 1500);
        return false;
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