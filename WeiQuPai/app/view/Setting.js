Ext.define('WeiQuPai.view.Setting', {
	extend: 'Ext.Panel',
	xtype: 'setting',
	require: [
		//'WeiQuPai.view.ItemList',
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '我的设置',
				docked: 'top'
			}
		]
	}
});
