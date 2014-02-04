Ext.define("WeiQuPai.model.User", {
	extend: 'Ext.data.Model',

	config: {
		fields:[
			'id', 'nick', 'pic_url', 'avatar', 'consignee', 'payment', 'shipment'
		]		
	}
});
