Ext.define('WeiQuPai.controller.MyAuctionDetail', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            funcList : '#funcList'
        },
        control: {
           funcList : {
                itemtap: 'showDetail'
           } 
        }
    },
    
    showDetail: function(list, index, dataItem, record, e){
        var detailView = {
            xtype: record.getId()
        };
        this.getMain().push(detailView);
    }
});
