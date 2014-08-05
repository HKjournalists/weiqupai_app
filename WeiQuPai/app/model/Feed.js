Ext.define("WeiQuPai.model.Feed", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'uid', 'user', 'content', 'ctime', 'json_data', 'feed_type', 'replies', 'zan', 'zan_num', 'reply_num'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=app/circle',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});