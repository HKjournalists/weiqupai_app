Ext.define('WeiQuPai.controller.Order', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            orderView: 'order',
            deliveryTimePanel: 'order disclosureitem[itemId=delivery_time]',
            deliveryTimeList: 'deliverytimelist',
            consigneePanel: 'order disclosureitem[itemId=consignee]',
            submitButton: 'button[action=submitOrder]'
        },
        control: {
            deliveryTimePanel: {
                tap: 'showDeliveryTimeList'
            },
            deliveryTimeList: {
                selected: 'selectDeliveryTime'
            },
            consigneePanel: {
                tap: 'showConsigneeList'
            },
            submitButton: {
                tap: 'submitOrder'
            }
        }
    },

    showConsigneeList: function() {
        var view = Ext.create('WeiQuPai.view.MyConsignee', {
            selectMode: true
        });
        view.on('selected', this.selectConsignee, this);
        WeiQuPai.navigator.push(view);
    },
    showDeliveryTimeList: function() {
        this.getDeliveryTimeList().show();
    },

    //选择收货人
    selectConsignee: function(record) {
        WeiQuPai.navigator.pop();
        this.getOrderView().getRecord().set('consignee_id', record.get('id'));
        var html = this.getOrderView().consigneeTpl.apply(record.getData());
        this.getConsigneePanel().setContent(html);
    },

    //选择发货时间
    selectDeliveryTime: function(list, record) {
        var title = record.get('title');
        this.getOrderView().getRecord().set('delivery_time', title);
        this.getDeliveryTimePanel().setContent(title);
        this.getDeliveryTimeList().hide();
    },

    submitOrder: function() {
        var user = WeiQuPai.Util.checkLogin();
        if (!user) return;
        var order = this.getOrderView().getRecord();
        if (WeiQuPai.Util.hasAuction(order.get('auction_id'))) {
            WeiQuPai.Util.toast('您已经拍过该商品');
            return;
        }
        if (!order.get('consignee_id')) {
            WeiQuPai.Util.toast('还没有选择收货地址');
            return false;
        }
        var itemData = this.getOrderView().down('#orderInfo').getData().item;
        var param = WeiQuPai.Util.filterNull(order.data);
        param.token = user.token;
        var url = order.getProxy().getApi().create;
        WeiQuPai.Util.post(url, param, function(rsp) {
            //将拍过的商品保存到cache中
            WeiQuPai.Util.setCache('auction', parseInt(order.get('auction_id')));
            var data = Ext.merge(itemData, rsp);
            WeiQuPai.Util.forward('pay', {
                orderData: data
            });
        }, {
            mask: true
        });
    }
});