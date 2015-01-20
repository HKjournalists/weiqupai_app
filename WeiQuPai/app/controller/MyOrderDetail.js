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
        var pageView = this.getPageView();
        var record = pageView.getRecord();
        var confirmLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ConfirmLayer');
        confirmLayer.setConfirmAction(function() {
            var user = WeiQuPai.Cache.get('currentUser');
            var url = WeiQuPai.Util.apiUrl('r=appv2/MyOrder/confirm');
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
        });
        confirmLayer.show();
    },

    doShowOrder: function() {
        var record = this.getPageView().getRecord();
        var view = Ext.create('WeiQuPai.view.ShowOrder');
        view.setRecord(record);
        WeiQuPai.navigator.push(view);
    },

    doShipment: function() {
        var record = this.getPageView().getRecord();
        var view = Ext.create('WeiQuPai.view.Shipment');
        view.setOrderId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    doShowReturn: function() {
        var view = Ext.create('WeiQuPai.view.ReturnAnnounce');
        WeiQuPai.navigator.push(view);
    },

    doViewItem: function(x) {
        var record = this.getPageView().getRecord();
        WeiQuPai.Util.goItemView(record.get('item_id'));
    }
});