Ext.define('WeiQuPai.store.UserFeed', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Circle'],
	config:{
		storeId: 'UserFeed',
		autoLoad: false,
		model: 'WeiQuPai.model.Circle',
		pageSize: 10,
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + '/?r=app/circle/userFeed',
			reader: 'json',
			startParam: false,
			limitParam: false
		}
	}
});
