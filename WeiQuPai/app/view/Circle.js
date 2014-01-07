Ext.define('WeiQuPai.view.Circle', {
	extend: 'Ext.Container',
	xtype: 'circle',
	requires: [
		'WeiQuPai.view.CircleList', 'WeiQuPai.view.CircleAd', 'WeiQuPai.view.CircleDetail', 'WeiQuPai.view.ShowUser'
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
