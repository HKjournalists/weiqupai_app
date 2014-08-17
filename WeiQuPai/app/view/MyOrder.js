Ext.define('WeiQuPai.view.MyOrder', {
    extend: 'Ext.DataView',
    xtype: 'myorder',
    requires: ['WeiQuPai.view.MyOrderDetail', 'WeiQuPai.view.ShowOrder', 'WeiQuPai.view.Shipment'],
    config: {
        cls: 'bg_ef',
        loadingText: null,
        disableSelection: true,
        scrollToTopOnRefresh: false,
        store: 'MyOrder',
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
            '<li>成交价格：<span style="color:#e76049">￥{price}</span></li>',
            '<li>订单编号：{id}</li>',
            '<li>订单金额：{total_pay}</li>',
            '<li>下单时间：{ctime}</li>',
            '</ul>',
            '</div>',
            '<div class="right">',
            '<ul>',
            '<li>{[this.getStatusText(values.status)]}</li>',
            '<li style="height:18px;color:#e76049;"></li>',
            '<tpl if="this.hasBtn(status)"><li><input type="button" value="{[this.getButtonText(values.status)]}" class="btn_e7" id="orderbtn" /></li></tpl>',
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
                getStatusText: function(status) {
                    return WeiQuPai.Config.orderStatusText[status];
                },
                getButtonText: function(status) {
                    var text = {};
                    text[WeiQuPai.Config.orderStatus.STATUS_TOPAY] = '去支付';
                    text[WeiQuPai.Config.orderStatus.STATUS_FINISH] = '去晒单';
                    text[WeiQuPai.Config.orderStatus.STATUS_SHIPMENT] = '确认收货';
                    text[WeiQuPai.Config.orderStatus.STATUS_TODEAL] = '确认收货';
                    return text[status];

                },
                getCover: function(cover) {
                    return WeiQuPai.Util.getImagePath(cover, '200');
                },
                hasBtn: function(status) {
                    return (status <= WeiQuPai.Config.orderStatus.STATUS_FINISH) && (status != WeiQuPai.Config.orderStatus.STATUS_CANCEL_NOPAY);
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '我的订单',
            docked: 'top',
            items: [{
                baseCls: 'user',
                action: 'ucenter'
            }]
        }]

    },

    getEventList: function() {
        var eventList = {};
        eventList[WeiQuPai.Config.orderStatus.STATUS_TOPAY] = 'pay';
        eventList[WeiQuPai.Config.orderStatus.STATUS_FINISH] = 'showorder';
        eventList[WeiQuPai.Config.orderStatus.STATUS_SHIPMENT] = 'confirm';
        eventList[WeiQuPai.Config.orderStatus.STATUS_TODEAL] = 'confirm';
        return eventList;
    },

    initialize: function() {
        this.callParent(arguments);
        this.msgbox = WeiQuPai.Util.msgbox();
        this.add(this.msgbox);

        this.loadData();

        this.on('activate', this.onActivate, this);

        this.onBefore('itemtap', function(list, index, dataItem, record, e) {
            if (e.target.tagName.toLowerCase() == 'input') {
                var eventList = this.getEventList();
                var event = eventList[record.get('status')];
                this.fireEvent(event, list, index, dataItem, record, e);
                return false;
            }
            if (Ext.get(e.target).findParent('.order_dis')) {
                this.fireEvent('view_item', list, index, dataItem, record, e);
                return false;
            }
        }, this);
    },

    onActivate: function() {
        var msgType = [WeiQuPai.Notify.MSG_NEW_ORDER];
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
        this.setLoadingText(null);
        var store = this.getStore();
        //加载数据
        store.getProxy().setExtraParam('token', user.token);
        store.load(function(records, operation, success) {
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
        }, this);
    }
});