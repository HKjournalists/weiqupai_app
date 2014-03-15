Ext.define('WeiQuPai.store.FriendRequest', {
	extend: 'Ext.data.Store',
	config:{
		autoLoad: false,
		fields: ['id', 'nick', 'avatar', 'request_uid', 'status', 'message'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/friendRequest',
			reader: {
				type: 'json'
			},
			startParam: false,
			limitParam: false
		}
	}
});
