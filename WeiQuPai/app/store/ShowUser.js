Ext.define('WeiQuPai.store.ShowUser', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.ShowUser'],
	config:{
		//autoLoad: true,
		file_name: 'showuser',
		model: 'WeiQuPai.model.ShowUser',
		proxy: {
			type: 'ajax',
			url: '',
			reader: 'json'
		}
	}
});
