Ext.define('WeiQuPai.view.MyFriend', {
	extend: 'WeiQuPai.view.SwipeButtonList',
	requires: ['WeiQuPai.view.SwipeButtonList'],
	xtype: 'myfriend',
	config: {
		store: 'UserFriend',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item">',
			'<img src="{avatar}">',
			'<p>{name}</p>',
			'</div>',
			'<div class="button-area"><div class="swipe-button-delete">删除</div></div>'
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
		console.log(1);
		this.callParent(arguments);
		this.getStore().load();
	}
});
