Ext.define('WeiQuPai.store.Circle', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Circle'],
	config:{
		storeId: 'Circle',
		autoLoad: false,
		model: 'WeiQuPai.model.Circle',
		pageSize: 10,
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + '/?r=app/circle',
			reader: 'json',
			startParam: false,
			limitParam: false
		}
	}
});
