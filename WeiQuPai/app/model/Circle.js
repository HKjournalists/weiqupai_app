Ext.define("WeiQuPai.model.Circle", {
	extend: 'Ext.data.Model',

	config: {
		fields:[
			{name: 'name', type: 'string'},
			{name: 'trans_id', type: 'string'},
			{name: 'user_icon', type: 'string'},
			{name: 'user_class', type: 'string'},
			{name: 'action', type: 'string'},
			{name: 'action_class', type: 'int'},
			{name: 'content', type: 'string'},
			{name: 'pic'},
			{name: 'time', type: 'string'}
		]
	}
});