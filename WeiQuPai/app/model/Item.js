Ext.define("WeiQuPai.model.Item", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'title', 'model', 'curr_price', 'mprice', 'pic_cover', 'pic_url', 'description', 'shop_id', 'status', 'status_text', 'start_time'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '?r=app/today/detail',
			reader: 'json'
		}
	}
});
