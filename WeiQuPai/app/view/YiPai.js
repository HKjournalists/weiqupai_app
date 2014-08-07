Ext.define('WeiQuPai.view.YiPai', {
    extend: 'Ext.DataView',
    xtype: 'yipai',
    config: {
        loadingText: null,
        store: 'Auction',
        cls: 'bg_ef',
        disableSelection: true,
        scrollToTopOnRefresh: false,
        // plugins: [{
        //     type: 'wpullrefresh',
        //     lastUpdatedText: '上次刷新：',
        //     lastUpdatedDateFormat: 'H点i分',
        //     loadingText: '加载中...',
        //     pullText: '下拉刷新',
        //     releaseText: '释放立即刷新',
        //     loadedText: '下拉刷新',
        //     refreshFn: 'fetchLastest',
        //     scrollerAutoRefresh: true
        // }],
        // itemTpl: new Ext.XTemplate(
        //     '<div class="today">',

        //     '<div class="left">',
        //     '<div class="prod">',
        //     '<img src="{[this.getCover(values.pic_cover)]}" width="100">',
        //     '</div>',
        //     '</div>',

        //     '<div class="right">',
        //     '<div class="title">',
        //     '{title}',
        //     '</div>',

        //     '<div class="price">',
        //     '<div class="{[this.getLikeCss(values)]}"></div>',
        //     '<span class="priceNew">',
        //     '{[this.displayPrice(values)]}',
        //     '<img src="{[this.statusImg(values.status)]}" width="32">',
        //     '</span>',
        //     '</div>',

        //     '<div class="pinglun">',
        //     '<div class="product_comment">{item_stat.comment_num}</div>',
        //     '<div class="product_like">{item_stat.like_num}</div>',
        //     '</div>',

        //     '</div>',
        //     '</div>'),
        items: [{
            xtype: 'vtitlebar',
            title: '一拍到底',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            cls: 'yipai',
            layout: 'hbox',
            items: [{
                xtype: 'panel',
                baseCls: 'step1',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step2',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step3',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step4',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'link',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'step5',
                flex: 1
            }, {
                xtype: 'panel',
                cls: 'success',
                flex: 1
            }]
        }, {
            xtype: 'container',
            cls: 'yi_product',
            id: 'yipai',
            layout: {
                type: 'hbox'
            },
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="list">',
                '<div class="price">',
                '<div class="left">原价:{item.oprice}</div>',
                '<div class="right">低价:{item.oprice}</div>',
                '<div class="clear"></div>',
                '</div>',
                '<div>',
                '<img src="{[WeiQuPai.Util.getAvatar(values.item.pic_cover, 140)]}" class="img">',
                '<div class="zhezhao">',
                '{item.title}',
                '</div>',
                '</div>',

                '<div>',
                '<tpl for="auctions">',
                '<div class="dis">',
                '<span id="yipai_price">',
                '{user.nick}<span class="color_e7"> {curr_price}</span>',
                '</div>',
                '</tpl>',

                '</div>',
                '</div>',
                '</tpl>'
            )
        }]
    },

    firstLoad: true,
    todayData: null,

    initialize: function() {
        this.callParent(arguments);
        this.loadData();

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
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionPool';
        var me = this;
        WeiQuPai.Util.get(url, function(data) {
            // me.getStore().setData(data.auctions);
            me.down('#yipai').setData(data);
            // me.down('banner').updateBanner(data.banner);
            // me.todayData = data;
            //callback && callback();
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