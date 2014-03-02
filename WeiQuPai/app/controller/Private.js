Ext.define('WeiQuPai.controller.Private', {
    extend: 'Ext.app.Controller',
    
    config: {
    	refs: {
    		main: 'main',
    		toggleAddFriend: 'togglefield[itemId=addFriendAuth]',
            toggleSearch: 'togglefield[itemId=canBeSearched]',
            feedVisible: 'disclosureitem[itemId=feedVisible]',
            feedOption: 'feedshowoption list'
    	},
        control: {
        	toggleAddFriend: {change:'doToggleAddFriend'}, 
            toggleSearch: {change: 'doToggleSearch'},
            feedVisible: {tap: 'showFeedOption'},
            feedOption: {itemtap: 'selectFeedOption'}
        }
    },

    doToggleAddFriend: function(field, newValue){
        WeiQuPai.Util.updateSetting('add_friend_auth', newValue);
    },

    doToggleSearch: function(field, newValue){
        WeiQuPai.Util.updateSetting('can_be_searched', newValue);
    },

    showFeedOption: function(){
       this.getFeedOption().up('feedshowoption').show();
    }, 

    selectFeedOption: function(list, index, dataItem,record, e){
        var option = record.get('title'); 
        this.getFeedVisible().setContent(option);
        this.getFeedOption().up('feedshowoption').hide();
        WeiQuPai.Util.updateSetting('feed_visible', record.get('id'));
    }
});
