Ext.define('WeiQuPai.view.CompanyTitleText', {
	extend: 'Ext.dataview.List',
	xtype: 'companytitletext',
	config: {
		scrollDock: 'top',
		onItemDisclosure: true,
		disableSelection: true,
		scrollable : false,
		height: "134px",
		store: {
			fields: ['title'],
			data: [
				{title: '苹果中国有限责任公司', id: 'shop'}
			]
		},
		itemTpl : '<h2>{title}</h2>'
	}
});
