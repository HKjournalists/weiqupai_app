Ext.define('WeiQuPai.controller.MyConsignee', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myconsignee: 'myconsignee' 
    	},
        control: {
        	myconsignee: {
              'itemdelete': 'doItemDelete',
              'itemdefault': 'doItemSetDefault'
            }
        }
    },

    doItemDelete: function(list, index, dataItem, record, e){
        console.log(index + ', delete');
    },

    doItemSetDefault: function(list, index, dataItem, record, e){
        console.log(index + ', set default');
    }
});
