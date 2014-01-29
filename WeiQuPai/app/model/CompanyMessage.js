Ext.define("WeiQuPai.model.CompanyMessage", {
	extend: 'Ext.data.Model',
	config: {
		fields: [ 'id', 'trans_id', 'content', 'time']

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