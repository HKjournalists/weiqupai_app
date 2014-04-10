Ext.define('WeiQuPai.controller.MyAuction', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            itemlist : 'myauction',
            main: 'main'
        },
        control: {
           itemlist : {
                itemtap: 'showDetail',
                gopay: 'goPay',
           } 
        }
    },
    
    showDetail: function(list, index, dataItem, record, e){
        var detailView = {
            xtype: 'myauctiondetail',
            record: record
        };
        this.getMain().push(detailView);
    },

    goPay: function(list, index, dataItem ,record, e){
        var payView = Ext.create('WeiQuPai.view.Pay', {
            orderId: record.get('id'),
            payment: record.get('payment')
        });
        this.getMain().push(payView);
    }
});
