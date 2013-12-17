Ext.define('WeiQuPai.view.MyAuction', {
	extend: 'Ext.Panel',
	xtype: 'myauction',
	require: [
		//'WeiQuPai.view.ItemList',
	],

	config: {
		items:[
			{
				html: '已拍的内容'
			}
		]
	}
});
