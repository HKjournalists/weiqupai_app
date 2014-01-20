Ext.define('WeiQuPai.view.About', {
	extend: 'Ext.Container',
	xtype: 'pay',
	config: {
		scrollable: true,
		items:[
			{
				xtype: 'titlebar',
				title: '关于微趣拍',
				docked: 'top'
			},
			{
				xtype: 'container',
				cls: 'w-content',
				html: '这里是微趣拍的介绍文字这里是微趣拍的介绍文字这里是微趣拍的介绍文字这里是微趣拍的介绍文字'
			},
			{
				xtype: 'bottombar'
			}
		]
	}, 
	
});
