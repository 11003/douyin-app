// pages/personInfo/personInfo.js
const app = getApp();

var t = 0;
var show = false;
var moveY = 200;

var area = require('../../utils/area.js')

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var index = [0, 0];

var cellId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg: "",  //头像
    yuan_headImg:"",

    picFile:"",   //二维码
    yuan_picFile:"",

    money: "",    //金额
    
    address:"",   //地址
    
    username: "", //用户名
    age: "",
    profile: "",  //个人介绍
    sexArr: [
      { name: "baomi" ,info: "保密",value:0 },
      { name: "male", info: "男",value:1},
      { name: "female", info: "女",value:2 }
    ],
    sexTxt: "",
    noImg: "",
    code:'',
    Img:'',

    show: show,

    value: [0, 0],

    save_province: "",
    save_city: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    cellId = options.cellId;
    var that = this;
    var date = new Date()
    //打印出年月日
    console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");

    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });

    //获取用户信息
    var userid = app.d.userId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/user/message',
      method: 'POST',
      data:{'userid' : userid},
      header:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        var user = res.data;
        that.setData({
          username :user.user_nickname,
          age: user.age,
          money: user.balance,         //金额
          profile: user.user_info,     //个性签名
          headImg: user.avatar,        //头像
          yuan_headImg:user.avatar,    //原頭像
          picFile: user.wx_code,       //微信二维码
          yuan_picFile: user.wx_code,   //原微信二维码
          save_province: user.user_provinces,
          save_city: user.user_citys,
        });
        //二維碼圖標
        if (user.wx_code){
          that.data.noImg = false
        }else{
          that.data.noImg = true
        }
        that.setData({
          noImg: that.data.noImg
        })
        //性別
        if(user.sex == 0){
          that.data.sexTxt = '保密'
        }else if(user.sex == 1){
          that.data.sexTxt = '男'
        }else{
          that.data.sexTxt = '女'
        }
        that.setData({
          sexTxt: that.data.sexTxt
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          icon:'loading'
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  toRecharge(e){
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  toWithdraw(e){
    wx.navigateTo({
      url: '/pages/withdraw/withdraw',
    })
  },
  bindSexChange: function (e) {
    var id = e.detail.value;
    var sex = this.data.sexArr[id].info;
    var sexvalue = this.data.sexArr[id].value;
    this.setData({
      sexTxt: sex
    });
  },

  
  //用户头像
  chooseHead:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        that.setData({
          headImg: tempFilePaths,
          Img:1
        })
      }
    })
  },
  //微信二维码
  chooseImg:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      // 图片地址
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths); 获取图片途径
        that.setData({
          picFile: tempFilePaths,
          noImg: '',
          Img:2,
        })
      }
    })
  },
  /**
   * 用户修改按钮
   */
  formSubmit: function (e) {
    var that = this;
    var info = e.detail.value;
    var userid = app.d.userId;
    info.userid = app.d.userId; //用户id
    var headImg = that.data.headImg[0]; //頭像 h值
    var picFile = that.data.picFile[0]; //二維碼

    var headUrl = that.data.headImg; //頭像網址
    var picUrl = that.data.picFile; //二維碼網址
    var Img = that.data.Img;
    info.save_province = that.data.save_province;
    info.save_city = that.data.save_city;
    var province = info.save_province;
    var city = info.save_city;
    var address = info.address;
    var userName = info.userName;
    var profile = info.profile;
    var sex = info.sex;
    var age = info.age;
    //console.log(info); //返回用户所有值
    if (userName.length == 0) {
      wx.showToast({
        title: "名称不能为空",
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    if (age.length == 0) {
      wx.showToast({
        title: "年龄不能为空",
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    var reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
    if (!reg.test(age)) {
      wx.showToast({
        title: "年龄格式错误",
        duration: 2000,
        icon: 'none'
      });
      return false
    }

    // 准备上传
    //如果用戶更改了頭像并也修改了二維碼才會觸發
    if (that.data.yuan_headImg != headUrl && that.data.yuan_picFile != picUrl) {
      wx.uploadFile({
        url: app.d.ceshiUrl + '/Api/Profile/photo',
        filePath: that.data.headImg[0],
        formData: { userid: userid },
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success:function(res){
          wx.uploadFile({
            url: app.d.ceshiUrl + '/Api/Profile/photo',
            filePath: that.data.picFile[0],
            formData: { userid: userid },
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success:function(res){
              var arrpicFile = JSON.parse(res.data);
              if (arrpicFile.status != 1) {
                wx.showToast({
                  title: '上傳失敗',
                  icon: 'none',
                  duration: 2000
                });
                return false;
              }
              var picFile = arrpicFile.code;
              wx.request({
                url: app.d.ceshiUrl + '/Api/User/picFile',
                method: 'POST',
                data: {
                  userid: userid,
                  province: province,
                  city: city,
                  address: address,
                  userName: userName,
                  profile: profile,
                  sex: sex,
                  age: age,
                  picFile: picFile
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data.status != 1) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    });
                    return false;
                  }
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                  });
                  setTimeout(function () {
                    wx.reLaunch({
                      url: "/pages/person/person"
                    })
                  }, 2000);
                }
              })
            }
          });
          var arrheadImg = JSON.parse(res.data);
          if (arrheadImg.status != 1) {
            wx.showToast({
              title: '上傳失敗',
              icon: 'none',
              duration: 2000
            });
            return false;
          }
          //返回頭像路徑
          var headImg = arrheadImg.code;
          wx.request({
            url: app.d.ceshiUrl + '/Api/User/headImg',
            method: 'POST',
            data: {
              userid: userid,
              province: province,
              city: city,
              address: address,
              userName: userName,
              profile: profile,
              sex: sex,
              age: age,
              headImg: headImg,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success:function(res){
              if (res.data.status != 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                });
                return false;
              }
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              });
              setTimeout(function () {
                wx.reLaunch({
                  url: "/pages/person/person"
                })
              }, 2000);
            },
            fail:function(e){
              wx.showToast({
                  title: '网络异常！',
                  duration: 2000
              });
            }
          })
        }
      })
    }
    //如果用戶更改了其中一項才會觸發
    else if (that.data.yuan_headImg != headUrl || that.data.yuan_picFile != picUrl){
      if (Img == 1) {
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/Profile/photo',
          filePath: that.data.headImg[0],
          name: 'file',
          formData: { userid: userid },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var arr1 = JSON.parse(res.data);
            if (arr1.status != 1) {
              wx.showToast({
                title: arr1.msg,
                icon: 'none',
                duration: 2000
              });
              return false;
            }
            //返回頭像路徑
            var headImg = arr1.code;
            var picUrl = that.data.picFile;
            wx.request({
              url: app.d.ceshiUrl + '/Api/User/edit',
              method: 'POST',
              data: {
                Img: 1,
                userid: userid,
                province: province,
                city: city,
                address: address,
                userName: userName,
                profile: profile,
                sex: sex,
                age: age,
                headImg: headImg,
                picUrl: picUrl
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status != 1) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                  });
                  return false;
                }
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.reLaunch({
                    url: "/pages/person/person"
                  })
                }, 2000);
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  duration: 2000
                });
              }
            });
          }
        })

      } else if (Img == 2) {
        //用戶上傳了二維碼
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/Profile/photo',
          filePath: that.data.picFile[0],
          name: 'file',
          formData: { userid: userid },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var arr2 = JSON.parse(res.data);
            if (arr2.status != 1) {
              wx.showToast({
                title: arr2.msg,
                icon: 'none',
                duration: 2000
              });
              return false;
            }
            //返回二維碼路徑
            var picFile = arr2.code;
            wx.request({
              url: app.d.ceshiUrl + '/Api/User/edit',
              method: 'POST',
              data: {
                Img: 2,
                userid: userid,
                province: province,
                city: city,
                profile: profile,
                address: address,
                userName: userName,
                sex: sex,
                age: age,
                picFile: picFile,
                headUrl: headUrl,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status != 1) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                  });
                  return false;
                }
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.reLaunch({
                    url: "/pages/person/person"
                  })
                }, 2000);
              },
              fail:function(e){
              wx.showToast({
                  title: '网络异常！',
                  duration: 2000
              });
            }
            })
          }
        })
      }
    }
    // 用戶只想修改文字信息
    else{
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/editTxt',
        method: 'POST',
        data: {
          userid: userid,
          province: province,
          city: city,
          profile: profile,
          address: address,
          userName: userName,
          sex: sex,
          age: age,
          picUrl: picUrl,
          headUrl: headUrl,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status != 1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
            return false;
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
          setTimeout(function () {
            wx.reLaunch({
              url: "/pages/person/person"
            })
          }, 2000);
        },
        fail:function(e){
          wx.showToast({
              title: '网络异常！',
              duration: 2000
          });
        }
      })
    }

  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);
  },
  //滑动事件
  bindCityChange(e){
    var val = e.detail.value;
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      getCityArr(val[0], this);//获取地级市数据
    }
    index = val;
    this.setData({
      value: [val[0], val[1]],
      save_province: provinces[val[0]].name,
      save_city: citys[val[1]].name
    })
  },
  //隐藏弹窗浮层
  hiddenFloatViewNO(e) {
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
  },
  hiddenCityViewOK(e) {
    console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);

    this.setData({
      province: this.data.save_province,
      city: this.data.save_city,
    })
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
  onUnload: function (option) {
    
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



//动画事件
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })
}
// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  that.setData({
    province: that.data.save_province,
    city: that.data.save_city,
  })
}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    // city: "",
    citys: citys,
    // value: [count, 0, 0]
  })
}