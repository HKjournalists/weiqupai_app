Ext.define('WeiQuPai.view.Setting', {
	extend: 'Ext.Container',
	xtype: 'setting',
	requires: [
		'WeiQuPai.view.DisclosureItem', 'WeiQuPai.view.About', 'WeiQuPai.view.Private', 'WeiQuPai.view.NewMessage'
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '设置',
				docked: 'top'
			},
			{
				xtype: 'disclosureitem',
				title: '新消息通知',
				itemId: 'newMessage'	
			},
			{
				xtype: 'disclosureitem',
				title: '隐私',
				itemId: 'private'	
			},
			{
				xtype: 'disclosureitem',
				title: '关于微趣拍',
				itemId: 'about',
				cls: 'w-disclosure-item w-disclosure-item-single'
			},
			{
				xtype: 'button',
				text: '退出登录',
				cls: 'w-button w-button-logout',
				action: 'logout'
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
