Ext.define('WeiQuPai.view.NewMessage', {
	extend: 'Ext.Container',
	xtype: 'newmessage',
	requires: [
		'WeiQuPai.view.DisclosureItem', 'Ext.field.Toggle'
	],

	config: {
		items:[
			{
				xtype: 'disclosureitem',
				title: '允许推送新品信息',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'notifyNewItem'
				}
			},
			{
				xtype: 'disclosureitem',
				title: '允许推送好友动态',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'notifyFeed'
				}
			},
			{
				xtype: 'disclosureitem',
				title: '允许推送拍品最新价格',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'notifyItemPrice'
				}
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		var user = WeiQuPai.Cache.get('currentUser');
		if(!user) return;

		this.callParent(arguments);
		this.down('#notifyNewItem').setValue(user.notify_new_item);
		this.down('#notifyFeed').setValue(user.notify_feed);
		this.down('#notifyItemPrice').setValue(user.notify_item_price);
	}
});
