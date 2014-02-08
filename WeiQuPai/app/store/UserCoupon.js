Ext.define('WeiQuPai.store.UserCoupon', {
	extend: 'Ext.data.Store',
	config:{
		autoLoad: false,
		fields: ['name', 'value', 'num'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'usercoupon.json',
			reader: {
				type: 'json'
			},
			pageParam: false,
			startParam: false,
			limitParam: false
		}
	}
});
