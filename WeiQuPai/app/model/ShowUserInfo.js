Ext.define("WeiQuPai.model.ShowUserInfo", {
	extend: 'Ext.data.Model',
	config: {
		fields: [ 'id', 'user_name', 'user_bg', 'user_icon', 'user_class'],

		//hasMany: {
		//	model: 'WeiQuPai.model.Message',
		//	name: 'messages'
		//},

		//proxy: {
		//	type: 'ajax', 
		//	url: WeiQuPai.Config.host + 'message.json'
		//}
	}
});