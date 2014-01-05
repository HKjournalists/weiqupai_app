Ext.define('WeiQuPai.controller.ItemDetail', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            textList : 'itemdetailtextlist',
            pai: 'button[action=order]',
            commentBtn: 'button[action=commment]'         
        },
        control: {
           textList : {
                itemsingletap: 'showDetail'
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
            xtype: 'order'
        }
        this.getMain().push(payView);
    },

    showCommentInput: function(){

    }


});
