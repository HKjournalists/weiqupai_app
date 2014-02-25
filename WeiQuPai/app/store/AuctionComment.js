Ext.define('WeiQuPai.store.AuctionComment', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.AuctionComment'],
	config:{
		storeId: 'AuctionComment',
		autoLoad: false,
		model: 'WeiQuPai.model.AuctionComment',
		pageSize: 5,
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/comment',
			reader: {
				type: 'json',
				rootProperty: 'records'
			},
			startParam: false,
			limitParam: false
		}
	}
});
