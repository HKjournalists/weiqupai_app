Ext.define("WeiQuPai.model.Reserve", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'item_id', 'title', 'curr_price', 'pic_cover', 'status', 'curr_round'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/reserve',
			reader: 'json'
		}
	}
});
