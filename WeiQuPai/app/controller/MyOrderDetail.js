Ext.define('WeiQuPai.controller.MyOrderDetail', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'myorderdetail',
            payBtn: 'disclosureitem[itemId=pay_btn]',
            shipmentBtn: 'disclosureitem[itemId=shipment_btn]',
            showOrderBtn: 'disclosureitem[itemId=show_order_btn]',
            confirmBtn: 'disclosureitem[itemId=confirm_btn]',
            returnBtn: 'disclosureitem[itemId=return_btn]',
        },
        control: {
            payBtn: {
                tap: 'doPay'
            },
            showOrderBtn: {
                tap: 'doShowOrder'
            },
            confirmBtn: {
                tap: 'doConfirm'
            },
            shipmentBtn: {
                tap: 'doShipment',
            },
            returnBtn: {
                tap: 'doShowReturn'
            },
            pageView: {
                view_item: 'doViewItem',
            }
        }
    },

    doPay: function() {
        var record = this.getPageView().getRecord();
        var pay = Ext.create('WeiQuPai.view.Pay');
        pay.setOrderData(record.data);
        WeiQuPai.navigator.push(pay);
    },

    doConfirm: function() {
        var pageView = this.getPageView(),
            record = pageView.getRecord();
        var func = function(buttonId) {
            if (buttonId != 'yes') return;
            var user = WeiQuPai.Cache.get('currentUser');
            var self = this;
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/MyOrder/confirm';
            var param = {
                id: record.get('id'),
                token: user.token
            };
            WeiQuPai.Util.post(url, param, function() {
                WeiQuPai.Util.toast('您已成功确认收货');
                record.set('status', WeiQuPai.Config.orderStatus.STATUS_FINISH);
                pageView.down('#orderInfo').setData(record.data);
                pageView.updateButtonStatus();

            });
        };
        Ext.Msg.confirm(null, '确认收货吗？', func, this);
    },

    doShowOrder: function() {
        var record = this.getPageView().getRecord();
        WeiQuPai.Util.toast('秀！');
    },

    doShipment: function() {
        var record = this.getPageView().getRecord();
        WeiQuPai.Util.forward('shipment', {
            orderId: record.get('id')
        });;
    },

    doShowReturn: function() {
        WeiQuPai.Util.forward('returnannounce');
    },

    doViewItem: function(x) {
        var record = this.getPageView().getRecord();
        WeiQuPai.Util.goItemView(record.get('item_id'));
    }
});