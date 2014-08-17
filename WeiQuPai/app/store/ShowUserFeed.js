Ext.define('WeiQuPai.store.ShowUserFeed', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'ShowUserFeed',
        autoLoad: false,
        model: 'WeiQuPai.model.Feed',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/feed',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});