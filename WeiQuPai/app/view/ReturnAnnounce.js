Ext.define('WeiQuPai.view.ReturnAnnounce', {
	extend: 'Ext.Container',
	xtype: 'about',
	config: {
		scrollable: true,
		items:[
			{
                xtype: 'titlebar',
                title: '退货说明',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				cls: 'w-content',
				html: [
					'如果您对我们的货品有不满想要退货，收到货物7天内，请拨打我们的客服电话或者发邮件至我们的客服邮箱，对给您造成的不便我们深表歉意。',
					'退货电话：400-699-9705',
					'邮件地址：kf@vqupai.com'
				].join('<br/>')
			},
			{
				xtype: 'bottombar'
			}
		]
	}
	
});
