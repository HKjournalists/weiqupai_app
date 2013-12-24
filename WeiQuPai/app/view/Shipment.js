Ext.define('WeiQuPai.view.Shipment', {
	extend: 'Ext.Panel',
	xtype: 'shipment',
	require: [
	],

	config: {
		title: '物流详情',
		items:[
			{
				html: '查看物流的页面'
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
