Ext.define('WeiQuPai.store.SiteMessage', {
	extend: 'Ext.data.Store',
	requires: ['WeiQuPai.model.SiteMessage'],
	config:{
		//autoLoad: true,
		model: 'WeiQuPai.model.SiteMessage',
		proxy: {
			type: 'ajax',
			//url: '',
			url: WeiQuPai.Config.host + 'sitemessage.json',
			reader: 'json'
		}
	}
});