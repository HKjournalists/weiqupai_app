Ext.define('WeiQuPai.store.ShowUserMessage', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.ShowUserMessage'],
	config:{
		//autoLoad: true,
		model: 'WeiQuPai.model.ShowUserMessage',
		proxy: {
			type: 'ajax',
			//url: '',
			url: WeiQuPai.Config.host + 'showusermessage.json',
			reader: 'json'
		}
	}
});