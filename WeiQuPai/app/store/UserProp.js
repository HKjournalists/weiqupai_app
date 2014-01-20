Ext.define('WeiQuPai.store.UserProp', {
	extend: 'Ext.data.Store',
	config:{
		autoLoad: false,
		fields: ['name', 'icon', 'num'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'userprop.json',
			reader: {
				type: 'json'
			},
			pageParam: false,
			startParam: false,
			limitParam: false
		},

	}
});
