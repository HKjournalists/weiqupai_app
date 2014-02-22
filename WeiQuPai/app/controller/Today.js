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
    
    showDetail: function(list, index, dataItem, record, e){
        var detailView = {
            xtype: 'itemdetail',
            paramId: record.get('id')
        };
        this.getMain().push(detailView);
    }
});
