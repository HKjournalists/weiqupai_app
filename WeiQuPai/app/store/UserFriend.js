Ext.define('WeiQuPai.store.UserFriend', {
	extend: 'Ext.data.Store',
	config:{
		autoLoad: false,
		fields: ['id', 'nick', 'avatar'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/userFriend',
			reader: {
				type: 'json'
			},
			pageParam: false,
			startParam: false,
			limitParam: false
		}
	}
});
