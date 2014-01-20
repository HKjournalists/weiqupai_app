Ext.define('WeiQuPai.view.MyProp', {
	extend: 'Ext.dataview.List',
	xtype: 'myfriend',
	config: {
		store: 'UserProp',
		disableSelection: true,
		itemCls: 'w-prop-list-item',
		itemTpl: new Ext.XTemplate(
			'<div class="w-user-list-item">',
			'<img src="{icon}">',
			'<p>{name} X {num}</p>',
			'</div>'
		),
		items:[
			{
				xtype: 'titlebar',
				title: '我的道具',
				docked: 'top'
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		this.getStore().load();
	}
});
