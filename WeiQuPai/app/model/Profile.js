Ext.define("WeiQuPai.model.Profile", {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id', 'uname', 'score', 'level', 'nick', 'avatar', 'circle_bg', 'real_name', 'sign',
            'gender', 'email', 'phone', 'is_svip', 'type', 'comment_num', 'fans_num', 'follow_num'
        ],

        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/profile',
            reader: 'json'
        }
    }
});