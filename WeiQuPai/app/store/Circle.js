Ext.define('WeiQuPai.store.Circle', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.Circle'],
	config:{
		autoLoad: true,
		model: 'WeiQuPai.model.Circle',
		proxy: {
			type: 'ajax',
			url: 'http://localhost:8080/WeiQuPai/data.json',
			reader: 'json'
		}
	}
});
