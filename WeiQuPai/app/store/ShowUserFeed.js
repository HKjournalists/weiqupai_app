Ext.define('WeiQuPai.store.ShowUserFeed', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'ShowUserFeed',
        autoLoad: false,
        model: 'WeiQuPai.model.Feed',
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