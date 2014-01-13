Ext.define("WeiQuPai.model.ShowUser", {
	extend: 'Ext.data.Model',

	config: {
		fields:[
			{name: 'user_name', type: 'string'},
			{name: 'user_bg', type: 'string'},
			{name: 'user_icon', type: 'string'},
			{name: 'user_class', type: 'string'},
			{name: 'action', type: 'string'},
			{name: 'action_class', type: 'int'},
			{name: 'content', type: 'string'},
			{name: 'pic'},
			{name: 'time', type: 'string'},
			{name: 'messages'},
		]
	}
});