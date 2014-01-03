Ext.define('WeiQuPai.store.Circle', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Circle'],
	config:{
		autoLoad: true,
		model: 'WeiQuPai.model.Circle',
		proxy: {
			type: 'ajax',
			url: config.host + 'circle.json',
			reader: 'json'
		}
	}
});
