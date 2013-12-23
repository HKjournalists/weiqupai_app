Ext.define('WeiQuPai.controller.MyAuction', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            itemlist : 'myauction',
            main: 'main'
        },
        control: {
           itemlist : {
                itemtap: 'showDetail'
           } 
        }
    },
    
    showDetail: function(list, index, dataItem, record, e){
        var detailView = {
            xtype: 'myauctiondetail'
        };
        this.getMain().push(detailView);
    }
});
