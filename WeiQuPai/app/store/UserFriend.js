Ext.define('WeiQuPai.store.UserFriend', {
	extend: 'Ext.data.Store',
	config:{
		autoLoad: false,
		fields: ['name', 'avatar'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'userfriend.json',
			reader: {
				type: 'json'
			},
			pageParam: false,
			startParam: false,
			limitParam: false
		},

	}
});
