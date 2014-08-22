Ext.define('WeiQuPai.view.UserAuction', {
    extend: 'Ext.DataView',
    xtype: 'userauction',
    requires: ['WeiQuPai.view.UserAuctionComment'],
    config: {
        cls: 'bg_ef detail situation',
        store: 'UserAuctionHelper',
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
        }, {
            type: 'wlistpaging',
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="helper">',
            '<div class="helper_nick">{user.nick}</div>',
            '<img src="{[this.getAvatar(values.user.avatar)]}" width="40" class="helper_avatar"/>',
            '<div class="helper_discount">{discount}元<span class="help_time">{ctime}</span></div>',
            '<div class="clear"></div>',
            '</div>', {
                getAvatar: function(avatar) {
                    return WeiQuPai.Util.getAvatar(avatar, 140);
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '实时战况',
            docked: 'top',
            cls: 'titlebar1',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            itemId: 'auctionInfo',
            tpl: new Ext.XTemplate(
                '<div class="product">',
                '<div class="top">',
                '<img src="{[this.getCover(values.item.pic_cover)]}" class="left"/>',
                '<div class="right">{item.title}</div>',
                '<div class="clear"></div>',
                '</div>',
                '<div class="bottom">市场价：{item.oprice}&nbsp;&nbsp;&nbsp;&nbsp;开杀价：{start_price}&nbsp;&nbsp;&nbsp;&nbsp;杀底价：{reserve_price}</div>',
                '</div>',
                '<div class="time"><ul>',
                '<li>当前时间<br><span id="timer">{[this.getTime()]}</span></li>',
                '<li>{[this.getLeftTime(values)]}</li>',
                '<li>当前战果<br><span>{curr_price}</span>{[this.isReservePrice(values)]}</li>',
                '<div class="clear"></div></ul></div>',
                '<div class="prop"></div>', {
                    getCover: function(pic_cover) {
                        return WeiQuPai.Util.getImagePath(pic_cover, 200);
                    },
                    getTime: function() {
                        return Ext.Date.format(new Date, 'Y-m-d H:i:s');
                    },
                    getLeftTime: function(values) {
                        if (values.left_time) {
                            return '剩余时间<br><span>' + values.left_time + '</span>';
                        }
                        var text = ['', '进行中', '等待购买', '已成交', '已结束'];
                        return text[values.status];
                    },
                    isReservePrice: function(values) {
                        if (values.curr_price == values.reserve_price) {
                            return '<br/>已到底价';
                        }
                        return '';
                    }
                }
            )
        }, {
            xtype: 'bottombar',
            itemId: 'userbottombar'
        }],

        auctionId: null,
        auctionData: null
    },

    initialize: function() {
        this.callParent(arguments);

        this.down('#auctionInfo').on('tap', this.bindAuctionEvent, this, {
            element: 'element'
        });

        this.on('itemtap', this.bindEvent, this);

        this.showTips();
    },


    showTips: function() {
        if (!WeiQuPai.app.firstLaunch) return;
        setTimeout(function() {
            var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.KillTip');
            view.show();
        }, 500);
    },

    updateAuctionId: function(id) {
        this.loadData();
    },

    updateAuctionData: function(data) {
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user || data.uid != user.id) {
            this.down('bottombar').addCls('bottombarD');
            this.down('button[action=pai]').setDisabled(true);
        }
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
        var id = this.getAuctionId();
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/view&id=' + id;
        if (user) {
            url += '&token=' + user.token;
        }
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            me.setAuctionData(rsp);
            me.down('#auctionInfo').setData(rsp);
            me.getStore().getProxy().setExtraParam('id', id);
            me.getStore().setData(rsp.helpers);
            me.getStore().currentPage = 1;
            WeiQuPai.Util.resetListPaging(me);
            Ext.isFunction(callback) && callback();

            //上报统计
            var lastView = WeiQuPai.navigator.getPreviousItem();
            if (lastView.isXType('maincard')) {
                lastView = lastView.getActiveItem();
            }
            var from = lastView.getXTypes().split('/').pop();
            var data = {};
            data.from = from;
            data.page = 'useraution';
            data.auction_id = rsp.id;
            data.item_id = rsp.item_id;
            WeiQuPai.app.statReport(data);
        });
    },

    bindAuctionEvent: function(e) {
        if (Ext.get(e.target).findParent('.product')) {
            this.fireEvent('itemdetail');
            return false;
        }
        if (Ext.get(e.target).findParent('.prop')) {
            this.fireEvent('proptap');
            return false;
        }
    },

    bindEvent: function(list, index, dataItem, record, e) {
        if (Ext.get(e.target).findParent('.helper_avatar')) {
            this.fireEvent('avatartap', list, index, dataItem, record, e);
            return false;
        }
    }
})