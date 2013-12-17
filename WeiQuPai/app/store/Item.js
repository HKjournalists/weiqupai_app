Ext.define('WeiQuPai.store.Item', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Item'],
	config:{
		autoLoad: true,
		model: 'WeiQuPai.model.Item',
		proxy: {
			type: 'ajax',
			url: 'http://localhost:8080/WeiQuPai/data.json',
			reader: 'json'
		}
	}
});
