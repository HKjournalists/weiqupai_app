Ext.define('WeiQuPai.controller.Order', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            orderView: 'order',
            shipmentPanel: 'disclosureitem[itemId=shipment]',
            shipmentList: 'shipmentlist list',
            paymentPanel: 'disclosureitem[itemId=payment]',
            paymentList: 'paymentlist list',
            deliveryTimePanel: 'disclosureitem[itemId=deliverytime]',
            deliveryTimeList: 'deliverytimelist list',
            propPanel: 'disclosureitem[itemId=prop]',
            consigneePanel: 'disclosureitem[itemId=consignee]',
            consigneeList: 'consigneelist',
            payButton: 'button[action=pay]'
        },
        control: {
           paymentPanel: {
                tap: 'showPaymentList'
           }, 
           shipmentPanel: {
                tap: 'showShipmentList'
           },
           deliveryTimePanel: {
                tap: 'showDeliveryTimeList'
           },
           shipmentList: {
                itemtap: 'selectShipment'
           },
           paymentList: {
                itemtap: 'selectPayment'
           },
           deliveryTimeList: {
                itemtap: 'selectDeliveryTime',
           },
           consigneePanel: {
                tap: 'showConsigneeList'
           },
           consigneelist: {
                itemtap: 'selectConsignee'
           },
           payButton: {
                tap: 'submitOrder'
           }
        }
    },
    
    showConsigneeList: function(){
        var view = Ext.create('WeiQuPai.view.ConsigneeList');
        var selected = this.getOrderView().getRecord().get('consignee');
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

    showShipmentList: function(){
        this.getShipmentList().up('shipmentlist').show();
    },

    showPropList : function(){

    },
    showCouponList: function(){

    },
    selectProp: function(list, index, dataItem, record, e){
    },
    selectCoupon: function(list, index, dataItem, record, e){
    },

    //选择收货人
    selectConsignee: function(list, index, dataItem,record, e){
        this.getMain().pop();
        this.getOrderView().getRecord().set('consignee', record.get('id'));
        var html = list.getItemTpl().apply(record.getData());
        this.getConsigneePanel().setContent(html);
    },
    selectDeliveryTime: function(list, index, dataItem, record, e){
        this.getOrderView().getRecord().set('deliveryTime', record.get('title'));
        var time = record.get('title'); 
        this.getDeliveryTimePanel().setContent(time);
        this.getDeliveryTimeList().up('deliverytimelist').hide();
    },

    selectPayment: function(list, index, dataItem, record, e){
        this.getOrderView().getRecord().set('payment', record.get('title'));
        var shipment = record.get('title'); 
        this.getPaymentPanel().setContent(shipment);
        this.getPaymentList().up('paymentlist').hide();
    },

    selectShipment: function(list, index, dataItem, record, e){
        this.getOrderView().getRecord().set('shipment', record.get('title'));
        var shipment = record.get('title'); 
        this.getShipmentPanel().setContent(shipment);
        this.getShipmentList().up('shipmentlist').hide();
    },

    submitOrder: function(){
        Ext.Msg.alert('发生错误', '还没有选择收货地址');
    }
});
