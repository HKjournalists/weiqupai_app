Ext.define('WeiQuPai.store.ShowUser', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.ShowUser'],
	config:{
		autoLoad: true,
		model: 'WeiQuPai.model.ShowUser',
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'showuser.json',
			reader: 'json'
		}
	}
});
