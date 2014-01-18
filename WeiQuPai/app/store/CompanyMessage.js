Ext.define('WeiQuPai.store.CompanyMessage', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.CompanyMessage'],
	config:{
		//autoLoad: true,
		model: 'WeiQuPai.model.CompanyMessage',
		proxy: {
			type: 'ajax',
			//url: '',
			url: WeiQuPai.Config.host + 'companymessage.json',
			reader: 'json'
		}
	}
});