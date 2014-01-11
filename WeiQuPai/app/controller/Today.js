Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            itemlist : 'today',
            main: 'main'
        },
        control: {
           itemlist : {
                itemtap: 'showDetail'
           } 
        }
    },
    
    //called when the Application is launched, remove if not needed
    showDetail: function(list, index, dataItem, record, e){
        var detailView = {
            xtype: 'itemdetail'
        };
        this.getMain().push(detailView);
    }
});
