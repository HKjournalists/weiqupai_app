Ext.define('WeiQuPai.view.MyCoupon', {
	extend: 'Ext.dataview.List',
	xtype: 'mycoupon',
	config: {
		store: 'UserCoupon',
		disableSelection: true,
		itemCls: 'w-icon-list-item-container',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item w-coupon-list-item">',
			'<span class="coupon-icon"><span class="value">{value}</span>元</span>',
			'<p>{name} X {num} {value}</p>',
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
