Page({
    data: {
        gifList: [],    // 数据列表
        windowHeight: '',    // 宽口高
    },
    page: 1, // 请求的页数
    onReady: function() {
        var that = this;
        // 如果存在缓存就直接取缓存里的数据
        // if (wx.getStorageSync('gif')) {
        //     that.setData({
        //         "gifList": wx.getStorageSync('gif')
        //     });
        //     return;
        // }
        this.getData(that.page);
    },
    onShow: function() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowHeight: res.windowHeight
                });
            }
        });

        // this.scroll();
    },
    // 上拉加载更多
    onReachBottom: function() {
        this.page++;
        this.getData(this.page);
    },
    // 获取数据
    getData: function(page, cb) {
        var that = this;
        wx.showToast({
            title: '加载中...',
            icon: 'loading'
        });
        wx.request({
            url: 'http://route.showapi.com/341-3',
            data: {
                showapi_appid: 26444,
                showapi_sign: 'e6ed68d43d734b78892a649fedd90cbe',
                page: page
            },
            success: function(res) {
                var data = res.data;
                if (data && data.showapi_res_code == 0) {
                    var contentlist = that.data.gifList.concat(data.showapi_res_body.contentlist);
                    var windowHeight = that.data.windowHeight;

                    for (var i = 0; i < contentlist.length; i++) {
                        i>5 ? contentlist[i].isD = false : contentlist[i].isD = true;
                        contentlist[i].height = i * 245 - (windowHeight - 50);
                    }
                    that.setData({
                        gifList: contentlist
                    });
                    if (page == 1) {
                        wx.setStorageSync('gif', contentlist);
                    };
                    wx.hideToast();

                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                } else {
                    wx.showToast({
                        title: data.showapi_res_msg
                    });
                }
            }
        })
    },
    scroll: function(event) {

        var scrollTop;
        if (event) {
            scrollTop = event.detail.scrollTop;
            wx.setStorageSync('scrollTop', scrollTop);
        } else {
            console.log('不存在');
            scrollTop = wx.getStorageSync('scrollTop');
            console.log(scrollTop);
        }

        console.log(scrollTop);
        var gifList = this.data.gifList;
        console.log(gifList.length);
        for (var i = 0; i < gifList.length; i++) {
            if (gifList[i].height < scrollTop) {
                if (gifList[i].isD == false) {
                    gifList[i].isD = true;
                }
            }
        }
        this.setData({
            gifList: gifList
        })
    },
    pullUpload: function(event) {
        var that = this;
        this.page++;
        this.getData(this.page, function() {
            that.scroll();
        });
    }
})