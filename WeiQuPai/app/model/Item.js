Ext.define("WeiQuPai.model.Item", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'name', 'price', 'market_price', 'pic_url', 'description', 'shop_id'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.host + 'item.json',
			reader: 'json'
		}
	}
});
