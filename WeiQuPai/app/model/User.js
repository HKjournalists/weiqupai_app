Ext.define("WeiQuPai.model.User", {
	extend: 'Ext.data.Model',
	requires: ['WeiQuPai.model.Message'],
	config: {
		fields: [ 'id', 'user_name', 'user_bg', 'user_icon', 'user_class', 'action', 'action_class', 'content', 'pic', 'time'],

		hasMany: {
			model: 'WeiQuPai.model.Message',
			name: 'messages'
		},

		proxy: {
			type: 'ajax', 
			url: WeiQuPai.Config.host + 'user.json'
		}
	}
});