Ext.define('WeiQuPai.controller.Private', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		toggleAddFriend: 'togglefield[itemId=validateOnAddFriend]',
            toggleSearch: 'togglefield[itemId=canBeSearched]',
            showFeedFor: 'disclosureitem[itemId=showFeedFor]',
            feedOption: 'feedshowoption list'
    	},
        control: {
        	toggleAddFriend: {change:'doToggleAddFriend'}, 
            toggleSearch: {change: 'doToggleSearch'},
            showFeedFor: {tap: 'showFeedOption'},
            feedOption: {itemtap: 'selectFeedOption'}
        }
    },

    doToggleAddFriend: function(field, oldValue, newValue){
    	console.log(newValue);
    },

    doToggleSearch: function(field, oldValue, newValue){
        console.log(newValue);
    },

    showFeedOption: function(){
       this.getFeedOption().up('feedshowoption').show();
    }, 

    selectFeedOption: function(list, index, dataItem,record, e){
        var option = record.get('title'); 
        this.getShowFeedFor().setContent(option);
        this.getFeedOption().up('feedshowoption').hide();
    }
});
