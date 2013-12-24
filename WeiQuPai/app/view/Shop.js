Ext.define('WeiQuPai.view.Shop', {
	extend: 'Ext.Panel',
	xtype: 'shop',
	require: [
	],

	config: {
		title: '商户详情',
		items:[
			{
				html: '商户信息的页面'
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
