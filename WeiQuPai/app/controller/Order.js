Ext.define('WeiQuPai.controller.Order', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            orderView: 'order',
            paymentPanel: 'disclosureitem[itemId=payment]',
            paymentList: 'paymentlist list',
            deliveryTimePanel: 'disclosureitem[itemId=delivery_time]',
            deliveryTimeList: 'deliverytimelist list',
            propPanel: 'disclosureitem[itemId=prop]',
            couponPanel: 'disclosureitem[itemId=coupon]',
            consigneePanel: 'disclosureitem[itemId=consignee]',
            consigneeList: 'myconsignee',
            propList: 'myprop',
            couponList: 'mycoupon',
            submitButton: 'button[action=submitOrder]'
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
           submitButton: {
                tap: 'submitOrder'
           }
        }
    },

    showConsigneeList: function(){
        var view = Ext.create('WeiQuPai.view.MyConsignee');
        view.on('itemtap', this.selectConsignee, this);
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
        view.on('itemtap', this.selectCoupon, this);
        this.getMain().push(view);
    },

    showPropList : function(){
        var view = Ext.create('WeiQuPai.view.MyProp');
        view.on('itemtap', this.selectProp, this);
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
        var html = this.getOrderView().consigneeTpl.apply(record.getData());
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
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        var order = this.getOrderView().getRecord();
        if(WeiQuPai.Util.hasAuction(order.get('auction_id'))){
            Ext.Msg.alert(null, '您已经拍过该商品');
            return;
        }
        if(!order.get('consignee_id')){
            Ext.Msg.alert(null, '还没有选择收货地址');
            return false;
        }
        var itemData = this.getOrderView().down('#itemInfo').getData();
        var param = WeiQuPai.Util.filterNull(order.data);
        param.token = user.token;
        WeiQuPai.Util.mask();
        Ext.Ajax.request({
            url: order.getProxy().getApi().create,
            method: 'post',
            params: param,
            success: function(rsp){
                WeiQuPai.Util.unmask();
                rsp = Ext.decode(rsp.responseText);
                if(!WeiQuPai.Util.invalidToken(rsp)) return false;
                if(!rsp.success){
                    Ext.Msg.alert(null, rsp.msg);
                    return;
                }
                //将拍过的商品保存到cache中
                var auctions = WeiQuPai.Cache.get('auctions') || [];
                auctions.push(order.get('auction_id'));
                WeiQuPai.Cache.set('auctions', auctions);

                var data = Ext.merge({title:itemData.title, pic_cover: itemData.pic_cover}, rsp);
                WeiQuPai.Util.forward('ordersuccess', {orderData:data});
            },
            failure: function(rsp){
                WeiQuPai.Util.unmask();
                Ext.Msg.alert(null, '数据提交失败');
            }
        });
    }
});
