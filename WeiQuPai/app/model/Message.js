Ext.define("WeiQuPai.model.Message", {
	extend: 'Ext.data.Model',

	config: {
		fields:[ 'id', 'trans_id', 'action', 'action_class', 'content', 'pic', 'time'],

		belongsTo:{
			model: 'WeiQuPai.model.User',
			name: 'user'
		}
	}
});