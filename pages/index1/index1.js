//index.js
//获取应用实例
const app = getApp()
const aa = wx.createSelectorQuery()
var touchStartX = 0;//触摸时的原点 
var touchStartY = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 
var touchMoveX = 0; // x轴方向移动的距离
var touchMoveY = 0; // y轴方向移动的距离
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var animation;
// const pics = [];
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
var info;
//获取年
for (let i = 2018; i <= date.getFullYear() + 100; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}

Page({
  data: {
    inputValue: '', //搜索的内容
    home: "none",
    // 组件所需的参数
    // nvabarData: {
    //   showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
    //   title: '我的主页', //导航栏 中间的标题
    // },
    // 此页面 页面内容距最顶部的距离
    // height: app.globalData.height * 2 + 40,   
    selectArray: [{
      "id": "1",
      "text": "故障"
    }, {
      "id": "2",
      "text": "采购申请"
      }, {
        "id": "3",
        "text": "入库登记"
      }, {
        "id": "4",
        "text": "出库申领"
      }, {
        "id": "5",
        "text": "方案"
      }],
    modalArray: [{
      "id": "1",
      "text": "程序员1"
    }, {
      "id": "2",
        "text": "程序员2"
    }, {
      "id": "3",
        "text": "程序员3"
    }, {
      "id": "4",
        "text": "程序员4"
    }, {
      "id": "5",
        "text": "程序员5"
    }],
    itemlist: [
      {
        poster: '../image/yx.jpg',
        name: '通过选择故障类型形成模板标题',
        author: '业务部李四 2019-09-16派发',
        src: info,
      },
      {
        poster: '../image/yx.jpg',
        name: '通过选择故障类型形成模板标题',
        author: '业务部李四 2019-09-16派发',
        src: info,
      },
      {
        poster: '../image/yx.jpg',
        name: '通过选择故障类型形成模板标题',
        author: '业务部李四 2019-09-16派发',
        src: info,
      },
    ],
    startX: 0, //开始坐标
    startY: 0,
    arr: "block",
    time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    page1: "block",
    page2: "none",
    page3: "none",
    page_d: "block",
    page_c: "none",
    page_y: "none",
    lineColor1: "rgb(16, 240, 72)",
    lineColor2: "rgb(250, 247, 50)",
    lineColor3: "rgb(122, 122, 122)",
    userInfo: {},
    pics :[],
    transfer: "转接单页面",
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


  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.itemlist.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      itemlist: this.data.itemlist
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.itemlist.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 60) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
        v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      itemlist: that.data.itemlist
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var dX = end.X - start.X,
      dY = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(dY / dX) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.itemlist.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      itemlist: this.data.itemlist
    })
  },


  //打开透明层
  show: function () {
    this.setData({
      isTrue: true
    })
  },
  //关闭透明层
  hide: function () {
    this.setData({
      isTrue: false
    })
  },
  //打开透明层
  modalShow: function () {
    this.setData({
      isModalTrue: true
    })
  },
  //关闭透明层
  modalHide: function () {
    this.setData({
      isModalTrue: false
    })
  },

  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
    console.log('bindInput' + this.data.inputValue)

  },
  /**
   * 搜索执行按钮
   */
  query: function (event) {
    var that = this
    /**
     * 提问帖子搜索API
     * keyword string 搜索关键词 ; 这里是 this.data.inputValue
     * start int 分页起始值 ; 这里是 0
     */
    wx.request({
      url: 'https://localhost/proj_online_class/server/public/index.php/forum/forum/get_issue_search/' + this.data.inputValue + /0/,
      data: {
        inputValue: this.data.inputValue
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var searchData = res.data
        that.setData({
          searchData
        })
        /**
         * 把 从get_issue_searchAPI 
         * 获取 提问帖子搜索 的数据 设置缓存
         */
        wx.setStorage({
          key: 'searchLists',
          data: {
            searchLists: res.data
          }
        })
        /**
         * 设置 模糊搜索
         */
        if (!that.data.inputValue) {
          //没有搜索词 友情提示
          wx.showToast({
            title: '请重新输入',
            image: '../image/search.png',
            duration: 2000,
          })
        } else if (searchData.search.length == 0) {
          //搜索词不存在 友情提示
          wx.showToast({
            title: '关键词不存在',
            image: '../image/search.png',
            duration: 2000,
          })
        } else {
          //提取题目关键字 与搜索词进行匹配
          var searchIndex = searchData.search.length
          var d = 0;
          for (var i = 0; i <= searchIndex - 1; i++) {

            var searchTitle = searchData.search[d].title
            console.log(searchTitle)
            d = d + 1;

            for (var x = 0; x <= searchTitle.length; x++) {
              for (var y = 0; y <= searchTitle.length; y++) {
                var keyWord = searchTitle.substring(x, y);
                console.log(keyWord)
              }
            }

            /**
             * 根据关键词 跳转到 search搜索页面
             */
            wx.navigateTo({
              url: '../search/search',
            })
          }
        }
      }
    })
  },



  transfer1: function (e) {
    this.setData({
      home: "none"
    })
    wx.navigateTo({
      url: '../index1/index1'
    })
    // if (this.data.transfer == "转接单页面"){
    //   this.setData({
    //     transfer: "转发单页面",
    //     home: "none",
    //   })
    // } else {
    //   this.setData({
    //     transfer: "转接单页面",
    //     home: "none"
    //   })
    //   wx.navigateTo({
    //     url: '../index1/index1'
    //   })
    // }
  },

  // 触摸开始事件 
  touchStart: function (e) {
    touchStartX = e.touches[0].pageX; // 获取触摸时的原点 
    touchStartY = e.touches[0].pageY; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function (e) {
    touchMoveX = e.touches[0].pageX;
    touchMoveY = e.touches[0].pageY;
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    var moveX = touchMoveX - touchStartX
    var moveY = touchMoveY - touchStartY
    if (Math.sign(moveX) == -1) {
      moveX = moveX * -1
    }
    if (Math.sign(moveY) == -1) {
      moveY = moveY * -1
    }
    if (moveX <= moveY) {// 上下
      // 向上滑动
      if (touchMoveY - touchStartY <= -120 && time < 10) {
        this.setData({
          home: "none"
        })
      }
      // 向下滑动 
      if (touchMoveY - touchStartY >= 120 && time < 10) {
        this.setData({
          home: "block"
        })
      }
    } else {// 左右
      // 向左滑动
      if (touchMoveX - touchStartX <= -120 && time < 10) {
        // wx.navigateTo({
        //   url: '../testPage5/testPage5'
        // })
      }
      // 向右滑动 
      if (touchMoveX - touchStartX >= 120 && time < 10) {
        console.log('向右滑动');
      }
    }
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },

  pics: [],//图片
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })
  },
  //打开透明层
  show: function () {
    this.setData({
      isTrue: true
    })
  },
  //关闭透明层
  hide: function () {
    this.setData({
      isTrue: false
    })
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
  /**
   * 图片放大查看
   */
  previewImg: function (e) {

    var index = e.target.dataset.index;//当前图片地址
    var imgArr = e.target.dataset.list;//所有要预览的图片的地址集合 数组形式
    console.log(index, imgArr)
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
    })
  },
  /**
   * 图片上传
   * 
   */

  //上传图片开始
  chooseImg: function (e) {
    var that = this, pics = this.data.pics;
    console.log(pics);
    if (pics.length < 9) {
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 1000
          });
          for (var i = 0; i < tempFilePaths.length; i++) {
            pics.push(tempFilePaths[i]);
            wx.uploadFile({
              url: 'http://172.16.80.20:8080/ITM/uploadFromWx', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
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
          }
          console.log(pics);
          that.setData({
            pics: pics
          })
        },
      });
    } else {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none',
        duration: 3000
      });

    }
  },
  // 删除图片
  deleteImg: function (e) {
    var that = this;
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    console.log(pics)
    this.setData({
      pics: pics,
    })
  },
  // 预览图片
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  //获取时间日期
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    })
    // console.log(this.data.time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  // tanchu: function () {
  //   animation = wx.createAnimation({
  //     duration: 500,
  //     timingFunction: 'ease',
  //   })

  //   this.animation = animation
  //   animation.translate(0, -194).step();
  //   this.setData({
  //     animationData: animation.export()
  //   })
  // },
  // hideModal: function () {
  //   animation.translate(0, 0).step();
  //   this.setData({
  //     animationData: animation.export()
  //   })
  //   console.log(1)
  // },
  page1: function (e) {
    var dis1 = this.data.page1;
    var dis2 = this.data.page2;
    var dis3 = this.data.page3;
    if (dis1 == "block") {
      dis2 = "none";
      dis3 = "none";
    } else {
      dis1 = "block";
      dis2 = "none";
      dis3 = "none";
    }
    this.setData({
      page1: dis1,
      page2: dis2,
      page3: dis3
    })
    var currentIndex = e.target.dataset.index
    this.setData({
      current: currentIndex,
      "tabArr.tabCurrentIndex": currentIndex
    })
    wx.setNavigationBarTitle({
      title: '工单列表',
    })
  },
  page2: function (e) {
    var dis1 = this.data.page1;
    var dis2 = this.data.page2;
    var dis3 = this.data.page3;
    if (dis2 == "block") {
      dis1 = "none";
      dis3 = "none";
    } else {
      dis2 = "block";
      dis1 = "none";
      dis3 = "none";
    }
    this.setData({
      page1: dis1,
      page2: dis2,
      page3: dis3
    })
    var currentIndex = e.target.dataset.index;
    this.setData({
      current: currentIndex,
      "tabArr.tabCurrentIndex": currentIndex
    });
    wx.setNavigationBarTitle({
      title: '语音发单',
    });
  },
  page3: function (e) {
    var dis1 = this.data.page1;
    var dis2 = this.data.page2;
    var dis3 = this.data.page3;
    if (dis3 == "block") {
      dis2 = "none";
      dis1 = "none";
    } else {
      dis3 = "block";
      dis2 = "none";
      dis1 = "none";
    }
    this.setData({
      page1: dis1,
      page2: dis2,
      page3: dis3
    })
    var currentIndex = e.target.dataset.index
    this.setData({
      current: currentIndex,
      "tabArr.tabCurrentIndex": currentIndex
    })
    wx.setNavigationBarTitle({
      title: '我的工单',
    })
  },

  page_d: function () {
    var dis1 = this.data.page_d;
    var dis2 = this.data.page_c;
    var dis3 = this.data.page_y;
    if (dis1 == "block") {
      dis2 = "none";
      dis3 = "none";
    } else {
      dis1 = "block";
      dis2 = "none";
      dis3 = "none";
    }
    this.setData({
      page_d: dis1,
      page_c: dis2,
      page_y: dis3
    })
  },
  page_c: function () {
    var dis1 = this.data.page_d;
    var dis2 = this.data.page_c;
    var dis3 = this.data.page_y;
    if (dis2 == "block") {
      dis1 = "none";
      dis3 = "none";
    } else {
      dis2 = "block";
      dis1 = "none";
      dis3 = "none";
    }
    this.setData({
      page_d: dis1,
      page_c: dis2,
      page_y: dis3
    })
  },
  page_y: function () {
    var dis1 = this.data.page_d;
    var dis2 = this.data.page_c;
    var dis3 = this.data.page_y;
    if (dis3 == "block") {
      dis2 = "none";
      dis1 = "none";
    } else {
      dis3 = "block";
      dis2 = "none";
      dis1 = "none";
    }
    this.setData({
      page_d: dis1,
      page_c: dis2,
      page_y: dis3
    })
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
    wx.showToast({
      title: '开始录音',
      image: '../image/recorder.png',
      duration: 2000,
    })
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
        url: 'http://172.16.80.20:8080/ITM/uploadFromWx', //仅为示例，非真实的接口地址
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
      info = res;
      console.log('文件', info)
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  kind: function () {
    wx.navigateTo({
      url: '../testPage5/testPage5'
    })
  },
  qq: function () {
    wx.navigateTo({
      url: '../testPage4/testPage4'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
