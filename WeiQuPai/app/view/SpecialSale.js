Ext.define('WeiQuPai.view.SpecialSale', {
    extend: 'Ext.DataView',
    xtype: 'specialsale',
    config: {
        param: null,
        scrollToTopOnRefresh: false,
        store: 'SpecialSale',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="today">',

            '<div class="left">',
            '<div class="prod">',
            '<img src="{[this.getCover(values.item.pic_cover)]}" width="100">',
            '</div>',
            '</div>',

            '<div class="right">',
            '<div class="title">{item.title}</div>',
            '<div class="price">',
            '<div class="{[this.getLikeCss(values)]}"></div>',
            '<span class="priceNew">{[this.displayPrice(values)]}',
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
                    var auctions = WeiQuPai.Cache.get('auctions');
                    if (auctions && auctions.indexOf(values.id) != -1) {
                        return '已拍';
                    }
                    return '￥' + values.curr_price;
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '专场拍卖',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }],
        firstLoad: true
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('activate', this.onActivate, this);
        this.on('itemtap', this.bindEvent, this);
        
        //添加到顶部的功能按钮
        WeiQuPai.Util.addTopIcon(this);
    },

    applyParam: function(param) {
        this.down('titlebar').setTitle(param.title);
        this.loadData(param.id);
        return param;
    },

    loadData: function(id, callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var query = {};
        query['id'] = id;
        query['market'] = WeiQuPai.Config.market;
        query['os'] = Ext.os.name.toLowerCase();
        query['osver'] = Ext.os.version.version;
        if(user) query['token'] = user.token;
        
        this.setLoadingText(null);
        this.getStore().getProxy().setExtraParams(query);
        this.getStore().load(function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return;
            }
            Ext.isFunction(callback) && callback();
        }, this);
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

    onActivate: function() {
        if (this.getFirstLoad()) {
            this.setFirstLoad(false);
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
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/today/refresh&id=' + ids.join(","),
            method: 'get',
            success: function(rsp) {
                rsp = Ext.decode(rsp.responseText);
                var records = store.getData();
                var record;
                for (var i = 0, len = rsp.length; i < len; i++) {
                    record = records.getByKey(rsp[i].id);
                    record.set(rsp[i]);
                }
            }
        });
    }
});