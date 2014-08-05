Ext.define("WeiQuPai.model.ShowUserFeed", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'uid', 'user', 'content', 'ctime', 'json_data', 'feed_type', 'replies', 'zan', 'zan_num', 'reply_num'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/user/feed',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});