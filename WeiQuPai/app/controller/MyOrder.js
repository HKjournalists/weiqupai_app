Ext.define('WeiQuPai.controller.MyOrder', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            itemlist: 'myorder',
        },
        control: {
            itemlist: {
                itemtap: 'showDetail',
                pay: 'doPay',
                showorder: 'doShowOrder',
                confirm: 'doConfirm',
                shipment: 'doShipment',
                view_item: 'doViewItem'
            }
        }
    },

    showDetail: function(list, index, dataItem, record, e) {
        var detailView = Ext.create('WeiQuPai.view.MyOrderDetail', {
            record: record
        });
        WeiQuPai.navigator.push(detailView);
    },

    doPay: function(list, index, dataItem, record, e) {
        var pay = Ext.create('WeiQuPai.view.Pay');
        pay.setOrderData(record.data);
        WeiQuPai.navigator.push(pay);
    },

    doConfirm: function(list, index, dataItem, record, e) {
        var confirmLayer = WeiQuPai.Util.createOverlay('WeiQuPai.view.ConfirmLayer');
        confirmLayer.setConfirmAction(function() {
            var user = WeiQuPai.Cache.get('currentUser');
            var url = WeiQuPai.Config.apiUrl + '/?r=appv2/MyOrder/confirm';
            var param = {
                id: record.get('id'),
                token: user.token
            };
            WeiQuPai.Util.post(url, param, function() {
                WeiQuPai.Util.toast('您已成功确认收货');
                record.set('status', WeiQuPai.Config.orderStatus.STATUS_FINISH);
            });
        });
        confirmLayer.show();
    },

    doShowOrder: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.ShowOrder');
        view.setRecord(record);
        WeiQuPai.navigator.push(view);
    },

    doViewItem: function(list, index, dataItem, record, e) {
        WeiQuPai.Util.goItemView(record.get('item_id'));
    }
});