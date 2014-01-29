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
        if(this.getMain().getActiveItem().xtype == 'myauctiondetail') return;
        var detailView = {
            xtype: 'myauctiondetail',
            titleTpl: '{name}'
        };
        this.getMain().push(detailView);
    }
});
