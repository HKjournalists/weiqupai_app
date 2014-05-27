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
        var payment = record.get('payment');
        var orderId = record.get('id');
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + "/?r=app/pay&id=" + orderId + '&token=' + user.token;
        window.open(url, '_blank', 'location=no,title=支付');
    }
});
