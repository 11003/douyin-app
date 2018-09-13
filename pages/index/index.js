//获取应用实例
const app = getApp();
// http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400
var start;
Page({
  data: {
    // videoArr:[{}],
    videoCtx: null,
    isPlay: true,
    percent: 0,
    subject: [],
    current: 0,
    pages: 0,
    page: 1,
    icons:'',

    subjectList: [],
    id: '',
    url: '',
    headImg: "",
    like: "",
    collect: "",
    comment: "",
    voice: "",
    name: "",
    commit: "",
    user_id:'',
    thumbnail:'',
    list_arid:'',

    showBtn: false,
    timeLen: 60,
    navCurrent: 0,
    love: '',
    favorite:'',
    collectShow: '',

    
  },
  onLoad: function (options) {
    app.isLogin();
    this.loadData(1, this.changeSubject);
    var that = this;
    //首页通知
    that.Comment();
    wx.request({
      // 必需
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        var res = res.data;
        that.setData({
          subjectList: res,
          id: res[0].arid,
          url: res[0].post_content,
          headImg: res[0].avatar,
          like: res[0].post_like,
          collect: res[0].post_favorites,
          comment: res[0].comment_count,
          commit:res[0].post_desc,
          name: res[0].user_nickname,
          user_id: res[0].user_id,
          thumbnail: res[0].thumbnail,
        })
        that.Zan();
        that.ShouCang();
      },
    })
  },
  onReady: function() {
    this.videoCtx = wx.createVideoContext('myVideo');
  },
  toSearch(e) {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //點讚
  Zan:function(){
    var that = this;
    var userid = app.d.userId;
    var arid = that.data.id;  //视频ID
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/zan',
      method: 'POST',
      data: { userid: userid, arid: arid,icons:1},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            love: 0
          })
        } else {
          that.setData({
            love: 1
          })
          return false;
        }
      }
    })
  },
  //收藏圖標高亮
  ShouCang:function(){
    var that = this;
    var userid = app.d.userId;
    var arid = that.data.id;  //视频ID
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/zan',
      method: 'POST',
      data: { userid: userid, arid: arid, icons: 2 },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            collectShow: 0
          })
        } else {
          that.setData({
            collectShow: 1
          })
          return false;
        }
      }
    })
  },
  //通知
  Comment:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/message/info',
      method: 'POST',
      data: { voice: 1 },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        that.setData({
          voice: res.data.post_content
        })
      }
    })
  },
  //推荐
  recommendShow(e){
    this.setData({
      navCurrent: 0
    })
  },
  //周边
  Surrounding(e){
    this.setData({
      navCurrent: 1
    })
  },
  // 点赞
  toLike(e){
    var that = this;
    //登陆进来的用户id
    var LoginUserid = app.d.userId;
    var url = that.data.url;  //视频地址
    var arid = that.data.id;  //视频ID
    var user_id = that.data.user_id; //发布者id
    var love = that.data.love;  //点赞状态
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/tolike',
      method: 'POST',
      data: { url: url, arid: arid, LoginUserid: LoginUserid, user_id:user_id, love: love },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: 'none'
        });
        that.setData({
          love: res.data.status
        })
        that.onLoad();
      }
    })
  },
  
  // 收藏
  toCollect(e){
    var that = this;
    var LoginUserid = app.d.userId;//登陆进来的用户id
    var url = that.data.url;  //视频地址
    var arid = that.data.id;  //视频ID
    var url = that.data.url; //视频地址
    var thumbnail = that.data.thumbnail //视频封面图
    var user_id = that.data.user_id; //作者id
    var name = that.data.name //作者名称
    var collectShow = that.data.collectShow; //收藏状态
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/toCollect',
      method: 'POST',
      data: {
        LoginUserid: LoginUserid,
        url: url,
        arid: arid,
        thumbnail: thumbnail,
        user_id: user_id,
        name: name,
        collectShow: collectShow
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: 'none'
        });
        that.setData({
          collectShow: res.data.status
        })
        that.onLoad();
      }
    })
  },
  // 购买
  radioSelect(e) {
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.items.length;i++){
      this.data.items[i].checked = false;
    }
    this.data.items[id].checked = true;
    this.setData({
      items: this.data.items
    })
  },
  radioChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  toBuy(e){
    wx.navigateTo({
      url: '/pages/indexBuy/indexBuy',
    })
  },
  // 评论
  toComment(e){
    var to_userid = e.currentTarget.dataset.to_userid;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/indexComment/indexComment?id=' + id+'&to_userid='+to_userid,
    })
  },
  play: function () {
    if (this.data.isPlay) {
      this.videoCtx.pause();
    } else {
      this.videoCtx.play()
    }
  },
  bindPlay() {
    this.setData({
      isPlay: true
    })
  },
  bindPause() {
    this.setData({
      isPlay: false
    })
  },
  ended() {
    this.videoCtx.seek(0);  //重新播放
  },
  imgTap(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id='+id,
    })
  },
  loadData: function (page, success) {
    var that = this;
    this.setData({
      page: page
    })
    getRecommendList({
      data: {
        page: page,
        rows: 5,
        type: 'video'
      },
      success: function (res) {
        var list = res.content;
        if (list) {
          var listData = [];
          for (var i = 0; i < that.data.subjectList.length; i++) {
            listData.push(that.data.subjectList[i])
          }
          for (var i = 0; i < list.length; i++) {
            listData.push(list[i])
          }
          that.setData({
            count: res.count,
            page: page,
            pages: res.pages,
            subjectList: listData
          })
          if (success) {
            success();
          }
        }
      }
    })
  },
  changeSubject: function (current) {
    var that = this;
    if (current < 0) {
      current = 0;
      wx.showToast({
        title: '请下滑',
        duration: 2000,
        icon: 'none'
      })
    }
    current = current || 0;
    var list = this.data.subjectList;
    if (list.length <= current) {
      return;
    }
    var url = list[current].post_content;
    var arid = list[current].arid;
    var love = list[current].love;
    var userid = app.d.userId;
    //點讚圖標
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/zan',
      method: 'POST',
      data: { arid: arid, userid: userid, icons:1},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: (res) => {
        if(res.data.length == 0){
          that.setData({
            love:0
          })
        }else{
          that.setData({
            love: 1
          })
        }
      }
    })
    //收藏
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/zan',
      method: 'POST',
      data: { arid: arid, userid: userid, icons:2 },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: (res) => {
        if (res.data.length == 0) {
          that.setData({
            collectShow: 0
          })
        } else {
          that.setData({
            collectShow: 1
          })
        }
      }
    })
    //视频播放量
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/setinc',
      method: 'POST',
      data: { url: url },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:(res)=>{}
    })
    that.setData({
      current: current,
      subject: list[current],
      id: list[current].arid,
      url: list[current].post_content,
      headImg: list[current].avatar,
      like: list[current].post_like,
      collect: list[current].post_favorites,
      comment: list[current].comment_count,
      commit: list[current].post_desc,
      name: list[current].user_nickname,
      user_id: list[current].user_id,
      thumbnail: list[current].thumbnail,
    })
    // 自动加载
    var diff = list.length - current;
    if (diff <= 5) {
      this.loadData(this.data.page + 1);
    }
  },
  // 视频播放时间更新
  timeupdate: function (e) {
    var val = e.detail.currentTime;
    var max = e.detail.duration;
    var percent = Math.round(val / max * 10000) / 100;
    this.setData({ percent: percent })
  },
  // 播放上一个抖音
  pre: function () {
    this.changeSubject(this.data.current - 1);
  },

  // 播放下一个抖音
  next: function () {
    this.changeSubject(this.data.current + 1);
  },

  // 下面主要模仿滑动事件
  touchstart: function (e) {
    start = e.changedTouches[0];
  },

  touchmove: function (e) {
  },

  touchend: function (e) {
    this.getDirect(start, e.changedTouches[0]);
  },

  touchcancel: function (e) {
    this.getDirect(start, e.changedTouches[0]);
  },

  // 计算滑动方向
  getDirect(start, end) {
    var X = end.pageX - start.pageX,
      Y = end.pageY - start.pageY;
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      console.log("right");
    }
    else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      console.log("left");
    }
    else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
      console.log("bottom");
      this.pre();
    }
    else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
      console.log("top");
      this.next()
    }
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
})

// 获取第一个应用
function getRecommendList(opt) {
  console.log("getRecommendList...")
  wx.request({
    url: '',
    data: opt.data || {
      page: 1,
      rows: 5
    },
    success: opt.success
  })
}