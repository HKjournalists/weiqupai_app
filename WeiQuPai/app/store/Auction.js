Ext.define('WeiQuPai.store.Auction', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Auction'],
	config:{
		storeId: 'Auction',
		autoLoad: false,
		model: 'WeiQuPai.model.Auction',
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/today',
			reader: {
				type: 'json'
			},
			startParam: false,
			limitParam: false,
			pageParam: false
		}
	}
});
