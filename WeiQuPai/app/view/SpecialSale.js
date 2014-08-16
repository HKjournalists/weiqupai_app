/**
 * 专场的view
 */

Ext.define('WeiQuPai.view.SpecialSale', {
    extend: 'Ext.DataView',
    xtype: 'specialsale',
    config: {
        param: null,
        loadingText: null,
        store: 'SpecialSale',
        disableSelection: true,
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
                    return WeiQuPai.Util.hasCache('like', parseInt(values.item_id)) ? 'heart' : 'hallow_heart';
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
        }]
    },

    firstLoad: true,

    initialize: function() {
        this.callParent(arguments);
        this.on('activate', this.onActivate, this);
        this.on('itemtap', this.bindEvent, this);
    },

    applyParam: function(param) {
        this.down('titlebar').setTitle(param.title);
        this.loadData(param.id);
        return param;
    },

    loadData: function(id, callback) {
        this.setLoadingText(null);
        this.getStore().getProxy().setExtraParam('id', id);
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
        this.softRefresh();
    },

    //软刷新，只更新当前列表的状态和价格
    softRefresh: function() {

        if (this.firstLoad) {
            this.firstLoad = false;
            return;
        }

        var store = this.getStore(),
            proxy = store.getProxy(),
            operation;
        ids = [];
        store.each(function(item, index, length) {
            ids.push(item.get('id'));
        });
        Ext.Ajax.request({
            url: WeiQuPai.Config.apiUrl + '/?r=app/today/refresh&id=' + ids.join(","),
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