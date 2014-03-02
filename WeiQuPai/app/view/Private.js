Ext.define('WeiQuPai.view.Private', {
	extend: 'Ext.Container',
	xtype: 'private',
	requires: [
		'WeiQuPai.view.DisclosureItem', 'Ext.field.Toggle', 'WeiQuPai.view.FeedShowOption'
	],

	config: {
		items:[
			{
                xtype: 'titlebar',
                title: '隐私',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'disclosureitem',
				title: '加我好友需要验证',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'addFriendAuth'
				}
			},
			{
				xtype: 'disclosureitem',
				title: '可以通过搜索找到我',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'canBeSearched'
				}
			},
			{
				xtype: 'disclosureitem',
				title: '允许下列拍友看到我的动态',
				itemId: 'feedVisible'
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		user = WeiQuPai.Cache.get('currentUser');
		if(!user) return;	
		this.callParent(arguments);
		this.down('#addFriendAuth').setValue(user.add_friend_auth);
		this.down('#canBeSearched').setValue(user.can_be_searched);
		this.addFeedShowOption(user.feed_visible);
	},

	addFeedShowOption: function(opt){
        var optionList = WeiQuPai.Util.createOverlay('WeiQuPai.view.FeedShowOption', {height:130});
        var list = optionList.down('list');
        var record = list.getStore().getById(opt);
        list.select(record);
        var title = record.get('title');
        this.down('#feedVisible').setContent(title);
	}
});
