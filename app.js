//app.js
App({

  d: {
    ceshiUrl: "https://ssl.demenk.com/dyxcx/public/index.php",
    userId:'',
  },
  globalData: {
    userInfo: null
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch1:function(){
    
  },

  onLaunch: function () {
    var that =this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
  },
  
  //获取缓存
  isLogin: function (e) {
    try {
      var value = wx.getStorageSync('user');
      if (value) {
        this.globalData.userInfo = value;
        var userId = this.globalData.userInfo.ID;
        this.d.userId = userId;
      } else {
        wx.redirectTo({
          url: '/pages/wxLogin/wxLogin',
        });
        return false;
      }
    } catch (e) {
      wx.redirectTo({
        url: '/pages/wxLogin/wxLogin',
      });
      return false;
    }
  },

 
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

})
