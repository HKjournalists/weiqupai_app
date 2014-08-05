Ext.define("WeiQuPai.model.Comment", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'uid', 'user', 'item', 'content', 'ctime', 'up_num', 'reply_num', 'reply_id', 'replies', 'item_id', 'auction_id']
    }
});