Ext.define('WeiQuPai.view.MyOrder', {
    extend: 'Ext.dataview.List',
    xtype: 'myorder',
    requires: ['WeiQuPai.store.MyOrder', 'WeiQuPai.view.MyOrderDetail', 'WeiQuPai.view.LoginTip'],
    config: {
        cls: 'bg_ef',
        loadingText: null,
        disableSelection: true,
        store: 'MyOrder',
        baseCls: 'x-innerhtml-new',
        itemTpl: new Ext.XTemplate(
            '<div class="myorder mg_10" >',
            '<div class="orderlist" data-orderlist="{#}">',
            '<div class="left">',
            '<ul>',
            '<li>',
            '成交价格:<span style="color:#e76049">￥{price}</span>',
            '</li>',
            '<li>',
            '订单编号:{id}',
            '</li>',
            '<li>',
            '订单金额:{total_pay}',
            '</li>',
            '<li>',
            '下单时间:{ctime}',
            '</li>',
            '</ul>',
            '</div>',
            '<div class="right">',
            '<ul>',
            '<li>',
            '{[this.getStatusText(values.status)]}',
            '</li>',
            '<li style="height:18px;color:#e76049;">',
            '<tpl if="this.shipment(status)">',
            '查看物流',
            '</tpl>',
            '</li>',

            '<li><input type="button" value="{[this.getButtonText(values.status)]}" class="btn_e7"/></li>',
            '</ul>',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '<div class="order_dis" data-orderdis="{#}">',
            '<div class="left">',
            '<img src="{[this.getCover(values.pic_cover)]}" width="50">',
            '</div>',
            '<div class="right">',
            '{title}',
            '</div>',
            '<div style="clear:both"></div>',
            '</div>',
            '</div>', {
                getStatusText: function(status) {
                    return WeiQuPai.Config.orderStatusText[status];
                },
                getButtonText: function(status) {
                    var text;
                    if (status = WeiQuPai.Config.orderStatus.STATUS_TOPAY) {
                        text = "去支付";
                    } else if (status = WeiQuPai.Config.orderStatus.STATUS_FINISH) {
                        text = "去晒单";
                    } else if (status = WeiQuPai.Config.orderStatus.STATUS_SHIPMENT) {
                        text = "确认收货";
                    } else if (status = WeiQuPai.Config.orderStatus.STATUS_TODEA) {
                        text = "确认收货";
                    }
                    // var text = {
                    //     WeiQuPai.Config.orderStatus.STATUS_TOPAY: '去支付',
                    //     WeiQuPai.Config.orderStatus.STATUS_FINISH: '去晒单',
                    //     WeiQuPai.Config.orderStatus.STATUS_SHIPMENT: '确认收货',
                    //     WeiQuPai.Config.orderStatus.STATUS_TODEAL: '确认收货'
                    // };

                    return text;
                },
                getCover: function(cover) {
                    return WeiQuPai.Util.getImagePath(cover, '290');
                },
                shipment: function(status) {
                    return status == WeiQuPai.Config.orderStatus.STATUS_SHIPMENT
                }
            }
        ),
        items: [{
            xtype: 'vtitlebar',
            title: '我的订单',
            cls: 'titlebar2',
            docked: 'top',
            items: [{
                iconCls: 'user',
                action: 'ucenter'
            }]
        }]

    },

    initialize: function() {
        this.callParent(arguments);

        this.msgbox = WeiQuPai.Util.msgbox('您还没有拍到任何宝贝');
        this.add(this.msgbox);

        this.loginTip = Ext.create('WeiQuPai.view.LoginTip');
        this.add(this.loginTip);

        this.on('activate', this.loadData, this);

        this.onBefore('itemtap', function(list, index, dataItem, record, e) {
            if (e.target.className == 'pay-btn') {
                this.fireEvent('gopay', list, index, dataItem, record, e);
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
            this.getStore().removeAll();
            this.msgbox.hide();
            this.loginTip.show();
            return false;
        }
        this.loginTip.hide();
        this.msgbox.hide();
        //fix 出现loading的bug
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