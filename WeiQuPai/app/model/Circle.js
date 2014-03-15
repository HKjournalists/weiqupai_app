Ext.define("WeiQuPai.model.Circle", {
	extend: 'Ext.data.Model',

	config: {
		fields:['id', 'uid', 'nick', 'avatar', 'content', 'ctime', 'json_data', 'feed_type', 'replies', 'zan'],
		proxy: {
			type: 'ajax',
			url: WeiQuPai.Config.apiUrl + '/?r=app/circle',
			reader: 'json',
			startParam: false,
			limitParam: false
		}
	}
});