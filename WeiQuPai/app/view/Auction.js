Ext.define('WeiQuPai.view.Auction', {
    extend: 'Ext.Container',
    xtype: 'auction',
    requires: [
        'WeiQuPai.view.CommentList', 'WeiQuPai.view.ItemParam', 'WeiQuPai.view.ItemDesc',
        'WeiQuPai.view.Shop', 'WeiQuPai.view.Brand', 'WeiQuPai.view.DetailPicShow',
        'WeiQuPai.view.BottomBar', 'WeiQuPai.view.ImageViewer', 'WeiQuPai.view.ShareLayer',
        'WeiQuPai.view.AuctionTip', 'WeiQuPai.view.AuctionChart'
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
                '<li class="{[this.getDislikeCls(values)]}"></li>',
                '<li class="{[this.getLikeCls(values)]}"></li>',
                '</ul>',
                '</div>',
                '<div style="clear:both"></div>',
                '</div>',
                '</div>', {
                    getLikeCls: function(values) {
                        var id = parseInt(values.id);
                        return WeiQuPai.Util.hasCache('item_like', id) ? 'selflike' : 'like';
                    },
                    getDislikeCls: function(values) {
                        var id = parseInt(values.id);
                        return WeiQuPai.Util.hasCache('item_dislike', id) ? 'selfnolike' : 'nolike';
                    }
                }
            )
        }, {
            xtype: 'container',
            itemId: 'price_data',
            tpl: new Ext.XTemplate(
                '<div class="detailData">',
                '<div class="title_new">{title}</div>',
                '<div class="content_new">',
                '<div class="detail_map">价格趋势</div>',
                '<div class="priceNew">￥{auction.curr_price}</div>',
                '</div>',
                '<div class="oprice-row"><span class="oprice">原价￥{oprice}</span> <span class="discount">{[this.getDiscount(values)]}</span></div>',
                '</div>',{
                    getDiscount: function(values){
                        var discount = parseFloat(values.auction.discount);
                        if(discount > 0){
                            return '下单立减' + discount + '元';
                        }
                        return '';
                    }
                }
            )
        }, {
            xtype: 'container',
            layout: 'hbox',
            cls: 'log_btn',
            itemId: 'tabbar',
            style: 'position:relative;z-index:100',
            items: [{
                flex: 1,
                xtype: 'button',
                action: 'tab_itemdesc',
                itemId: 'tab_itemdesc',
                text: '图文详情',
                cls: 'x-button-active'
            }, {
                flex: 1,
                xtype: 'button',
                text: '商品参数',
                action: 'tab_itemparam',
                itemId: 'tab_itemparam'
            }, {
                flex: 1,
                xtype: 'button',
                action: 'tab_commentlist',
                itemId: 'tab_commentlist',
                text: '大家评论'
            }]
        }, {
            xtype: 'itemdesc'
        }, {
            xtype: 'itemparam',
            hidden: true
        }, {
            xtype: 'commentlist',
            hidden: true

        }, {
            xtype: 'bottombar',
            itemId: 'auctionBottombar'
        }],

        refreshTimer: null,
        counterTimer: null,

        //未开始时为还有多少时间开始，拍卖中时为本轮剩余时间
        leftSeconds: 0,

        //当前激活的tab button
        activeTab: null,

    },

    tabPosition: 0,

    initialize: function() {
        this.callParent(arguments);
        this.showTips();
        this.down('#item_title').element.on('tap', this.bindEvent, this);
        this.down('#price_data').element.on('tap', this.bindEvent, this);
        //初始化tab
        this.initTab();
        //销毁的时候结束定时器
        this.on('destroy', this.onDestroy);;
    },

    showTips: function() {
        if (!WeiQuPai.app.firstLaunch) return;
        setTimeout(function() {
            var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.AuctionTip');
            view.show();
        }, 500);
    },

    initTab: function() {
        var btns = this.query('#tabbar button');
        var me = this;
        for (var i = 0; i < btns.length; i++) {
            var xtype = btns[i].getItemId().substr(4);
            btns[i].tabView = this.down(xtype);
            btns[i].on('tap', function() {
                var tab = me.getActiveTab();
                if (tab == this) return;
                tab.removeCls('x-button-active');
                tab.tabView.hide();
                this.addCls('x-button-active');
                this.tabView.show();
                me.setActiveTab(this);
                setTimeout(function() {
                    var scroller = me.getScrollable().getScroller();
                    if (scroller.position.y > me.tabPosition) {
                        scroller.scrollTo(null, me.tabPosition, true);
                    }
                }, 50);
            });
        }
        this.setActiveTab(btns[0]);

        //tab的悬停效果
        this.on('painted', function() {
            this.tabPosition = this.down('#tabbar').element.getY() - this.down('vtitlebar').element.getHeight();
        }, this, {
            single: true
        });
        var scroller = this.getScrollable().getScroller();
        scroller.addListener('scroll', function(scroller, x, y) {
            if (y >= this.tabPosition) {
                this.down('#tabbar').translate(null, y - this.tabPosition, false);
            } else {
                this.down('#tabbar').translate(null, 0, false);
            }
        }, this);
        scroller.addListener('scrollend', this.listPaging, this);
    },

    listPaging: function(scroller, x, y) {
        if (y < scroller.maxPosition.y) {
            return;
        }
        var tabView = this.getActiveTab().tabView;
        tabView.nextPage && tabView.nextPage(scroller);
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
        if (e.target.className == 'selflike') {
            this.fireEvent('cancelitemlike', this);
            return false;
        }
        if (e.target.className == 'selfnolike') {
            this.fireEvent('cancelitemdislike', this);
            return false;
        }
        if (Ext.get(e.target).findParent('.detail_map')) {
            this.showChart();
            return false;
        }
    },

    updateRecord: function(record) {
        this.callParent(arguments);
        if (record == null) {
            return;
        }
        var data = record.data;
        this.down('detailpicshow').setPicData(data.pic_top);
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        this.down('#price_data').setData(data);
        this.down('itemparam').setData(data);
        this.down('itemdesc').setData(data);
        this.down('commentlist').setItemId(record.get('id'));
        this.down('bottombar').setData(data);
        this.setCountdown();
    },

    updateItemStat: function(field, value) {
        var data = this.down('#item_stat').getData();
        data.item_stat[field] = parseInt(data.item_stat[field]) + value;
        this.down('#item_stat').setData(data);
        this.down('#item_title').setData(data);
        //更新auction model对应的数据，使得上一层view的对应视图更新
        var auction = this.getRecord().get('auction');
        if (!auction) return;
        var record = Ext.getStore('Auction').getById(auction.id);
        record && record.set('item_stat', data.item_stat);
        var record = Ext.getStore('SpecialSale').getById(auction.id);
        record && record.set('item_stat', data.item_stat);
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            setTimeout(function() {
                me.setState('loaded');
                me.snapBack();
            }, 100);
        });
    },

    loadData: function(callback) {
        var item = this.getRecord();
        WeiQuPai.model.Item.load(item.get('id'), {
            scope: this,
            success: function(record, operation) {
                this.setRecord(record);
                this.updateRecord(record);
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auction/refresh&id=' + auction.id;
        WeiQuPai.Util.get(url, function(rsp) {
            auction = Ext.merge(auction, rsp);
            me.getRecord().set('auction', auction);
            me.down('#price_data').setData(me.getRecord().data);
            //如果没结束就继续自动刷新
            if (rsp.left_time > 0 && rsp.status != WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
                me.setCountdown();
            }
        });
    },

    //设置定时器
    setCountdown: function() {
        var auction = this.getRecord().get('auction');
        if (auction.left_time == 0 || auction.status != WeiQuPai.Config.auctionStatus.STATUS_ONLINE) {
            return;
        }
        var now = Math.ceil(new Date / 1000);
        this.setLeftSeconds(auction.left_time);
        var me = this;
        //已经开始的做计时
        if (this.getCounterTimer()) {
            clearInterval(this.getCounterTimer());
            this.setCounterTimer(null);
        }
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
                'color': '#e76049'
            },
            to: {
                'color': '#fff'
            },
            duration: 200,
            after: function() {
                inAnim.run(el);
            }
        });
        var inAnim = Ext.create('Ext.Anim', {
            autoClear: false,
            from: {
                'color': '#fff'
            },
            to: {
                'color': '#e76049'
            },
            duration: 600
        });
        outAnim.run(el);
    },

    showChart: function() {
        //显示趋势图
        var id = this.getRecord().get('auction').id;
        var src = WeiQuPai.Config.host + '/apicv2/' + id + '.png?_dc=' + Math.random();
        var chart = WeiQuPai.Util.getGlobalView('WeiQuPai.view.AuctionChart');
        chart.setSrc(src);
        chart.setParentCmp(this);
        chart.show();

        WeiQuPai.Util.saveLastView.call(chart);
        WeiQuPai.app.statReport({
            act: 'showchart'
        });
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