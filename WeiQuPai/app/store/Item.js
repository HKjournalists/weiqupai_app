Ext.define('WeiQuPai.store.Item', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Item'],
	config:{
		autoLoad: true,
		model: 'WeiQuPai.model.Item',
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'data.json',
			reader: 'json'
		}
	}
});
