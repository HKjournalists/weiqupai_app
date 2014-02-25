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
        var detailView = Ext.create('WeiQuPai.view.ItemDetail');
        detailView.setParam(record.data);
        this.getMain().push(detailView);
    }
});
