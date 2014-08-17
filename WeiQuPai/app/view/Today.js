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
            '<div class="today">',

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
                    return WeiQuPai.Util.hasCache('like', parseInt(values.item_id)) ? 'heart' : 'hallow_heart';
                },

                displayPrice: function(values) {
                    var auctions = WeiQuPai.Cache.get('auctions');
                    if (auctions && auctions.indexOf(values.id) != -1) {
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
            xtype: 'button',
            baseCls: 'hot',
            action: 'hot'
        }, {
            xtype: 'container',
            scrollDock: 'top',
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
            scrollDock: 'top',
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
                action: 'notice'

            }]
        }, {
            xtype: 'container',
            itemId: 'specialList',
            scrollDock: 'top',
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
            scrollDock: 'top',
            cls: 'todayTitle'
        }]
    },

    firstLoad: true,
    todayData: null,

    initialize: function() {
        this.callParent(arguments);
        this.loadData();
        this.on('activate', this.onActivate, this);
        this.on('hide', this.onHide, this);
        this.on('itemtap', this.bindEvent, this);
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
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/today';
        if (user) {
            url += '&token=' + user.token;
        }
        var me = this;
        WeiQuPai.Util.get(url, function(data) {
            me.getStore().setData(data.auctions);
            me.down('#specialList').setData(data.special);
            me.down('banner').updateBanner(data.banner);
            me.todayData = data;
            WeiQuPai.Util.resetListPaging(me);
            callback && callback();
        });
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            me.setState('loaded');
            me.snapBack();
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
        var store = this.getStore(),
            proxy = store.getProxy(),
            operation;
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
        var url = WeiQuPai.Config.apiUrl + '/?r=app/today/refresh&id=' + ids.join(",") + '&token=' + tk;
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