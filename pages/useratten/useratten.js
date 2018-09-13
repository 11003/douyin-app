// pages/atten/atten.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attenArr: [
      { 
        headImg: "", 
        userName: "", 
        fans: "", 
        work: "", 
        info: "", 
        to_userid:"",
        fansShow: ""
      },
    ],
    id:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var userid = app.d.userid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/useratten',
      method: 'POST',
      data: { id: id },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var res = res.data;
        var attenArr =[];
        for(var i in res){
          attenArr.push({
            headImg:res[i].to_avatar,
            userName:res[i].to_username,
            fans: res[i].fans_counts,
            work: res[i].num,
            info: res[i].user_info,
            to_userid:res[i].to_userid,
            fansShow:true
          })
        }
        that.setData({
          attenArr: attenArr,
          id:id
        })
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
  cancleAtten(e){
    wx.showToast({
      title: '不允许操作',
      icon: 'none',
      duration: 500
    })
  },
  cancleAtten1(e) {
    var that = this;
    var idx = e.currentTarget.dataset.show;
    var id  = that.data.id;
    var userid = app.d.userid;
    var attenArr = that.data.attenArr;
    var to_userid = [];
    for (var i in attenArr){
      to_userid.push(attenArr[i].to_userid);
    }
    if (that.data.attenArr[idx].fansShow == true) {
      wx.request({
        url: app.d.ceshiUrl  + '/Api/Userinfo/delete',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data:{id:id,to_userid:to_userid[idx]},
        success:function(res){
          that.data.attenArr[idx].fansShow = false
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }
      })
    } else {
      that.data.attenArr[idx].fansShow = true
    }
    that.setData({
      attenArr: that.data.attenArr
    })
  }
})