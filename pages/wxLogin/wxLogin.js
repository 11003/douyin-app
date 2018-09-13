// pages/wxLogin/wxLogin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击授权
  getUserInfo:function(e){
    if (e.detail.userInfo){
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var user_info = e.detail.userInfo;
      wx.login({
        success: function (res) {
          var code = res.code;
          if(code){
            wx.getUserInfo({
              success:function(res){
                wx.request({
                  url: app.d.ceshiUrl + "/Api/Login/getsessionkeys",
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    "code": code,
                    "encryptedData": res.encryptedData,
                    "iv":res.iv,
                  },
                  success: function (res) {
                    var open_id = res.data.openid;
                    wx.request({
                      url: app.d.ceshiUrl + "/Api/Login/authlogin",
                      method: 'POST',
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      data:{
                        "openid": open_id,
                        "NickName":user_info.nickName,
                        "HeadUrl": user_info.avatarUrl,
                        "Gender": user_info.gender,
                        "UserCity": user_info.city,
                      },
                      success:function(res){
                        //console.log(res);
                        if(res.data.status == 1){
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                          });
                          wx.setStorageSync("user", res.data.arr);
                          setTimeout(function () {
                            wx.reLaunch({
                              url: "/pages/index/index"
                            })
                          }, 2000);
                        }
                      }
                    })
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: '获取失败',
                      icon: "none"
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
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
  //授权登陆
  weixinlogin:function(e){
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              var user_info = res.userInfo;
              wx.login({
                success: function (res) {
                  var code = res.code;
                  if (code) {
                    wx.request({
                      url: app.d.ceshiUrl + "/Api/Login/getsessionkeys",
                      method: 'post',
                      data: { "code": code },
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        var open_id = res.data.openid;
                        wx.request({
                          url: app.d.ceshiUrl + "/Api/Login/authlogin",
                          method: 'post',
                          data: {
                            "openid": open_id,
                            "HeadUrl": user_info.avatarUrl,
                            "Gender": user_info.gender,
                            "NickName": user_info.nickName,
                            "UserCity": user_info.city,
                          },
                          header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          success: function (res) {
                            var that = this;
                            wx.setStorageSync("user", res.data.arr);
                            wx.showToast({
                              title: res.data.msg,
                              icon: 'success',
                              duration: 2000
                            });
                            setTimeout(function () {
                              wx.reLaunch({
                                url: "/pages/index/index"
                              })
                            }, 2000);
                          }
                        })
                      },
                      fail: function (res) {
                        wx.showToast({
                          title: '获取失败',
                          icon: "none"
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '登录失败，请重新登录',
                      icon: "none"
                    })
                  }
                }
              });
            }
          })
        }
      }
    })
  },
 
})