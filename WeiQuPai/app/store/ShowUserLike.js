Ext.define('WeiQuPai.store.ShowUserLike', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.ShowUserLike'],
    config: {
        storeId: 'ShowUserLike',
        autoLoad: false,
        model: 'WeiQuPai.model.ShowUserLike',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/like',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});