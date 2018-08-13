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
    post_content:'',
    post_desc:'',
    avatar:'',
    comment_count:'',
    voice:'',
    user_nickname:'',
    id:'',
    user_id:'',
    arid:'',
    url:'',
    thumbnail:'',
    current: 0,
    pages: 0,
    page: 1,
    subjectList:[],
    showBtn: false,
    timeLen: 60,
    navCurrent: 0,
    love: '',
    post_like:'',
    collectShow: '',
    demo:'',
  },
  onLoad: function (options) {
    //提起下拉的视频
    this.loadData(1, this.changeSubject);
    var that = this;
    var userid = app.d.userId;
    var arid = that.data.arid;
    var demo = that.data.demo;
    //console.log(userid);
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/index',
      method: 'POST',
      data:{demo:1},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        wx.request({
          url: app.d.ceshiUrl + '/Api/message/info',
          method: 'POST',
          data: { voice : 1},
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success:function(res){
           
            that.setData({
              voice: res.data.post_content
            })
            
          }
        })
        var res=res.data;
        //console.log(res);
        that.setData({
          //页面一加载就出现的信息 id就是user_id
          post_content: res[0].post_content,
          post_desc: res[0].post_desc,
          post_like:res[0].post_like,
          avatar: res[0].avatar,
          comment_count: res[0].comment_count,
          user_nickname: res[0].user_nickname,
          user_id: res[0].user_id,
          id: res[0].id,
          arid:res[0].arid,
          url: res[0].post_content,
          thumbnail: res[0].thumbnail,
          subjectList: res,
          love:res[0].love,
          collectShow: res[0].collectShow
        })
        //console.log("shipin");
      
        console.log(res);
      },
      fail:function(e){
        wx.showToast({
          title: '请先登录!',
          duration: 2000,
          icon: 'loading'
        })
      }
    });
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
    var that = this;
    var url = that.data.url;  //视频地址
    var arid = that.data.arid;  //视频ID
    var userid = that.data.user_id; //用户id
    var love = that.data.love;  //点赞状态
    // console.log("arid"+arid);
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/index',
      method: 'POST',
      data: { url: url, arid: arid, userid: userid, love: love, demo:2},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        that.setData({
          love:res.data
        })
        //console.log(res);
      }
    })
    
  },

  // 收藏
  toCollect(e){
    var that = this;
    var url = that.data.url;  //视频地址
    var arid = that.data.arid;  //视频ID
    var userid = that.data.user_id; //用户id
    var collectShow = that.data.collectShow;  //收藏状态
    var thumbnail = that.data.thumbnail; //图片
    var user_nickname = that.data.user_nickname; //用户名
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/favorite',
      method: 'POST',
      data: { url: url, arid: arid, userid: userid, collectShow: collectShow, thumbnail: thumbnail, user_nickname: user_nickname},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title:res.data.msg,
          icon: "none",
          duration: 2000
        })
        that.setData({
          collectShow: res.data
        })
        console.log(res);
      }
    })
  },
  // cancleCollect(e) {
  //   this.setData({
  //     collectShow: true
  //   })
  // },
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
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
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
    if (current < 0){
      current=0;
    }
    var that = this;
    current = current || 0;
    var list = this.data.subjectList;
    if (list.length <= current) {
      return;
    }
    //视频播放量
    var url = list[current].post_content;
    var arid = list[current].arid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/index/setinc',
      method: 'POST',
      data: {url:url},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){

      }
    })
    this.setData({
      current: current,
      id: list[current].id,
      user_id: list[current].user_id,
      post_content: list[current].post_content,
      post_desc: list[current].post_desc,
      avatar: list[current].avatar,
      post_like: list[current].post_like,
      post_collect: list[current].post_collect,
      comment_count: list[current].comment_count,
      user_nickname: list[current].user_nickname,
      url: list[current].post_content,
      arid: list[current].arid,
      love:list[current].love,
      thumbnail: list[current].thumbnail,
      collectShow: list[current].collectShow,
    })
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
  //授权按钮
  bindGetUserInfo: function (e) { 
    console.log('用户点击按授权按钮index.js+272');   
    //e.detail.userInfo 用户信息 
    if (e.detail.userInfo){
      app.getUserInfo();
      var user = e.detail.userInfo;
      // 用户 : 用户名
      console.log(user.province);
    }
  }
})

// 获取第一个应用
function getRecommendList(opt) {
  console.log("第一个调用");
}
 



