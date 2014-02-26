Ext.define("WeiQuPai.model.Order", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'auction_id', 'item_id', 'price',
		'total_pay', 'consignee_info', 'payment', 'delivery_time', 'ctime', 'status', 'cancel_reason', 'comment'],
		proxy:{
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/order',
			reader: 'json'
		}
	}
});
