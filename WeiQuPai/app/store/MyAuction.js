Ext.define('WeiQuPai.store.MyAuction', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.MyAuction'],
	config:{
		storeId: 'MyAuction',
		autoLoad: false,
		model: 'WeiQuPai.model.MyAuction',
		pageSize: 10,
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'MyAuction.json',
			reader: {
				type: 'json',
				rootProperty: 'records'
			},
			startParam: false,
			limitParam: false
		}
	}
});
