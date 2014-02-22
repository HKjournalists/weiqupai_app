Ext.define('WeiQuPai.store.Item', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Item'],
	config:{
		storeId: 'Item',
		autoLoad: false,
		model: 'WeiQuPai.model.Item',
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '?r=app/today',
			reader: {
				type: 'json',
			},
			startParam: false,
			limitParam: false,
			pageParam: false
		}
	}
});
