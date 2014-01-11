Ext.define('WeiQuPai.view.My', {
	extend: 'Ext.Panel',
	xtype: 'my',
	require: [
		//'WeiQuPai.view.ItemList',
	],

	config: {
		items:[
			{
				xtype: 'titlebar',
				title: '我的',
				docked: 'top'
			},
			{
				xtype: 'button',
				title: 'test',
				handler: function(){
					console.log('button tapped');
				}
			}
		]
	}
});
