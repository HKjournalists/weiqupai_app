Ext.define('WeiQuPai.controller.Order', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main',
            orderView: 'order',
            deliveryTimePanel: 'disclosureitem[itemId=delivery_time]',
            deliveryTimeList: 'deliverytimelist list',
            consigneePanel: 'disclosureitem[itemId=consignee]',
            consigneeList: 'myconsignee',
            submitButton: 'button[action=submitOrder]'
        },
        control: {
            deliveryTimePanel: {
                tap: 'showDeliveryTimeList'
            },
            deliveryTimeList: {
                itemtap: 'selectDeliveryTime'
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
        view.on('itemtap', this.selectConsignee, this);
        this.getMain().push(view);
    },
    showDeliveryTimeList: function() {
        this.getDeliveryTimeList().up('deliverytimelist').show();
    },


    //选择收货人
    selectConsignee: function(list, index, dataItem, record, e) {
        this.getMain().pop();
        this.getOrderView().getRecord().set('consignee_id', record.get('id'));
        var html = this.getOrderView().consigneeTpl.apply(record.getData());
        this.getConsigneePanel().setContent(html);
    },

    //选择发货时间
    selectDeliveryTime: function(list, index, dataItem, record, e) {
        this.getOrderView().getRecord().set('delivery_time', record.get('title'));
        var time = record.get('title');
        this.getDeliveryTimePanel().setContent(time);
        this.getDeliveryTimeList().up('deliverytimelist').hide();
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
        var itemData = this.getOrderView().down('#orderInfo').getData();
        var param = WeiQuPai.Util.filterNull(order.data);
        param.token = user.token;
        WeiQuPai.Util.mask();
        var url = order.getProxy().getApi().create;
        WeiQuPai.Util.post(url, param, function(rsp) {
            //将拍过的商品保存到cache中
            WeiQuPai.Util.setCache('auction', parseInt(order.get('auction_id')));
            var data = Ext.merge({
                title: itemData.title,
                pic_cover: itemData.pic_cover
            }, rsp);
            WeiQuPai.Util.forward('pay', {
                orderData: data
            });
        });
    }
});