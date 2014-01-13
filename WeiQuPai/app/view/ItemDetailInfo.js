Ext.define('WeiQuPai.view.ItemDetailInfo', {
	extend: 'Ext.Container',
	xtype: 'itemdetailinfo',
	requires: ['WeiQuPai.view.BottomBar'],
	config: {
		title: '拍品详情',
		emtpyText: '没有可用的数据',
		store: 'Item',
		items: [
			{
				xtype: 'titlebar',
				title: '拍品详情',
				docked: 'top'
			},
			{
				xtype: 'bottombar'
			},
			{
				xtype: 'container',
				cls: 'item-detail',
				html: '这是测试的内容'				
			}
		]
	}
});
