Ext.define("WeiQuPai.model.Comment", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'uid', 'user', 'item', 'content', 'ctime', 'zan_num', 'reply_num', 'reply_id', 'replies', 'zan', 'item_id', 'auction_id'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/comment/view',
            reader: 'json'
        }
    }

});