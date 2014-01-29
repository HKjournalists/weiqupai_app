Ext.define('WeiQuPai.view.Private', {
	extend: 'Ext.Container',
	xtype: 'private',
	requires: [
		'WeiQuPai.view.DisclosureItem', 'Ext.field.Toggle'
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '隐私',
				docked: 'top'
			},
			{
				xtype: 'disclosureitem',
				title: '加我好友需要验证',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'validateOnAddFriend'
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
				itemId: 'showFeedFor'
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		this.callParent(arguments);
		this.down('#validateOnAddFriend').setValue(1);
		//this.down('#canBeSearched').setValue(1);
	}
});
