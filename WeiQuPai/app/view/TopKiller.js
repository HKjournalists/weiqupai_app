Ext.define('WeiQuPai.view.TopKiller', {
    extend: 'Ext.DataView',
    xtype: 'topkiller',
    config: {
        cls: 'bg_ef detail situation',
        store: 'UserAuction',
        loadingText: null,
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
            '<div class="killer">',
            '<div class="kill_content">',
            '<div class="contentkill">',
            '<img src="{[this.getAvatar(values.user.avatar)]}" class="person"/>',
            '<div class="map">',
            '<div class="progress-bar" style="width:0%"><div class="killerbar">￥{curr_price}<div class="killertip"></div></div></div>',
            '</div>',
            '{[this.getBtn(values)]}',
            '</div>',
            '</div>',
            '</div>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                },
                getBtn: function(values) {
                    var value;
                    if (values.status > 1 || values.left_time == 0 || values.curr_price == values.reserve_price) {
                        if (values.curr_price == values.reserve_price) {
                            value = '已到底价';
                        } else {
                            var statusText = ['', '进行中', '已结束', '已成交', '已取消'];
                            value = statusText[values.status];
                        }
                        return '<input type="button" value="' + value + '" class="btn disabled"/>';
                    }
                    return '<input type="button" value="帮杀!" class="btn help"/>'
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '杀手榜',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'itemInfo',
            tpl: new Ext.XTemplate(
                '<div class="product">',
                '<div class="top">',
                '<img src="{[this.getCover(values.item.pic_cover)]}" class="left"/>',
                '<div class="right">{item.title}</div>',
                '<div class="clear"></div>',
                '</div>',
                '<div class="bottom">市场价：{item.oprice}&nbsp;&nbsp;&nbsp;&nbsp;开杀价：{start_price}&nbsp;&nbsp;&nbsp;&nbsp;杀底价：{reserve_price}</div>',
                '</div>', {
                    getCover: function(cover) {
                        return WeiQuPai.Util.getImagePath(cover, 200);
                    }
                })
        }],

        poolId: null,
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('itemtap', this.bindEvent, this);
        this.down('#itemInfo').on('tap', function() {
            this.fireEvent('iteminfo');
        }, this, {
            element: 'element'
        });
    },

    updatePoolId: function(poolId) {
        this.loadData();
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
        var me = this;
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/auctionPool/view&id=' + this.getPoolId();
        WeiQuPai.Util.get(url, function(rsp) {
            me.getStore().setData(rsp.auctions);
            setTimeout(function() {
                me.showProgress();
            }, 200);
            me.down('#itemInfo').setData(rsp);
            Ext.isFunction(callback) && callback();
        });
    },

    showProgress: function() {
        me = this;
        this.getStore().each(function(item, index, length) {
            var dataItem = me.getViewItems()[index];
            var el = Ext.get(dataItem).down('.progress-bar');
            var anim = Ext.create('Ext.Anim', {
                autoClear: false,
                from: {
                    width: 0,
                },
                to: {
                    width: item.get('progress') + '%'
                },
                duration: 400
            });
            anim.run(el);
        });
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.person')) {
            this.fireEvent('avatartap', list, index, dataItem, record, e);
            return false;
        }
        if (Ext.get(e.target).findParent('.help')) {
            this.fireEvent('help', list, index, dataItem, record, e);
            return false;
        }
        this.fireEvent('detail', list, index, dataItem, record, e);
    }
})