Ext.define('WeiQuPai.view.MyAccount', {
	extend: 'Ext.Container',
	xtype: 'myaccount',
	requires: [
		'WeiQuPai.view.DisclosureItem'
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '帐号绑定',
				docked: 'top'
			},
			{
				xtype: 'disclosureitem',
				title: '新浪微博',
				itemId: 'weibo'	
			},
			{
				xtype: 'disclosureitem',
				title: 'QQ登录',
				itemId: 'qq'	
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
