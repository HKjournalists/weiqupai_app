Ext.define('WeiQuPai.view.MyCoupon', {
	extend: 'Ext.dataview.List',
	xtype: 'myfriend',
	config: {
		store: 'UserCoupon',
		disableSelection: true,
		itemCls: 'w-icon-list-item-container',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item w-coupon-list-item">',
			'<img src="{icon}">',
			'<p>{name} X {num}</p>',
			'</div>'
		),
		items:[
			{
				xtype: 'titlebar',
				title: '我的拍券',
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
