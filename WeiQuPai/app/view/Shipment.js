Ext.define('WeiQuPai.view.Shipment', {
	extend: 'Ext.Container',
	xtype: 'shipment',

	config: {
		items:[
			{
                xtype: 'titlebar',
                title: '物流跟踪',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				cls: 'w-content',
				html: '订单已经到达知春里站'
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
