Ext.define('WeiQuPai.view.Auction', {
	extend: 'Ext.Panel',
	xtype: 'auction',
	require: [
		//'WeiQuPai.view.ItemList',
	],

	config: {
		items:[
			{
				html: '这里是在拍的页面'
			}
		]
	}
});
