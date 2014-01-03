Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            textList : 'itemdetailtextlist',
            pai: 'button[action=pay]',
            commentBtn: 'button[action=commment]'         
        },
        control: {
           textList : {
                itemtap: 'showDetail'
           },
           pai: {
                tap: 'showPayView'
           },
           commentBtn: {
                tap: 'showCommentInput'
           }
        }
    },
    
    showDetail: function(list, index, dataItem, record, e){
        var detailView = {
            xtype: record.getId()
        };
        this.getMain().push(detailView);
    },

    showPayView: function(){
        var payView = {
            xtype: 'pay'
        }
        this.getMain().push(payView);
    },

    showCommentInput: function(){

    }


});
