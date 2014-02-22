Ext.define("WeiQuPai.model.AuctionComment", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'avatar', 'uid', 'nick', 'content', 'ctime', 'up_num', 'reply_num', 'reply_id', 'replies']
	}
});
