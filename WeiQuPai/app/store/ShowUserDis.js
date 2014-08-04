Ext.define('WeiQuPai.store.ShowUserDis', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.ShowUserDis'],
    config: {
        storeId: 'ShowUserDis',
        autoLoad: false,
        model: 'WeiQuPai.model.ShowUserDis',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/comment',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});