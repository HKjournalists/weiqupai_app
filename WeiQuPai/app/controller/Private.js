Ext.define('WeiQuPai.controller.Private', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		toggleAddFriend: 'togglefield[itemId=validateOnAddFriend]',
            toggleSearch: 'togglefield[itemId=canBeSearched]'
    	},
        control: {
        	toggleAddFriend: {change:'doToggleAddFriend'}, 
            toggleSearch: {change: 'doToggleSearch'}
        }
    },

    doToggleAddFriend: function(field, oldValue, newValue){
    	console.log(newValue);
    },

    doToggleSearch: function(field, oldValue, newValue){
        console.log(newValue);
    }
});
