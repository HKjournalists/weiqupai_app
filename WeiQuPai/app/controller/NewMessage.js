Ext.define('WeiQuPai.controller.NewMessage', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		toggleNewItem: 'togglefield[itemId=notifyNewItem]',
            toggleItemPrice: 'togglefield[itemId=notifyItemPrice]',
            toggleFeed: 'togglefield[itemId=notifyFeed]'
    	},
        control: {
        	toggleNewItem: {change:'doToggleNewItem'}, 
            toggleItemPrice: {change: 'doToggleItemPrice'},
            toggleFeed: {change: 'doToggleFeed'}
        }
    },

    doToggleNewItem: function(field, newValue){
        WeiQuPai.Util.updateSetting('notify_new_item', newValue);
    },

    doToggleItemPrice: function(field, newValue){
        WeiQuPai.Util.updateSetting('notify_item_price', newValue);
    },

    doToggleFeed: function(field, newValue){
        WeiQuPai.Util.updateSetting('notify_feed', newValue);
    }
});
