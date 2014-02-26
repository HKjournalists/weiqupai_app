Ext.define("WeiQuPai.model.UserConsignee", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'province', 'city', 'address', 'name', 'mobile', 'email' , 'zip'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + '/?r=app/userConsignee',
			reader: {
				type: 'json'
			}
		}
	}
});
