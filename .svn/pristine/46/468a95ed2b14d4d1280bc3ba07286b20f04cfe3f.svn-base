// pages/indexComment/indexComment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentArr: [
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      },
      {
        headImg: "/images/head.png",
        name: "心是i",
        content: "你陪我一程，我念你一生。",
        like: 3119,
        show: false
      }
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
  addLike(e) {
    var id = e.currentTarget.dataset.id;
    var arr = this.data.commentArr;
    if (arr[id].show == false) {
      arr[id].show = true;
      arr[id].like++;
    }
    this.setData({
      commentArr: arr
    })
  },
  deleteLike(e) {
    var id = e.currentTarget.dataset.id;
    var arr = this.data.commentArr;
    if (arr[id].show == true) {
      arr[id].show = false;
      arr[id].like--;
    }
    this.setData({
      commentArr: arr
    })
  }
})