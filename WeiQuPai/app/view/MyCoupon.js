Ext.define('WeiQuPai.view.MyCoupon', {
	extend: 'Ext.dataview.List',
	xtype: 'mycoupon',
	config: {
		store: 'UserCoupon',
		disableSelection: true,
		itemCls: 'w-icon-list-item-container',
		itemTpl: new Ext.XTemplate(
			'<div class="w-icon-list-item w-coupon-list-item">',
			'<span class="coupon-icon coupon-{coupon_info.value}"></span>',
			'<p class="coupon-info">{coupon_info.name} X {num} ',
			'<span class="expire_time">过期时间 {coupon_info.expire_time} <tpl if="coupon_info.expired">[已过期]</tpl></span></p>',
			'</div>'
		),
		items:[
			{
                xtype: 'titlebar',
                title: '我的拍券',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		this.callParent(arguments);
		var user = WeiQuPai.Util.checkLogin();
		if(!user) return;

		WeiQuPai.Notify.clearNotify(WeiQuPai.Notify.MSG_NEW_COUPON);

		this.msgbox = WeiQuPai.Util.msgbox('您还没有任何拍券');
		this.add(this.msgbox);

		var store = this.getStore();
		store.getProxy().setExtraParam('token', user.token);
		store.load(function(records, operation, success){
            if(!success){
                WeiQuPai.Util.toast('数据加载失败');
                return false;
            }
            if(records.length == 0){
            	this.msgbox.show();
            	return;
            }
            if(!WeiQuPai.Util.invalidToken(records[0].raw)){
            	store.removeAll();
            	return false;
            }
        }, this);
	}
});
