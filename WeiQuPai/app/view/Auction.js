Ext.define('WeiQuPai.view.Auction', {
    extend: 'Ext.Container',
    xtype: 'auction',
    requires: [
        'WeiQuPai.view.CommentList', 'WeiQuPai.view.ItemParam', 'WeiQuPai.view.ItemDesc',
        'WeiQuPai.view.Shop', 'WeiQuPai.view.Brand', 'WeiQuPai.view.DetailPicShow',
        'WeiQuPai.view.BottomBar', 'WeiQuPai.view.ImageViewer', 'WeiQuPai.view.ShareLayer'
    ],
    config: {
        scrollable: true,
        cls: 'detail',
        loadingText: null,
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            refreshFn: 'fetchLastest',
            scrollerAutoRefresh: true
        }],
        items: [{
            xtype: 'vtitlebar',
            title: '拍品详情',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
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
            itemId: "item_stat",
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
            itemId: 'item_title',
            tpl: new Ext.XTemplate(
                '<div class="details">',
                '<div class="bottom" style="margin-top:110px;">',
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
            itemId: 'price_data',
            tpl: new Ext.XTemplate(
                '<div class="detailData">',
                '<div class="title_new">{title}</div>',
                '<div class="content_new">',
                '<div class="left"><div class="priceNew">{auction.curr_price}</div></div>',
                '<div class="detail_map" id="countdown">{[this.formatCountdown(values.auction)]}</div>',
                '<div class="clear"></div>',
                '</div>',
                '<div class="price clear">',
                '<span>原价￥{oprice}</span> 已售出:{item_stat.sold_num}',
                '</div></div>', {
                    formatCountdown: function(auction) {
                        if (auction.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START) {
                            //return auction.start_time;
                            return '等待开始';
                        } else if (auction.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
                            return '已结束';
                        } else {
                            var sec = auction.left_time % 60;
                            var min = (auction.left_time - sec) / 60;
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
                action: 'tab_itemparam'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_commentlist',
                text: '大家评论',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_itemdesc',
                text: '图文详情'
            }]
        }, {
            xtype: 'itemparam',
            hidden: true
        }, {
            xtype: 'commentlist'
        }, {
            xtype: 'itemdesc',
            hidden: true
        }, {
            xtype: 'bottombar'
        }],

        refreshTimer: null,
        counterTimer: null,

        //未开始时为还有多少时间开始，拍卖中时为本轮剩余时间
        leftSeconds: 0,

        //当前激活的tab button
        activeTab: null,

    },

    initialize: function() {
        this.callParent(arguments);

        this.shareLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ShareLayer');
        this.down('#item_title').on('tap', this.bindEvent, this, {
            element: 'element'
        });
        //初始化tab
        this.initTab();

        //销毁的时候结束定时器
        this.on('destroy', this.onDestroy);
    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].action.substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                var tab = me.getActiveTab();
                if (tab == this) return;
                tab.removeCls('x-button-active');
                tab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.setActiveTab(this);
            });
        }
        this.setActiveTab(btns[0]);
    },

    bindEvent: function(e) {
        if (e.target.className == 'like') {
            this.fireEvent('itemlike', this);
            return false;
        }
        if (e.target.className == 'nolike') {
            this.fireEvent('itemdislike', this);
            return false;
        }
    },

    applyRecord: function(record) {
        if (record == null) {
            return null;
        }

        var data = record.data;
        this.down('detailpicshow').setPicData(data.pic_url);
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        this.down('#price_data').setData(data);
        this.down('itemparam').setData(data);
        this.down('itemdesc').setData(data);
        this.down('commentlist').setItemId(record.get('id'));
        return record;
    },

    updateItemStat: function(field, value) {
        var data = this.down('#item_stat').getData();
        data.item_stat[field] = parseInt(data.item_stat[field]) + value;
        this.down('#item_stat').setData(data);
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            me.setState('loaded');
            me.snapBack();
        });
    },

    loadData: function(callback) {
        var item = this.getRecord();
        WeiQuPai.model.Item.load(item.get('id'), {
            scope: this,
            success: function(record, operation) {
                this.setRecord(record);
                //添加数据到分享功能
                this.shareLayer.setShareData(record.data);
                Ext.isFunction(callback) && callback();
            },
            failure: function(record, operation) {
                WeiQuPai.Util.toast('数据加载失败');
            }
        });
    },

    //软刷新
    softRefresh: function() {
        //先确保清空定时器
        this.onDestroy();
        var me = this;
        var auction = this.getRecord().get('auction');
        var url = WeiQuPai.Config.apiUrl + '/?r=app/auction/refresh&id=' + auction.id;
        WeiQuPai.Util.get(url, function(rsp) {
            auction = Ext.merge(auction, rsp);
            this.getRecord().set('auction', auction);
            this.down('#price_data').setData(this.getRecord().data);
            //如果没结束就继续自动刷新
            if (rsp.status != WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
                this.setCountdown();
            }
        });
    },

    //设置定时器
    setCountdown: function() {
        var now = Math.ceil(new Date / 1000);
        var auction = this.getRecord().get('auction');
        this.setLeftSeconds(auction.left_time);
        if (auction.left_time <= 0 || auction.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) return;
        var me = this;
        //如果是未开始，在开始时间做软刷新
        if (auction.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START) {
            this.setRefreshTimer(setTimeout(function() {
                me.softRefresh();
            }, auction.left_time * 1000));
            return;
        }
        //已经开始的做计时
        this.setCounterTimer(setInterval(function() {
            me.countdown();
        }, 1000));
    },

    countdown: function() {
        //计时结束做下一轮刷新
        if (this.getLeftSeconds() == 0) {
            clearInterval(this.getCounterTimer());
            this.setCounterTimer(null);
            return this.softRefresh();
        }
        var ls = this.getLeftSeconds();
        this.setLeftSeconds(--ls);
        var sec = ls % 60;
        var min = (ls - sec) / 60;
        var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
        //android系统2秒才走一次定时器，加一个span标签就没问题了
        Ext.get('countdown').setHtml('<span>' + countdown + '</span>');

        var me = this;
        if (ls <= 6 && ls > 0) {
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
        var id = this.getRecord().get('auction').id;
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
        if (this.getRefreshTimer()) {
            clearTimeout(this.getRefreshTimer());
            this.setRefreshTimer(null);
        }
        if (this.getCounterTimer()) {
            clearInterval(this.getCounterTimer());
            this.setCounterTimer(null);
        }
    }
});