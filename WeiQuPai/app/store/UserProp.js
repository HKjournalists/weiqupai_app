Ext.define('WeiQuPai.store.UserProp', {
	extend: 'Ext.data.Store',
	config:{
		autoLoad: false,
		fields: ['id', 'prop_info', 'prop_id', 'num'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + '/?r=app/userProp',
			reader: {
				type: 'json'
			},
			pageParam: false,
			startParam: false,
			limitParam: false
		}
	}
});
