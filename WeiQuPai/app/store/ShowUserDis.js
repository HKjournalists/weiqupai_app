Ext.define('WeiQuPai.store.ShowUserDis', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'ShowUserDis',
        autoLoad: false,
        model: 'WeiQuPai.model.ShowUserDis',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/comment',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});