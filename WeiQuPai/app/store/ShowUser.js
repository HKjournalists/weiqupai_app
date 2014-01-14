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
			//url: WeiQuPai.Config.host + 'showuser1.json',
			reader: 'json'
		}
	}
});
