Ext.define('WeiQuPai.view.UserAuction', {
    extend: 'Ext.Container',
    xtype: 'userauction',
    config: {
        scrollable: true,
        cls: 'detail',
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
            id: 'mapdata',
            tpl: new Ext.XTemplate(
                '<div class="mypai_time" id="countdown">{[this.formatCountdown(values)]}</div>', {
                    formatCountdown: function(values) {
                        if (values.self_auction) {
                            if (values.self_auction.status == WeiQuPai.Config.userAuctionStatus.STATUS_ONLINE) {
                                return '剩余' + WeiQuPai.Util.formatTime(values.self_auction.left_time);
                            } else {
                                var text = {};
                                text[WeiQuPai.Config.userAuctionStatus.STATUS_FINISH] = '等待购买';
                                text[WeiQuPai.Config.userAuctionStatus.STATUS_DEAL] = '已成交';
                                text[WeiQuPai.Config.userAuctionStatus.STATUS_CANCEL] = '已被取消';
                                return text[values.self_auction.status];
                            }
                        } else {
                            return '等待开始';
                        }
                    }
                }
            )
        }, {
            xtype: 'container',
            id: 'price_data',
            tpl: new Ext.XTemplate(
                '<div class="clear"></div>',
                '<div class="detailData">',
                '<div class="clear"></div>',
                '<div class="title_new">{title}</div>',
                '<div class="content_new">',
                '<div class="left">',
                '<tpl if="self_auction">',
                '<div class="priceNew">{self_auction.curr_price}</div>',
                '</tpl>',
                '<div class="price"><span>原价￥{oprice}</span></div>',
                '</div>',
                '<div class="detail_pai">',
                '<tpl if="self_auction">',
                '<span class="detail_img">已有{self_auction.help_num}人帮拍</span>',
                '<span class="detail_down"></span>',
                '</tpl>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>'
            )
        }, {
            xtype: 'container',
            cls: 'daoju',
            items: [{
                xtype: 'button',
                text: '使用道具杀价',
                baseCls: 'star'
            }]

        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'daoju',
            style: 'height:60px;',
            items: [{
                xtype: 'button',
                flex: 1,
                baseCls: 'daoju_card',
                text: '加速卡*1'
            }, {
                xtype: 'button',
                flex: 1,
                baseCls: 'daoju_card',
                text: '加速卡*1'
            }, {
                xtype: 'button',
                flex: 1,
                baseCls: 'daoju_card',
                text: '加速卡*1'
            }]
        }, {
            xtype: 'disclosureitem',
            itemId: 'otherAuction'
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
                action: 'tab_commentlist',
                text: '大家评论'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_itemdesc',
                text: '图文详情'
            }]
        }, {
            xtype: 'itemparam',
            flex: 1
        }, {
            xtype: 'commentlist',
            flex: 1,
            hidden: true
        }, {
            xtype: 'itemdesc',
            flex: 1,
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
        //初始化tab
        this.initTab();

        //销毁的时候结束定时器
        this.on('destroy', this.onDestroy);
        this.on('painted', this.onPainted, this);
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

    applyRecord: function(record) {
        if (record == null) {
            return null;
        }
        var data = record.data;
        this.down('detailpicshow').setPicData(data.pic_url);
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        this.down('itemparam').setData(data);
        this.down('itemdesc').setData(data);
        this.down('#mapdata').setData(data);
        this.down('#price_data').setData(data);
        this.down('commentlist').setItemId(record.get('id'));
        this.updateOtherAuction(data);
        this.setCountdown(data);
        return record;
    },

    updateOtherAuction: function(data) {
        var container = this.down('#otherAuction');
        container.setHidden(!data.other_auction);
        var titleTpl = new Ext.XTemplate('<div class="mybpai">',
            '<img src="{user.avatar}">',
            '<span><strong>{user.nick}</strong>',
            '已将价格杀至<label style="color:#e76049">{curr_price}</label>元</span>',
            '</div>');
        data.other_auction.user.avatar = WeiQuPai.Util.getAvatar(data.other_auction.user.avatar, 140);
        container.setTitle(titleTpl.apply(data.other_auction));
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

    updateCounterState: function() {
        var selfAuction = this.getRecord().get('self_auction');
        var text = {};
        text[WeiQuPai.Config.userAuctionStatus.STATUS_ONLINE] = '进行中';
        text[WeiQuPai.Config.userAuctionStatus.STATUS_FINISH] = '等待购买';
        text[WeiQuPai.Config.userAuctionStatus.STATUS_DEAL] = '已成交';
        text[WeiQuPai.Config.userAuctionStatus.STATUS_CANCEL] = '已被取消';
        Ext.get('countdown').setHtml(text[selfAuction.status]);
    },

    //设置定时器
    setCountdown: function(data) {
        var now = Math.ceil(new Date / 1000);
        var auction = data.self_auction;
        if (!auction) return;
        this.setLeftSeconds(auction.left_time);
        var me = this;
        //如果不是正在进行状态，不做计时器
        if (auction.status != WeiQuPai.Config.userAuctionStatus.STATUS_ONLINE) {
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
            return this.updateCounterState();
        }
        var ls = this.getLeftSeconds();
        this.setLeftSeconds(--ls);
        var countdown = WeiQuPai.Util.formatTime(ls);
        //android系统2秒才走一次定时器，加一个span标签就没问题了
        Ext.get('countdown').setHtml('<span>剩余' + countdown + '</span>');
    },

    //价格趋势图
    createChart: function() {
        //显示趋势图
        var id = this.getRecord().get('user_auction').id;
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
    },

    onPainted: function() {
        var container = this.down('#otherAuction');
        if (container.element.down('span').getHeight() < 30) {
            container.element.down('span').addCls('single');
        }
    }
});