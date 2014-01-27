Ext.define('WeiQuPai.controller.MyFriend', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
            myfriend: 'myfriend' 
    	},
        control: {
        	myfriend: {
              'itemdelete': 'doItemDelete'
            }
        }
    },

    doItemDelete: function(list, index, dataItem, record, e){
        console.log(index + ', delete');
    }
});
