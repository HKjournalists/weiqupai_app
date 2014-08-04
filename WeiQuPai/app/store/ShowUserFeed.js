Ext.define('WeiQuPai.store.ShowUserFeed', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.ShowUserFeed'],
    config: {
        storeId: 'ShowUserFeed',
        autoLoad: false,
        model: 'WeiQuPai.model.ShowUserFeed',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/feed',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});