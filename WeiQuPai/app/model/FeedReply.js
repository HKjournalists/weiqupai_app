Ext.define("WeiQuPai.model.FeedReply", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'uid', 'user', 'content', 'ctime', 'to_uid', 'to_nick'],
    }
});