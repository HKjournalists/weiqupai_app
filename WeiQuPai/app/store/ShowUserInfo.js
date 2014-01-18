Ext.define('WeiQuPai.store.ShowUserInfo', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.ShowUserInfo'],
	config:{
		//autoLoad: true,
		model: 'WeiQuPai.model.ShowUserInfo',
		proxy: {
			type: 'ajax',
			//url: '',
			url: WeiQuPai.Config.host + 'user.json',
			reader: 'json'
		}
	}
});