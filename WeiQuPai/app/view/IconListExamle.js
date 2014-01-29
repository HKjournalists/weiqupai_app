Ext.define('WeiQuPai.view.IconListExample', {
	extend: 'Ext.dataview.List',
	xtype: 'iconlistexample',
	config: {
		store: 'UserFriend',
		disableSelection: true,
		itemTpl: new Ext.XTemplate(
			'<div class="w-user-list-item">',
			'<img src="{avatar}">',
			'<p>{name}</p>',
			'<div class="w-disclosure"><div class="w-disclosure-inner"></div></div>',
			'</div>'
		),
		items:[
			{
				xtype: 'titlebar',
				title: '我的好友',
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
