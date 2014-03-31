Ext.define('WeiQuPai.controller.MyAuctionDetail', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            pageView: 'myauctiondetail',
            payBtn: 'myauctiondetail button[action=pay]',
            showBtn: 'myauctiondetail button[action=showOrder]'
        },
        control: {
            payBtn: {
                tap: 'doPay'
            },
            showBtn: {
                tap: 'doShowOrder'
            }
        }
    },

    doPay: function(){
        var data = this.getPageView().getRecord().data;
        var payment = data.payment;
        var orderId = data.id;
        WeiQuPai.Util.forward('pay', {orderId:orderId, payment:payment});
    },

    doShowOrder: function(){
        Ext.Msg.alert(null, '秀！');
    }
});
