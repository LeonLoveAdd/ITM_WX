//index.js
//获取应用实例
var app = getApp()
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    // 图片地址
    imgUrls: [
      '../image/5.jpg',
      '../image/5.jpg',
      '../image/5.jpg',
    ],
    //是否显示面板指示点
    indicatorDots: true,
    //自动播放
    autoplay: false,
    //切换时间间隔
    interval: 4000,
    //滑动时长
    duration: 1000,
    //存放滑动视图的current
    current: 0,
    //分页标签class条件判断的值
    tabArr: {
      tabCurrentIndex: 0
    }
  },
  //事件处理函数
  //触摸分页标签触发事件
  veHandle: function (e) {
    //每个分页标签都设置了data-index,触摸触发事件获取此数值
    //用此数值替换滑动视图的current
    //用此数值替换分页标签class判断的值
    console.log(e.target.dataset.index)
    var currentIndex = e.target.dataset.index
    this.setData({
      current: currentIndex,
      "tabArr.tabCurrentIndex": currentIndex
    })
  },
  //通过滑块视图的current改变触发事件
  swiperChange: function (e) {
    //获取视图滑块当前的current
    //用此数值替换分页标签的current的值
    console.log(e.detail.current)
    var swiperCurrent = e.detail.current;
    this.setData({
      'tabArr.tabCurrentIndex': swiperCurrent
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '分页测试',
    })
  },
  //开始录音的时候
  start: function () {
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      wx.uploadFile({
        url: 'http://172.16.1.92:9998/ITManagement/uploadFromWx', //仅为示例，非真实的接口地址
        filePath: res.tempFilePath,
        name: "file",
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          "user": "test",
        },
        success: function (res) {
          var data = res.data
          console.log(data)
          //do something
        }
      })
      console.log('文件', res)
    })
  },
  //播放声音
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
})