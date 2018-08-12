//index.js
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

    current: 0,
    pages: 0,
    page: 1,
    subjectList: [
      {
      id: "",
      post_content: "",
      avatar: "",
      post_like: "",
      post_collect: "",
      comment_count: "",
      user_nickname: "",
      post_desc: "",
      voice: "",
    },
    ],
    showBtn: false,
    timeLen: 60,
    navCurrent: 0,
    love: true,
    collectShow: true
  },
  onLoad: function (options) {
    this.loadData(1, this.changeSubject);
    var that = this;
    var user_id = app.d.userId;
    var id = options.id;   //文章所属id  data-id
    wx.request({
      url: app.d.ceshiUrl + '/Api/video/index',
      method: 'POST',
      data: { user_id:user_id, id :id},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var video = res.data;
        that.setData({
          avatar: video.avatar,
          post_content: video.post_content,
          post_like:video.post_like,
          post_collect: video.post_collect,
          comment_count: video.comment_count,
          user_nickname: video.user_nickname,
          post_desc: video.post_desc,
        })
      },
      fail:function(e){
        wx.showToast({
          title: '请先登录!',
          duration: 2000,
          icon: 'loading'
        })
      }
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/message/info',
      method: 'POST',
      data: { voice:1 },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        that.setData({
          voice: res.data.post_content
        })
      }
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
  recommendShow(e){
    this.setData({
      navCurrent: 0
    })
  },
  Surrounding(e){
    this.setData({
      navCurrent: 1
    })
  },
  // 点赞
  toLike(e){
    this.setData({
      love: false
    })
  },
  cancleLike(e){
    this.setData({
      love: true
    })
  },
  // 收藏
  toCollect(e){
    this.setData({
      collectShow: false
    })
  },
  cancleCollect(e) {
    this.setData({
      collectShow: true
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
    wx.navigateTo({
      url: '/pages/indexComment/indexComment',
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
    wx.navigateTo({
      url: '/pages/person/person',
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
    current = current || 0;
    var list = this.data.subjectList;
    if (list.length <= current) {
      return;
    }
    this.setData({
      current: current,
      subject: list[current]
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
    // console.log("touchstart ", e.changedTouches[0])
  },

  touchmove: function (e) {
    // console.log("touchmove ", e.changedTouches[0])
  },

  touchend: function (e) {
    // console.log("touchend ", e.changedTouches[0])
    this.getDirect(start, e.changedTouches[0]);
  },

  touchcancel: function (e) {
    // console.log("touchcancel ", e.changedTouches[0])
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
})

// 获取第一个应用
function getRecommendList(opt) {
  console.log("第一个调用");
}
 



