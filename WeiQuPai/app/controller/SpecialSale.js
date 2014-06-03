Ext.define('WeiQuPai.controller.SpecialSale', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            pageView : 'specialsale',
            main: 'main'
        },
        control: {
           pageView : {
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
