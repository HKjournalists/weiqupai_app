Ext.define('WeiQuPai.store.UserFeed', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'UserFeed',
        autoLoad: false,
        model: 'WeiQuPai.model.Feed',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/user/feed',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});