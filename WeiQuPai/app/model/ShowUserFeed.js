Ext.define("WeiQuPai.model.ShowUserFeed", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'avatar', 'ctime', 'content', 'nick', 'uid', 'feed_type', 'json_data', 'reply_num', 'zan_num'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/user/feed',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});