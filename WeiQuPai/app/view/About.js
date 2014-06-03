Ext.define('WeiQuPai.view.About', {
	extend: 'Ext.Container',
	xtype: 'about',
	config: {
		scrollable: true,
		layout: 'vbox',
		items:[
			{
                xtype: 'titlebar',
                title: '关于微趣拍',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				flex: 1,
				style: "width:100%;height:100%;background:url(resources/images/aboutus.png) center center no-repeat;background-size:contain"
			},
			{
				xtype: 'bottombar'
			}
		]
	}
	
});
