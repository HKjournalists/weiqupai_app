Ext.define('WeiQuPai.view.ItemDetailInfo', {
	extend: 'Ext.Container',
	xtype: 'itemdetailinfo',
	requires: ['WeiQuPai.view.BottomBar'],
	config: {
		title: '拍品详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
		html: '<p>这里是拍品的详细描述</p>',
		items: [
			{
				xtype: 'titlebar',
				title: '拍品详情',
				docked: 'top'
			},
			{
			xtype: 'bottombar'
			}
		]
	}
});
