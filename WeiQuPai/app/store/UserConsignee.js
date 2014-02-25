Ext.define('WeiQuPai.store.UserConsignee', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.UserConsignee'],
	config:{
		autoLoad: false,
		storeId: 'UserConsignee',
		model: 'WeiQuPai.model.UserConsignee',
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + '/?r=app/userconsignee',
			reader: {
				type: 'json'
			},
			pageParam: false,
			startParam: false,
			limitParam: false
		}
	}
});
