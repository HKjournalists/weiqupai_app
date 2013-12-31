Ext.define('WeiQuPai.view.MyAuctionTextList', {
	extend: 'Ext.dataview.List',
	xtype: 'myauctiontextlist',
	config: {
		scrollDock: 'top',
		onItemDisclosure: true,
		disableSelection: true,
		scrollable : false,
		height: "134px",
		store: {
			fields: ['title'],
			data: [
				{title: '北京商贸有限公司', id: 'shop'},
				{title: '查看物流', id: 'shipment'},
				{title: '查看晒单', id: 'showorder'}
			]
		},
		itemTpl : '{title}'
	}
});
