Ext.define("WeiQuPai.model.Profile", {
	extend: 'Ext.data.Model',

	config: {
		fields:[
			'id', 'uname', 'score', 'level', 'friend_num', 'nick', 'avatar', 'circle_bg', 'real_name', 'sign', 'gender', 'email', 'phone', 'is_svip', 'type'
		],	

		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/profile',
			reader: 'json'
		}
	}
});
