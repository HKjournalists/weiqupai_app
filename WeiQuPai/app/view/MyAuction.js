Ext.define('WeiQuPai.view.MyAuction', {
    extend: 'Ext.DataView',
    xtype: 'myauction',
    config: {
        cls: 'bg_ef',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
        store: 'MyAuction',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true
        }, {
            type: 'wlistpaging',
        }],
        itemTpl: new Ext.XTemplate(
            '<div class="myorder mg_10" >',
            '<div class="orderlist" data-orderlist="{#}">',
            '<div class="left">',
            '<ul>',
            '<li>当前价格：<span style="color:#e76049">{curr_price}</span></li>',
            '<li>起始价格：{start_price}</li>',
            '<li>开始时间：{start_time}</li>',
            '<li>{[this.getLeftTime(values)]}</li>',
            '</ul>',
            '</div>',
            '<div class="right">',
            '<ul>',
            '<li>{help_num}人帮拍</li>',
            '<tpl if="this.canPai(values.status)">',
            '<li><input type="button" value="我要拍" class="btn_e7"/></li>',
            '</tpl>',
            '</ul>',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div class="order_dis">',
            '<img src="{[this.getCover(values.item.pic_cover)]}" class="card-img"/>',
            '<div class="right">{item.title}</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>', {
                getButtonText: function(status) {
                    return text[status];
                },
                getCover: function(cover) {
                    return WeiQuPai.Util.getImagePath(cover, '200');
                },
                getLeftTime: function(values) {
                    if (values.status == WeiQuPai.Config.userAuctionStatus.STATUS_ONLINE) {
                        return '剩余时间：' + values.left_time_text;
                    }
                    var text = {};
                    text[WeiQuPai.Config.userAuctionStatus.STATUS_ONLINE] = '进行中';
                    text[WeiQuPai.Config.userAuctionStatus.STATUS_FINISH] = '等待购买';
                    text[WeiQuPai.Config.userAuctionStatus.STATUS_DEAL] = '已成交';
                    text[WeiQuPai.Config.userAuctionStatus.STATUS_CANCEL] = '已取消';
                    return text[values.status];
                },
                canPai: function(status) {
                    return status == WeiQuPai.Config.userAuctionStatus.STATUS_ONLINE ||
                        status == WeiQuPai.Config.userAuctionStatus.STATUS_FINISH;
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '我的拍卖',
            docked: 'top',
            items: [{
                baseCls: 'user',
                action: 'ucenter'
            }]
        }]

    },

    initialize: function() {
        this.callParent(arguments);
        this.msgbox = WeiQuPai.Util.msgbox(' ');
        this.add(this.msgbox);

        this.loadData();

        this.on('activate', this.onActivate, this);

        this.onBefore('itemtap', function(list, index, dataItem, record, e) {
            if (e.target.tagName.toLowerCase() == 'input') {
                this.fireEvent('order_item', list, index, dataItem, record, e);
                return false;
            }
            if (Ext.get(e.target).findParent('.order_dis')) {
                this.fireEvent('itemdetail', list, index, dataItem, record, e);
                return false;
            }
        }, this);
    },

    onActivate: function() {
        var msgType = [WeiQuPai.Notify.MSG_AUCTION_FINISH, WeiQuPai.Notify.MSG_AUCTION_RESERVE_PRICE,
            WeiQuPai.Notify.MSG_USER_AUCTION_HELP
        ];
        //有新消息才刷新
        if (WeiQuPai.Notify.hasNotify(msgType)) {
            this.loadData();
            WeiQuPai.Notify.clearNotify(msgType);
        }
    },

    loadData: function() {
        if (this.getStore().isLoading()) {
            return false;
        }
        var user = WeiQuPai.Cache.get('currentUser');
        if (!user) {
            return false;
        }
        this.msgbox.hide();
        //fix 出现loading的bug
        this.setLoadingText(null);
        var store = this.getStore();
        //加载数据
        store.getProxy().setExtraParam('token', user.token);
        store.loadPage(1, function(records, operation, success) {
            if (!success) {
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if (records.length == 0) {
                this.msgbox.show();
                return;
            }
            //登录超时
            if (!WeiQuPai.Util.invalidToken(records[0].raw)) {
                store.removeAll();
                return false;
            }
            //通知标红点
        }, this);
    }
});