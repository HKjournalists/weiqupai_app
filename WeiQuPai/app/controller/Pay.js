Ext.define('WeiQuPai.controller.Pay', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            payView: 'pay',
            shipmentPanel: 'disclosureitem[itemId=shipment]',
            shipmentList: 'shipmentlist list',
            paymentPanel: 'disclosureitem[itemId=payment]',
            paymentList: 'paymentlist list',
            deliveryTimePanel: 'disclosureitem[itemId=deliverytime]',
            deliveryTimeList: 'deliverytimelist list',
            propPanel: 'disclosureitem[itemId=prop]',
            consigneePanel: 'disclosureitem[itemId=consignee]',
            consigneeList: 'consigneelist',
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
           }
        }
    },
    
    showConsigneeList: function(){
        var view = {
            xtype: 'consigneelist'
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
        var html = list.getItemTpl().apply(record.getData());
        this.getConsigneePanel().setContent(html);
    },
    selectDeliveryTime: function(list, index, dataItem, record, e){
        var time = record.get('title'); 
        this.getDeliveryTimePanel().setContent(time);
        this.getDeliveryTimeList().up('deliverytimelist').hide();
    },

    selectPayment: function(list, index, dataItem, record, e){
        var shipment = record.get('title'); 
        this.getPaymentPanel().setContent(shipment);
        this.getPaymentList().up('paymentlist').hide();
    },

    selectShipment: function(list, index, dataItem, record, e){
        var shipment = record.get('title'); 
        this.getShipmentPanel().setContent(shipment);
        this.getShipmentList().up('shipmentlist').hide();
    }   
});
