Ext.define("WeiQuPai.model.ShowUserLike", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'item_id', 'title', 'pic_cover', 'oprice'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/user/like',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});