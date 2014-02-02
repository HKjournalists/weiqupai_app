Ext.define('WeiQuPai.view.MyProp', {
	extend: 'Ext.dataview.List',
	xtype: 'myprop',
	config: {
		store: 'UserProp',
		disableSelection: true,
		itemCls: 'w-icon-list-item-container',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
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
