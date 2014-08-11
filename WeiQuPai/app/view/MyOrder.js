Ext.define('WeiQuPai.view.MyOrder', {
    extend: 'Ext.DataView',
    xtype: 'myorder',
    requires: ['WeiQuPai.view.MyOrderDetail', 'WeiQuPai.view.ShowOrder'],
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
            '<li style="height:18px;color:#e76049;"<tpl if="this.shipment(status)"> class="shipment_btn">查看物流</tpl></li>',
            '<li><input type="button" value="{[this.getButtonText(values.status)]}" class="btn_e7"/></li>',
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
                shipment: function(status) {
                    return status == WeiQuPai.Config.orderStatus.STATUS_SHIPMENT
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
        //this.msgbox = WeiQuPai.Util.msgbox('您还没有拍到任何宝贝');
        this.msgbox = WeiQuPai.Util.msgbox('');
        this.add(this.msgbox);

        this.loadData();

        this.onBefore('itemtap', function(list, index, dataItem, record, e) {
            if (e.target.tagName.toLowerCase() == 'input') {
                var eventList = this.getEventList();
                var event = eventList[record.get('status')];
                this.fireEvent(event, list, index, dataItem, record, e);
                return false;
            }
            if (e.target.className == 'shipment_btn') {
                this.fireEvent('shipment', list, index, dataItem, record, e);
                return false;
            }
            if (Ext.get(e.target).findParent('.order_dis')) {
                this.fireEvent('view_item', list, index, dataItem, record, e);
                return false;
            }
        }, this);
    },

    setBadge: function(orderId) {
        var item = this.getItemAt(this.getStore().indexOfId(orderId));
        if (!item) return;
        var badgeEl = item.element.down('.x-badge');
        badgeEl.addCls('w-badge-mdot');
        badgeEl.parent().addCls('x-hasbadge');
        badgeEl.show();
    },

    clearBadge: function(orderId) {
        var item = this.getItemAt(this.getStore().indexOfId(orderId));
        if (!item) return;
        var badgeEl = item.element.down('.x-badge');
        badgeEl.removeCls('w-badge-mdot');
        badgeEl.parent().removeCls('x-hasbadge');
        badgeEl.hide();
    },

    loadData: function() {
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
            //通知标红点
            WeiQuPai.Notify.notify([WeiQuPai.Notify.MSG_NEW_ORDER, WeiQuPai.Notify.MSG_ORDER_SHIP]);
        }, this);
    }
});