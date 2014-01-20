Ext.define("WeiQuPai.model.ShowUserMessage", {
	extend: 'Ext.data.Model',

	config: {
		fields:[ 'id', 'trans_id', 'action', 'action_class', 'content', 'pic', 'ups', 'comments', 'time'],

		//belongsTo:{
		//	model: 'WeiQuPai.model.User',
		//	name: 'user'
		//}
	}
});