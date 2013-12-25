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
				html: '这里是拍圈页面'
			},
			{
				flex: 1,
				xtype: 'circlelist'
			}
		]
	}
});
