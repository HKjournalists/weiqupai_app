Ext.define('WeiQuPai.view.My', {
	extend: 'Ext.Panel',
	xtype: 'my',
	require: [
		//'WeiQuPai.view.ItemList',
	],

	config: {
		items:[
			{
				html: '这里是我的页面'
			}
		]
	}
});
