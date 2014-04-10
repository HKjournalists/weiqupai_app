Ext.define("WeiQuPai.model.Auction", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'item_id', 'title', 'model', 'curr_price', 'oprice', 'pic_cover', 'pic_url', 'description', 'status',
				'status_text', 'start_time', 'round_start_time', 'time_interval', 'shop'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/today/detail',
			reader: 'json'
		}
	}
});
