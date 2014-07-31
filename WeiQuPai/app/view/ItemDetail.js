Ext.define('WeiQuPai.view.ItemDetail', {
    extend: 'Ext.Container',
    xtype: 'itemdetail',
    requires: [
        'WeiQuPai.view.Shop', 'WeiQuPai.view.BottomBar',
        'WeiQuPai.view.DetailPicShow', 'WeiQuPai.view.Order', 'WeiQuPai.model.Auction',
        'WeiQuPai.view.ShareLayer', 'WeiQuPai.view.Brand', 'WeiQuPai.model.Reserve',
        'WeiQuPai.view.Comment', 'WeiQuPai.view.ItemParam', 'WeiQuPai.view.ItemDesc'
    ],
    config: {
        param: null,
        scrollable: true,
        cls: 'detail',
        items: [{
            xtype: 'vtitlebar',
            title: '拍品详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                text: '&nbsp;&nbsp;',
                action: 'back'

            }, {
                align: 'right',
                baseCls: 'refresh',
                action: 'refresh'
            }]
        }, {
            xtype: 'detailpicshow'
        }, {
            xtype: 'container',
            id: "item_stat",
            tpl: new Ext.XTemplate(
                '<div class="details">',
                '<div class="top" style="margin-top:-201px;">',
                '<div class="right">',
                '<ul>',
                '<li class="heart">{item_stat.like_num}</li>',
                '<li class="nolike">{item_stat.dislike_num}</li>',
                '<li class="pre">{item_stat.comment_num}</li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            id: 'item_title',
            tpl: new Ext.XTemplate(
                '<div class="details">',
                '<div class="bottom" style="margin-top:110px;">',
                '<div class="left">',
                '{title}',
                '</div>',
                '<div class="right">',
                '<ul>',
                '<li class="nolike"></li>',
                '<li class="like"></li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            id: 'price_data',
            tpl: new Ext.XTemplate(
                '<div class="detailData">',
                '<div class="left">',
                '<div class="priceNew">{curr_price}</div>',
                '<div class="price">',
                '<span>原价￥{oprice}</span>',
                ' 已售出:{item_stat.sold_num}',
                '</div>',
                '</div>',
                '<div class="detail_map" id="countdown">{[this.formatCountdown(values)]}</div>',
                '</div>', {
                    formatCountdown: function(values) {
                        if (values.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START) {
                            return values.start_time;
                        } else if (values.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
                            return '00:00';
                        } else {
                            var sec = values.left_time % 60;
                            var min = (values.left_time - sec) / 60;
                            var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
                            return countdown;
                        }
                    }
                }
            )
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'log_btn',
            itemId: 'tabbar',
            items: [{
                flex: 1,
                xtype: 'button',
                text: '商品参数',
                action: 'tab_itemparam',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_comment',
                text: '大家评论'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_itemdesc',
                text: '图文详情'
            }]
        }, {
            xtype: 'itemparam'
        }, {
            xtype: 'comment',
            hidden: true
        }, {
            xtype: 'itemdesc',
            hidden: true
        }, {
            xtype: 'bottombar'
        }]

    },

    refreshTimer: null,
    counterTimer: null,
    //未开始时为还有多少时间开始，拍卖中时为本轮剩余时间
    leftSeconds: 0,

    //当前激活的tab button
    activeTab: null,

    tabPosition: 0,

    initialize: function() {
        this.callParent(arguments);

        this.shareLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer', {
            height: 160
        });
        //初始化tab
        this.initTab();

        //销毁的时候结束定时器
        this.on('destroy', this.onDestroy);

        this.on('painted', function() {
            this.tabPosition = this.down('#tabbar').element.getY() + 20;
        });

    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].action.substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                if (me.activeTab == this) return;
                me.activeTab.removeCls('x-button-active');
                me.activeTab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.activeTab = this;
                me.getScrollable().getScroller().scrollTo(0, me.tabPosition, false);
            });
        }
        this.activeTab = btns[0];

        //tab的悬停效果
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroler, x, y) {
            if (y >= this.tabPosition) {
                this.down('#tabbar').setDocked('top');
            } else {
                this.down('#tabbar').setDocked(null);
            }


        }, this);
    },

    applyParam: function(param) {
        //加载数据
        this.loadData(param.id);
        this.down('comment').setItemId(param.item_id);
        return param;
    },

    loadData: function(id) {
        var auction = WeiQuPai.model.Auction;
        auction.load(id, {
            scope: this,
            success: function(record, operation) {
                this.setContent(record.data);
                //添加数据到分享功能
                this.shareLayer.setShareData(record.data);
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    },

    setContent: function(data) {
        //保存数据，为后面使用
        this.auctionData = data;
        this.down('detailpicshow').setPicData(data.pic_url);
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        this.down('#price_data').setData(data);
        this.down('itemparam').setData(data);
        this.down('itemdesc').setData(data);
        //this.createChart();
        this.setCountdown();
    },


    //软刷新
    softRefresh: function() {
        //先确保清空定时器
        this.onDestroy();
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/auction/refresh&id=' + this.auctionData.id,
            method: 'get',
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                this.auctionData.left_time = rsp.left_time;
                this.auctionData.status = rsp.status;
                this.auctionData.curr_round = rsp.curr_round;
                this.auctionData.curr_price = rsp.curr_price;
                this.auctionData.round_start_time = rsp.round_start_time;
                this.down('#price_data').setData(this.auctionData);
                //如果没结束就继续自动刷新
                if (rsp.status != WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
                    this.setCountdown();
                }
            },
            scope: this
        });
    },

    //设置定时器
    setCountdown: function() {
        var now = Math.ceil(new Date / 1000);
        this.leftSeconds = this.auctionData.left_time;
        if (this.leftSeconds <= 0 || this.auctionData.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) return;
        var me = this;
        //如果是未开始，在开始时间做软刷新
        if (this.auctionData.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START) {
            this.refreshTimer = setTimeout(function() {
                me.softRefresh();
            }, this.leftSeconds * 1000);
            return;
        }
        //已经开始的做计时
        this.counterTimer = setInterval(function() {
            me.countdown();
        }, 1000);
    },

    countdown: function() {
        //计时结束做下一轮刷新
        if (this.leftSeconds == 0) {
            clearInterval(this.counterTimer);
            this.counterTimer = null;
            return this.softRefresh();
        }
        this.leftSeconds--;
        var sec = this.leftSeconds % 60;
        var min = (this.leftSeconds - sec) / 60;
        var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
        //android系统2秒才走一次定时器，加一个span标签就没问题了
        Ext.get('countdown').setHtml('<span>' + countdown + '</span>');

        var me = this;
        if (this.leftSeconds <= 6 && this.leftSeconds > 0) {
            setTimeout(function() {
                me.flashBackground();
            }, 700);
        }
    },

    flashBackground: function() {
        var me = this;
        var el = Ext.get('countdown');
        var outAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'background': '#ca0936'
            },
            to: {
                'background': '#f0f0f1'
            },
            duration: 200,
            after: function() {
                inAnim.run(el);
            }
        });
        var inAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'background': '#f0f0f1'
            },
            to: {
                'background': '#ca0936'
            },
            duration: 600
        });
        outAnim.run(el);
    },

    //价格趋势图
    createChart: function() {
        //显示趋势图
        var id = this.auctionData.id;
        var el = new Image;
        el.src = WeiQuPai.Config.host + '/apic/' + id + '.png?_dc=' + Math.random();
        var chart = this.down('#chart');
        chart.element.appendChild(el);
        el.onload = function() {
            chart.show();
        }
    },

    //销毁的时候清除定时器
    onDestroy: function() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        if (this.counterTimer) {
            clearInterval(this.counterTimer);
            this.counterTimer = null;
        }
    }
});