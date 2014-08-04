Ext.define("WeiQuPai.model.ShowUserDis", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['avatar', 'content', 'ctime', 'id', 'item', 'item_id', 'nick', 'reply_num', 'uid', 'uname', 'up_num'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/user/comment',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});