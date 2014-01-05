Ext.define("WeiQuPai.model.Order", {
	extend: 'Ext.data.Model',

	config: {
		fields:[
			'consignee', 'payment', 'shipment'
		]		
	}
});
