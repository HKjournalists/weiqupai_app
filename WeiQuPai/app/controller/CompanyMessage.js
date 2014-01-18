Ext.define('WeiQuPai.controller.CompanyMessage', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            textList : 'companytitletext'
        },
        control: {
           textList : {
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
