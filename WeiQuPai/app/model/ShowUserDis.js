Ext.define("WeiQuPai.model.ShowUserDis", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'uid', 'user', 'item', 'zan', 'content', 'ctime', 'zan_num', 'reply_num', 'reply_id', 'replies', 'item_id', 'auction_id'],

        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/user/comment',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});