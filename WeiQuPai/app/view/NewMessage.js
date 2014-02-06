Ext.define('WeiQuPai.view.NewMessage', {
	extend: 'Ext.Container',
	xtype: 'newmessage',
	requires: [
		'WeiQuPai.view.DisclosureItem', 'Ext.field.Toggle'
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '新消息通知',
				docked: 'top'
			},
			{
				xtype: 'disclosureitem',
				title: '允许推送新品信息',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'pushNewItem'
				}
			},
			{
				xtype: 'disclosureitem',
				title: '允许推送好友动态',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'pushFeeds'
				}
			},
			{
				xtype: 'disclosureitem',
				title: '允许推送拍品最新价格',
				disclosureItem: false,
				content: {
					xtype: 'togglefield',
					cls: 'w-toggle-field',
					itemId: 'pushNewPrice'
				}
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 

	initialize: function(){
		this.callParent(arguments);
		this.down('#pushNewItem').setValue(1);
		this.down('#pushFeeds').setValue(1);
		this.down('#pushNewPrice').setValue(1);
	}
});
