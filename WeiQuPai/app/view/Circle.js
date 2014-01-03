Ext.define('WeiQuPai.view.Circle', {
	extend: 'Ext.Container',
	xtype: 'circle',
	requires: [
		'WeiQuPai.view.CircleList', 'WeiQuPai.view.CircleAd'
		],
	config: {
		layout: 'vbox',
		items:[
			{
				flex: 1,
				xtype: 'circlelist'
			}
		]
	}
});
