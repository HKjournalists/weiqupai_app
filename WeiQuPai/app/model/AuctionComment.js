Ext.define("WeiQuPai.model.AuctionComment", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'avatar', 'uid', 'nick', 'content', 'time', 'up_num', 'comment_num']
	}
});
