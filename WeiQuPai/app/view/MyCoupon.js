Ext.define('WeiQuPai.view.MyCoupon', {
	extend: 'Ext.dataview.List',
	xtype: 'mycoupon',
	config: {
		store: 'UserCoupon',
		disableSelection: true,
		itemCls: 'w-icon-list-item-container',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item w-coupon-list-item">',
			'<span class="coupon-icon"><span class="value">{coupon_info.value}</span>元</span>',
			'<p>{name} X {num}</p>',
			'</div>'
		),
		items:[
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		var user = WeiQuPai.Cache.get('currentUser');
		if(!user) return;
		var store = this.getStore();
		store.getProxy().setExtraParam('token', user.token);
		store.load(function(data, operation, success){
            if(!success){
                Ext.Msg.alert(null, '数据加载失败');
            }
        });
	}
});
