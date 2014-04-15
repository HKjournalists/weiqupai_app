Ext.define("WeiQuPai.model.Shipment", {
	extend: 'Ext.data.Model',

	config: {
		fields:['name', 'shipment_id', 'progress', 'remark'],
		proxy:{
			type: 'ajax',
			reader: 'json',
			url: WeiQuPai.Config.apiUrl + '/?r=app/shipment/'
		}
	}
});
