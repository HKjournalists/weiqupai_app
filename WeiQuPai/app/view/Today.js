Ext.define('WeiQuPai.view.Today', {
    extend: 'Ext.DataView',
    xtype: 'today',
    requires: ['WeiQuPai.view.Banner', 'WeiQuPai.view.Auction', 'WeiQuPai.view.SpecialSale',
        'WeiQuPai.view.Discount', 'WeiQuPai.view.KillEnd', 'WeiQuPai.view.AuctionTip', 'WeiQuPai.view.Category'
    ],
    config: {
        loadingText: null,
        store: 'Auction',
        cls: 'bg_ef',
        id: 'dataviewlist',
        disableSelection: true,
        scrollToTopOnRefresh: false,
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
        }, {
            type: 'wlistpaging',
        }],

        itemTpl: new Ext.XTemplate(
            '<div class="today" item_id={item_id}>',

            '<div class="left">',
            '<div class="prod">',
            '<img src="{[this.getCover(values.item.pic_cover)]}" width="100">',
            '</div>',
            '</div>',

            '<div class="right">',
            '<div class="title">',
            '{item.title}',
            '</div>',

            '<div class="price">',
            '<div class="{[this.getLikeCss(values)]}"></div>',
            '<span class="priceNew">',
            '{[this.displayPrice(values)]}',
            '<img src="{[this.statusImg(values.status)]}" width="32">',
            '</span>',
            '</div>',

            '<div class="pinglun">',
            '<div class="product_comment">{item_stat.comment_num}</div>',
            '<div class="product_like">{item_stat.like_num}</div>',
            '</div>',

            '</div>',
            '</div>', {
                statusImg: function(status) {
                    var img = [];
                    img[WeiQuPai.Config.auctionStatus.STATUS_NOT_START] = '';
                    img[WeiQuPai.Config.auctionStatus.STATUS_ONLINE] = 'resources/images/rpz.png';
                    img[WeiQuPai.Config.auctionStatus.STATUS_FINISH] = 'resources/images/yjs.png';
                    return img[status];
                },

                getCover: function(cover) {
                    return WeiQuPai.Util.getImagePath(cover, '200');
                },
                getLikeCss: function(values) {
                    return WeiQuPai.Util.hasCache('item_like', parseInt(values.item_id)) ? 'heart' : 'hallow_heart';
                },

                displayPrice: function(values) {
                    if (WeiQuPai.Util.hasCache('auctions', parseInt(values.id))) {
                        return '已拍';
                    }
                    return '￥' + values.curr_price;
                }
            }),
        items: [{
            xtype: 'vtitlebar',
            title: '微趣拍',
            docked: 'top',
            items: [{
                baseCls: 'user',
                action: 'ucenter'
            }, {
                align: 'right',
                baseCls: 'list_btn',
                action: 'category'
            }]
        }, {
            xtype: 'banner',
            scrollDock: 'top',
        }, {
            xtype: 'container',
            style: 'background:#fff',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                baseCls: 'btn1',
                action: 'discount',
                flex: 1

            }, {

                xtype: 'button',
                baseCls: 'btn2',
                action: 'killend',
                flex: 1
            }]
        }, {
            xtype: 'container',
            style: 'background:#fff',
            layout: 'hbox',
            items: [{

                xtype: 'button',
                baseCls: 'btn3',
                action: 'circle',
                flex: 1

            }, {

                xtype: 'button',
                baseCls: 'btn4',
                flex: 1,
                action: 'luxuries'

            }]
        }, {
            xtype: 'container',
            itemId: 'barToday',
            tpl: new Ext.XTemplate(
                '<div class="barToday">',
                '<div class="leftimg">',
                '<img src="{[this.getCover(values.item.pic_cover)]}" width="73" height="73" />',
                '</div>',
                '<div>{item.title}</div>',
                '<div><span class="">当前价：{curr_price}</span>　　<span>帮杀数：{help_num}</span></div>',
                '<div>',
                '<span class="fleft">底价：{reserve_price} 剩余{pool.left_num}个</span>',
                '<span  class="fright"><input type="button" value="我的实况" class="t_btn" /></span>',
                '<div class="clear"></div>',
                '</div>',
                '</div>', {
                    getCover: function(cover) {
                        return WeiQuPai.Util.getImagePath(cover, '200');
                    }
                }
            )
        }, {
            xtype: 'container',
            itemId: 'specialList',
            layout: {
                type: 'hbox'
            },
            tpl: new Ext.XTemplate(
                '<div class="special">',
                '<tpl for=".">',
                '<div class="list-product" data-idx="{#}">',
                '<img src="{[WeiQuPai.Util.getImagePath(values.pic_url)]}" width="60"/>',
                '<p>{title}</p>',
                '</div>',
                '</tpl>',
                '</div>'
            )
        }, {
            xtype: 'container',
            html: '今日精选',
            cls: 'todayTitle'
        }]
    },

    firstLoad: true,
    todayData: null,

    initialize: function() {
        var me = this;
        this.callParent(arguments);

        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);

        this.loadData(function() {
            if (Ext.os.is.android) {
                setTimeout(function() {
                    var scroller = me.getScrollable().getScroller();
                    scroller.refresh();
                }, 200);
            }
        });

        this.on('activate', this.onActivate, this);
        this.on('hide', this.onHide, this);
        this.on('itemtap', this.bindEvent, this);

        //血战的中转
        this.down('#barToday').on('tap', function(e) {
            var view = Ext.create('WeiQuPai.view.UserAuction');
            view.setAuctionId(this.getData().id);
            WeiQuPai.navigator.push(view);
        }, null, {
            element: 'element'
        });

        this.down('#specialList').on('tap', function(e) {
            var idx = Ext.get(e.target).findParent('.list-product').getAttribute('data-idx') - 1;
            var view = Ext.create('WeiQuPai.view.SpecialSale', {
                param: this.todayData.special[idx]
            });
            WeiQuPai.navigator.push(view);
        }, this, {
            element: 'element',
            delegate: '.list-product'
        });
    },

    bindEvent: function(list, index, dataItem, record, e) {
        var me = this;
        if (e.target.className == 'hallow_heart') {
            me.fireEvent('liketap', me, index, dataItem, record, e);
            return false;
        }
        if (e.target.className == 'heart') {
            var uid = e.target.getAttribute('uid');
            me.fireEvent('unliketap', me, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('showdetail', me, index, dataItem, record, e);
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var query = {};
        query['r'] = 'appv2/today';
        query['market'] = WeiQuPai.Config.market;
        query['os'] = Ext.os.name.toLowerCase();
        query['ver'] = WeiQuPai.Config.version;
        if (user) query['token'] = user.token;

        var url = WeiQuPai.Config.apiUrl + '/?' + Ext.Object.toQueryString(query);
        var me = this;
        WeiQuPai.Util.get(url, function(data) {
            me.getStore().setData(data.auctions);
            me.down('#specialList').setData(data.special);
            me.down('banner').updateBanner(data.banner);
            if(data.kill){
                me.down('#barToday').show();
                me.down('#barToday').setData(data.kill);
            }else{
                me.down('#barToday').hide();
            }
            me.todayData = data;
            WeiQuPai.Util.resetListPaging(me);
            callback && callback();
        });
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

    onActivate: function() {
        if (this.firstLoad) {
            this.firstLoad = false;
            return;
        }
        this.softRefresh();
    },

    //软刷新，只更新当前列表的状态和价格
    softRefresh: function() {
        var store = this.getStore();
        ids = [];
        store.each(function(item, index, length) {
            ids.push(item.get('id'));
        });
        //保存拍卖id和广告位置的映射
        var bannerCache = {};
        for (var i = 0; i < this.todayData.banner.length; i++) {
            var banner = this.todayData.banner[i];
            if (banner.type == 3) {
                ids.push(banner.auction.id);
                bannerCache[banner.auction.id] = i;
            }
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var tk = user && user.token || '';
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/today/refresh&id=' + ids.join(",") + '&token=' + tk;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            var records = store.getData();
            for (var record, i = 0, len = rsp.length; i < len; i++) {
                var bannerIdx = bannerCache[rsp[i].id];
                if (bannerIdx !== undefined) {
                    me.down('banner').updatePrice(bannerIdx, rsp[i].curr_price);
                }
                record = records.getByKey(rsp[i].id);
                record && record.set(rsp[i]);
            }
        });
    },

    onHide: function() {
        this.down('banner').stopTimer();
    }
});