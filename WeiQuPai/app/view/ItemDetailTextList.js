Ext.define('WeiQuPai.view.ItemDetailTextList', {
	extend: 'Ext.dataview.List',
	xtype: 'itemdetailtextlist',
	config: {
		scrollDock: 'top',
		onItemDisclosure: true,
		disableSelection: true,
		scrollable : false,
		height: "90px",
		store: {
			fields: ['title'],
			data: [
				{title: '拍品详情', id: 'itemdetailinfo'},
				{title: '商家介绍', id: 'shop'}
			]
		},
		itemTpl : '{title}'
	}
});
