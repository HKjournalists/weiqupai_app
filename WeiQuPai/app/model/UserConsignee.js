Ext.define("WeiQuPai.model.UserConsignee", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'province', 'city', 'address', 'name', 'mobile', 'email' , 'zip', 'is_default'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/userConsignee',
			reader: {
				type: 'json'
			}
		}
	}
});
