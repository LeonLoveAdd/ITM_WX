//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    page1: "block",
    page2: "none",
    page3: "none"
  },
  page1: function () {
    var dis1 = this.data.page1;
    var dis2 = this.data.page2;
    var dis3 = this.data.page3;
    if(dis1 == "block"){
      dis2 = "none";
      dis3 = "none";
    }else{
      dis1 = "block";
      dis2 = "none";
      dis3 = "none";
    }
    this.setData({
      page1: dis1,
      page2: dis2,
      page3: dis3
    })
    console.log(page1 + page2 + page3)
  },
  page2: function () {
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
    console.log(page1 + page2 + page3)
  },
  page3: function () {
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
    console.log(page1 + page2 + page3)
  },
})