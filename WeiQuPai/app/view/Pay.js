Ext.define('WeiQuPai.view.Pay', {
	extend: 'Ext.dataview.List',
	xtype: 'pay',
	config: {
		onItemDisclosure: true,
		disableSelection: true,
		store: {
			fields: ['title'],
			data: [
				{title: '收货信息', id: 'shop'},
				{title: '配送方式', id: 'shipment'},
				{title: '配送时间', id: 'shiptime'},
				{title: '优惠信息', id: 'prop'},
				{title: '支付方式', id: 'showorder'}
			]
		},
		itemTpl : new Ext.XTemplate('<h2>{title}</h2>'),
		items: [
			{
				scrollDock: 'top',
				xtype: 'panel',
				html: ['<div class="pay-item-info">',
					'<img src="' + WeiQuPai.Config.host + 'pic/5s.jpg" class="avatar"/>',
					'<div class="info">',
					'<h2>Suit椅</h2>',
					'<div class="price-area">',
					'<span class="price">现价￥55.00</span><span class="total-pay">订单合计 ￥65.00</span>',
					'</div>'].join('')
			},
			{
				xtype: 'bottombar'
			}
		]
	}
});
