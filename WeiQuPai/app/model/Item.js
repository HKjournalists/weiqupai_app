Ext.define("WeiQuPai.model.Item", {
	extend: 'Ext.data.Model',

	config: {
		fields:[
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'},
			{name: 'price', type: 'float'},
			{name: 'sold_num', type: 'int'},
			{name: 'attention', type: 'int'},
			{name: 'pic_url', type: 'string'}
		]		
	}
});
