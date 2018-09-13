// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    navbar: [
      { name: "图片", num: "" },
      { name: "收藏", num: "" },
      { name: "作品", num: "" }
    ],
    user_id:"",
    avatar : "",
    name: "",
    info: "",
    address: "",
    sex: "",
    age: "",
    code: "",
    love: "",
    fans: "",
    atten: "",
    userinfoid:"",
    labelArr: [
      { name: ""}
    ],
    photoArr: [
      { src: ""},
    ],
    collectArr: [
      { src: "", num: "", url: "", id: "", object_id:"" },
    ],
    worksArr: [
      { src: "", num: "",url:"",id:"" },
    ],

    show: false,
    fansShow: false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    var id = options.id
    //用户发布图片的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchpcount',
      method: 'POST',
      data: { id: id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[0].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    //用户发布视频的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchvcount',
      method: 'POST',
      data: { id: id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[2].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    
    //用戶收藏的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchfcount',
      method: 'POST',
      data: { id: id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[1].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    //用户所有信息和他发布的所有作品
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchinfo',
      method: 'POST',
      data: { userid: userid,id:id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = res.data;
        //用戶標籤
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/sreachlabellimit',
          method: 'POST',
          data: { id: id },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              labelArr: res.data,
            })
          }
        })
        //用戶收藏
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/sreachUserFavorite',
          method: 'POST',
          data: { id:id },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var user = res.data;
            var collectArr = [];
            for (var i in user) {
              if (user[i].thumbnail.length == 1) {
                src.push(user[i][0].thumbnail)
              }else{
                for (var j in user[i].thumbnail) {
                  // console.log(user.thumbnail[i][j])
                  src.push(user[i][j].thumbnail)
                }
              }
              collectArr.push({
                src: src,
                url: user[i].url,
                id: user[i].id,
                object_id: user[i].object_id
              })
            }
            that.setData({
              collectArr: collectArr
            })
          }
        })
        //遍历用户发布的所有图片
        var photoArr = [];
        for (var i in user.thumbnail) {
          var src = [];
          if (user.thumbnail[i].length == 1) {
            src.push(user.thumbnail[i][0])
          } else {
            for (var j in user.thumbnail[i]) {
              // console.log(user.thumbnail[i][j])
              src.push(user.thumbnail[i][j])
            }
          }
          photoArr.push({
            src: src
          })
          //console.log(photoArr)
        }
      //遍历用户发布的所有视频
        var worksArr =[];
        for (var i in user.arid) {
          var src = [];
          if (user.thumbnail[i].length == 1) {
            src.push(user.thumbnail[i][0])
          } else {
            for (var j in user.thumbnail[i]) {
              // console.log(user.thumbnail[i][j])
              src.push(user.thumbnail[i][j])
            }
          }
          worksArr.push({
            src: src,
            num: user.num[i],
            url: user.post_content[i],
            id : user.arid[i]
          })
        }
        if(user == ''){
          wx.showToast({
            title: "该用户从未登陆过",
            duration: 2000,
            icon:'none'
          });
          setTimeout(function () {
            wx.reLaunch({
              url: "/pages/search/search"
            })
          }, 1000);
          return false;
        }else{
          that.setData({
            userinfoid: user.user_id,
            name: user.user_nickname,
            avatar: user.avatar,
            age: user.age,
            fans: user.fans_counts,
            atten: user.follow_counts,
            love: user.receive_like_counts,
            address: user.user_city,
            info: user.user_info,
            code: user.wx_code,
            photoArr: photoArr,
            worksArr: worksArr
          })
          that.setData({
            userinfoid: that.data.userinfoid
          })
          //性別
          if (user.sex == 0) {
            that.data.sex = '保密'
          } else if (user.sex == 1) {
            that.data.sex = '男'
          } else {
            that.data.sex = '女'
          }
          that.setData({
            sex: that.data.sex
          })
        }
      },
      fail: function (res) {

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
    var photoLen = this.data.photoArr.length;
    var collectLen = this.data.collectArr.length;
    var worksLen = this.data.worksArr.length;
    this.data.navbar[0].num = photoLen;
    this.data.navbar[1].num = collectLen;
    this.data.navbar[2].num = worksLen;
    this.setData({
      navbar: this.data.navbar
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    
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
  navbarTap(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  showSettings(e){
    this.setData({
      show: true
    })
  },
  closeShow(e){
    this.setData({
      show: false
    })
  },
  toAddLabel(e){
    wx.navigateTo({
      url: '/pages/label/label',
    })
  },
  attenPerson(e) {
    var that = this;
    var to_userid = that.data.userinfoid; //他
    var userid = app.d.userId;  //粉丝
    var fansShow = that.data.fansShow;
    console.log(fansShow);
    if (that.data.fansShow == false) {
      if (userid == to_userid){
        wx.showToast({
          title: '您不能关注自己',
          icon: 'none',
          duration: 500
        })
        return false;
      }
      that.data.fansShow = true;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Concern/searchCon',
        method: 'POST',
        data: {
          userid:userid,
          to_userid: to_userid,
          fansShow :fansShow
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:function(res){
          console.log(res.data);
          if (res.data) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        }
      })
    } else {
      that.data.fansShow = false;
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  cancleAtten(e) {
    var that = this;
    if (that.data.fansShow == true) {
      that.data.fansShow = false
      wx.showToast({
        title: '您已取消关注',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.fansShow = true
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  toFans(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userfans/userfans?id=' + id,
    }) 
  },
  toAtten(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/useratten/useratten?id=' + id,
    })
  },
  previewImg(e) {
    var id = e.currentTarget.dataset.id;
    var picList = [];
    for (var i = 0; i < this.data.photoArr[id].src.length; i++) {
      picList.push(this.data.photoArr[id].src[i]);
    }
    //console.log("这是图片"+picList)
    wx.previewImage({
      current: this.data.photoArr[id].src, // 当前显示图片的http链接
      urls: picList // 需要预览的图片http链接列表
    })
  },
  toDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id='+id,
    })
  },
  toFavorite(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id=' + id,
    })
  }
})
