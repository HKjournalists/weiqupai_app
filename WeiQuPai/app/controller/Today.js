Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            itemlist : 'itemlist',
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
            title: '拍品介绍',
            xtype: 'itemdetail'
        };
        this.getMain().push(detailView);
    }
});
