// pages/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    searchNav:[
      { name: "视频" },
      { name: "用户" }
    ],
    searchVideo:[
      { img: "", title: "", num: "", url:"" , id:""},
    ],
    searchUser:[
      { headImg: "", userName: "", fans: "", work: "", info: "", isshow: ""},
    ],
    i:"",

    show: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    //所有视频
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/index',
      method:'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        var user = res.data;
        var searchVideo= [];
        for (var i in user.thumbnail){
          var img = [];
          if (user.thumbnail[i].length == 1) {
            img.push(user.thumbnail[i][0])
          } else {
            img.push(user.thumbnail[i][0])
          }
          searchVideo.push({
            img: img,
            title:user.post_desc[i],
            url: user.post_content[i],
            id: user.id[i],
            num: user.num[i]
          });
        }
        //console.log(searchVideo);
        that.setData({
          searchVideo: searchVideo
        })
      }
    })
    //所有用户
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/user',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = res.data;
        var searchUser = [];
        for (var i in user) {
          searchUser.push({
            headImg: user[i].avatar,
            userName: user[i].user_nickname,
            fans: user[i].fans_counts,
            work: user[i].num,
            id: user[i].id,
            info: user[i].user_info,
          });
        }
        that.setData({
          searchUser: searchUser
        })
      }
    })
  },
  /**
   * 搜索
   */
  formSubmit:function(e){
    var that =this;
    var cid = that.data.i;
    var userid = app.d.userId;
    var keywords = e.detail.value.keywords;
    if (keywords.length == 0) {
      wx.showToast({
        title: "搜索内容为空",
        duration: 2000,
        icon:'none',
      });
      that.onLoad;
    }
    if(cid == ''){
      cid=1;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/keywords',
      method: 'POST',
      data: { keywords: keywords, cid: cid, userid: userid },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var user = res.data;
        var searchVideo = [];
        for (var i in user.thumbnail) {
          searchVideo.push({
            img: user.thumbnail[i],
            title: user.post_desc[i],
            url: user.post_content[i],
            id: user.id[i],
            num: user.num[i]
          });
        }
        var searchUser = [];
        for (var i in user.avatar) {
          searchUser.push({
            headImg: user.avatar[i],
            userName: user.user_nickname[i],
            fans: user.fans_counts[i],
            work: user.num[i],
            id: user.id[i],
            info: user.user_info[i]
          });
        }
        if(cid == 1){
          that.setData({
            searchVideo: searchVideo
          })
        }else{
          that.setData({
            searchUser: searchUser
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
  
  },
  navbarTap: function (e) {
    var i = '';
    if (e.currentTarget.dataset.idx == 0){
      i=1;
    }else{
      i=2;
    }
    //console.log(i);
    this.setData({
      i:i,
      currentTab: e.currentTarget.dataset.idx
    })
  },
  toBack(e){
    wx.navigateBack({
      delta: 1
    })
  },
  toDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id=' + id,
    })
  },
  toUser(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
    })
  },
  //关注
  toConcern(e) {
    var that = this;
    var to_userid = e.currentTarget.dataset.id;  //我关注的人的id
    var userid = app.d.userId;  //我的id 
    var idx = e.currentTarget.dataset.idx; //索引
    var to_username = [];
    var to_avatar = [];
    var arr = that.data.searchUser;
    for (var i in arr) {
      to_username.push(arr[i].userName)
      to_avatar.push(arr[i].headImg)
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Concern/searchCon',
      method: 'POST',
      data: {
        userid: userid, to_userid: to_userid, to_username: to_username[idx],
        to_avatar: to_avatar[idx]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          });
        }
      }
    })

  },

})