Ext.define('WeiQuPai.store.ShowUserLike', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'ShowUserLike',
        autoLoad: false,
        model: 'WeiQuPai.model.ShowUserLike',
        pageSize: 15,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/like',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});