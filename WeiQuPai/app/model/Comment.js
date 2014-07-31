Ext.define("WeiQuPai.model.Comment", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'avatar', 'uid', 'nick', 'content', 'ctime', 'up_num', 'reply_num', 'reply_id', 'replies']
    }
});