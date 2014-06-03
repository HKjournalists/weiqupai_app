Ext.define('WeiQuPai.controller.Today', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            pageView : 'today',
            main: 'main',
            todayBtn: 'today button[action=todayItem]',
            specialBtn: 'today button[action=specialItem]'

        },
        control: {
           pageView : {
                itemtap: 'showDetail'
           },
           specialBtn: {
                tap: 'showSpecial'
           }
        }
    },
    
    showDetail: function(list, index, dataItem, record, e){
        var detailView = Ext.create('WeiQuPai.view.ItemDetail');
        detailView.setParam(record.data);
        this.getMain().push(detailView);
    },

    //切换到专场tab
    showSpecial: function(){
        var view = Ext.create('WeiQuPai.view.SpecialSale');
        view.setParam({id:3, title: '世界杯专场'});
        this.getMain().push(view);
    },

});
