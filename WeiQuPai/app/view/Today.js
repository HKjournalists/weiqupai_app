Ext.define('WeiQuPai.view.Today', {
	extend: 'Ext.Container',
	xtype: 'today',
	requires: [
		'WeiQuPai.view.ItemList', 'WeiQuPai.view.IndexAd', 'WeiQuPai.view.ItemDetail'
	],

	config: {
		layout: 'vbox',
		items:[
			{
				flex: 1,
				xtype: 'itemlist'
			}
		]
	}
});
