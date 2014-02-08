Ext.define("WeiQuPai.model.MyAuction", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'item_title', 'price', 'ctime', 'defeated', 'pic_url']
	}
});
