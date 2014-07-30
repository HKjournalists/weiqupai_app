Ext.define('WeiQuPai.view.Today', {
    extend: 'Ext.dataview.List',
    xtype: 'today',
    requires: ['WeiQuPai.view.Banner', 'WeiQuPai.view.ItemDetail', 'WeiQuPai.view.SpecialSale'],
    config: {
        loadingText: null,
        store: 'Auction',
        cls: 'todaylist',
        style: 'background:#f6f6f6;',
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
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="today">',

            '<div class="left">',
            '<div class="prod">',
            '<img src="{[this.getCover(values.pic_cover)]}" width="100">',
            '</div>',
            '</div>',

            '<div class="right">',
            '<div class="title">',
            '{title}',
            '</div>',

            '<div class="price">',
            '<span class="priceNew">',
            '{[this.displayPrice(values)]}',
            '<img src="{[this.statusImg(values.status)]}" width="32">',
            '</span>',
            '<div class="{[this.getLikeCss(values)]}"></div>',
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
                    return WeiQuPai.Util.getImagePath(cover, '290');
                },
                getLikeCss: function(values) {
                    return WeiQuPai.Util.hasCache('like', values.item_id) ? 'prop' : 'prop2';
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
                iconCls: 'user',
                action: 'ucenter'
            }, {
                align: 'right',
                iconCls: 'list',
                action: 'list'
            }]
        }, {
            xtype: 'banner',
            scrollDock: 'top',
        }, {
            xtype: 'container',
            scrollDock: 'top',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                baseCls: 'btn1',
                flex: 1

            }, {

                xtype: 'button',
                baseCls: 'btn2',
                flex: 1

            }]
        }, {
            xtype: 'container',
            scrollDock: 'top',
            layout: 'hbox',
            items: [{

                xtype: 'button',
                baseCls: 'btn3',
                flex: 1

            }, {

                xtype: 'button',
                baseCls: 'btn4',
                flex: 1

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
                '<div class="list-product">',
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
        this.onBefore('itemtap', this.bindEvent, this);
    },

    bindEvent: function(list, index, dataItem, record, e) {
        var me = this;
        if (e.target.className == 'pro') {
            me.fireEvent('liketap', me, index, record);
            return false;
        }
        if (e.target.className == 'prop2') {
            var uid = e.target.getAttribute('uid');
            me.fireEvent('disliketap', me, index, record);
            return false;
        }
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