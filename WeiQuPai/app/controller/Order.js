Ext.define('WeiQuPai.controller.Order', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            orderView: 'order',
            paymentPanel: 'disclosureitem[itemId=payment]',
            paymentList: 'paymentlist list',
            deliveryTimePanel: 'disclosureitem[itemId=deliverytime]',
            deliveryTimeList: 'deliverytimelist list',
            propPanel: 'disclosureitem[itemId=prop]',
            couponPanel: 'disclosureitem[itemId=coupon]',
            consigneePanel: 'disclosureitem[itemId=consignee]',
            consigneeList: 'myconsignee',
            propList: 'myprop',
            couponList: 'mycoupon',
            payButton: 'button[action=pay]'
        },
        control: {
           paymentPanel: {
                tap: 'showPaymentList'
           }, 
           couponPanel: {
                tap: 'showCouponList'
           },
           propPanel: {
                tap: 'showPropList'
           },
           deliveryTimePanel: {
                tap: 'showDeliveryTimeList'
           },
           paymentList: {
                itemtap: 'selectPayment'
           },
           deliveryTimeList: {
                itemtap: 'selectDeliveryTime'
           },
           consigneePanel: {
                tap: 'showConsigneeList'
           },
           consigneeList: {
                itemtap: 'selectConsignee'
           },
           propList: {
                itemtap: 'selectProp'
           },
           couponList: {
                itemtap: 'selectCoupon'
           },
           payButton: {
                tap: 'submitOrder'
           }
        }
    },
    
    consigneeTpl : new Ext.XTemplate(
        '<div class="content">',
            '<p>收货人：{name}</p>',
            '<p>电话：{mobile}</p>',
            '<p>地址：{province}{city}{address}</p>',
            '<p>邮编：{zip}</p>',
        '</div>'
    ),

    showConsigneeList: function(){
        var view = Ext.create('WeiQuPai.view.MyConsignee');
        var selected = this.getOrderView().getRecord().get('consignee_id');
        if(selected){
            var idx = view.getStore().indexOfId(selected);
            view.select(idx);
        }
        this.getMain().push(view);
    },
    showDeliveryTimeList: function(){
       this.getDeliveryTimeList().up('deliverytimelist').show();
    }, 

    showPaymentList: function(){
       this.getPaymentList().up('paymentlist').show();
    }, 

    showCouponList: function(){
        var view = Ext.create('WeiQuPai.view.MyCoupon');
        view.setDisableSelection(false);
        var selected = this.getOrderView().getRecord().get('coupon');
        if(selected){
            var idx = view.getStore().findExact('coupon_id', selected);
            view.select(idx);
        }
        this.getMain().push(view);
    },

    showPropList : function(){
        var view = Ext.create('WeiQuPai.view.MyProp');
        view.setDisableSelection(false);
        var selected = this.getOrderView().getRecord().get('prop');
        if(selected){
            var idx = view.getStore().findExact('prop_id', selected);
            view.select(idx);
        }
        this.getMain().push(view);
    },

    //选择使用道具
    selectProp: function(list, index, dataItem, record, e){
        this.getMain().pop();
        this.getOrderView().getRecord().set('prop', record.get('prop_id'));
        this.getPropPanel().setContent(record.get('prop_info').name);
    },

    //选择使用拍券
    selectCoupon: function(list, index, dataItem, record, e){
        this.getMain().pop();
        var order = this.getOrderView().getRecord();
        order.set('coupon', record.get('coupon_id'))
        order.set('total_pay', total_pay);;
        this.getCouponPanel().setContent(record.get('coupon_info').name);
        var curr_price = parseFloat(order.get('price'));
        var total_pay = Math.max(0, curr_price - parseFloat(record.get('coupon_info').value));
        var itemInfo = this.getOrderView().down('#itemInfo');
        var data = itemInfo.getData();
        data.total_pay = total_pay;
        itemInfo.setData(data);
    },

    //选择收货人
    selectConsignee: function(list, index, dataItem,record, e){
        this.getMain().pop();
        this.getOrderView().getRecord().set('consignee_id', record.get('id'));
        var html = this.consigneeTpl.apply(record.getData());
        this.getConsigneePanel().setContent(html);
    },

    //选择发货时间
    selectDeliveryTime: function(list, index, dataItem, record, e){
        this.getOrderView().getRecord().set('delivery_time', record.get('title'));
        var time = record.get('title');
        this.getDeliveryTimePanel().setContent(time);
        this.getDeliveryTimeList().up('deliverytimelist').hide();
    },

    selectPayment: function(list, index, dataItem, record, e){
        this.getOrderView().getRecord().set('payment', record.get('title'));
        var payment = record.get('title'); 
        this.getPaymentPanel().setContent(payment);
        this.getPaymentList().up('paymentlist').hide();
    },

    submitOrder: function(){
        var order = this.getOrderView().getRecord();
        if(!order.get('consignee_id')){
            Ext.Msg.alert(null, '还没有选择收货地址');
            return false;
        }
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: order.getProxy().getUrl(),
            method: 'post',
            params: WeiQuPai.Util.filterNull(order.data),
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(!rsp.success){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                Ext.Msg.alert(null, '订单提交成功');
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.msg.Alert(null, '数据提交失败');
            }
        });
    }
});
