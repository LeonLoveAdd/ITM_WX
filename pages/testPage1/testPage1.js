//index.js
//获取应用实例
const app = getApp()

Page({
  onLoad: function (options) {
    this.setData({
      title: options.title
    })
  },
  getPhoneNumber: function (e) {
    // 参数e是绑定的授权方法自动传入过来的, 主要是为了拿到vi和encryptedData值从后台换取用户联系方式
    if ("getPhoneNumber:ok" != e.detail.errMsg) {
      wx.showToast({
        icon: 'none',
        title: '快捷登陆失败'
      })
      return;
    }
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    // this.data.wxCode, 定义wxCode变量，并在onShow()方法中调用小程序login方法获取code值赋予this.data.wxCode
    var code = this.data.wxCode;
    var _this = this;
    //调用后台接口获取用户手机号码
    api.sendPost({
      url: api.decode_phone,
      params: {
        encrypted: encryptedData,
        iv: iv,
        code: code
      },
      success: function (data) {
        // 获取到的手机号码
        var phone = data.phone;
      },
      fail: function (msg) {
      }
    })
  },
  data: {
    motto: 'Hello World',
    view: 'MINA',
    array: [1, 2],
    object: {
      key: 'Hello '
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // staffA: { firstName: 'Hulk', lastName: 'Hu' },
    // staffB: { firstName: 'Shang', lastName: 'You' },
    // staffC: { firstName: 'Gideon', lastName: 'Lin' }
    item: {
      index: 0,
      msg: 'this is a template',
      time: '2016-09-15'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  ToPage1: function () {
    wx.navigateTo({
      url: '../testPage1/testPage1'
    })
  },
  ToPage2: function () {
    wx.navigateTo({
      url: '../testPage2/testPage2'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
