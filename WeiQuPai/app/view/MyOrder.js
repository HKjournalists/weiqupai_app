Ext.define('WeiQuPai.view.MyOrder', {
    extend: 'Ext.dataview.List',
    xtype: 'myauction',
    requires: ['WeiQuPai.store.MyOrder', 'WeiQuPai.view.MyOrderDetail', 'WeiQuPai.view.LoginTip'],
    config: {
        loadingText: null,
        disableSelection: true,
        store: 'MyAuction',
        itemTpl: new Ext.XTemplate(
            '<div class="myauction-row">',
            '<div class="myauction-img"><img src="{[this.getCover(values.pic_cover)]}"/><span class="x-badge"></span></div>',
            '<div class="info">',
            '<h2>{title}</h2>',
            '<p>成交价<span class="fbig">￥{price}</span>',
            '<tpl if="rank != -1">',
            '<p>此价格击败了<span class="fbig">{rank}%</span>的拍友</p>',
            '</tpl>',
            '<p>{ctime}</p>',
            '</div>',
            '<tpl if="this.notPay(status)">',
            '<div class="pay-btn-wrap"><div class="pay-btn">去支付</div></div>',
            '</tpl>', {
                notPay: function(status) {
                    return status == WeiQuPai.Config.orderStatus.STATUS_TOPAY;
                },
                getCover: function(cover) {
                    return WeiQuPai.Util.getImagePath(cover, '290');
                }
            }
        ),
        items: [{
            xtype: 'titlebar',
            title: '已拍',
            docked: 'top',
            cls: 'w-title'
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