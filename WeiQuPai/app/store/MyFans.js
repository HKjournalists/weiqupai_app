Ext.define('WeiQuPai.store.MyFans', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'MyFans',
        autoLoad: false,
        fields: ['id', 'nick', 'avatar'],
        pageSize: 100,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/follow/fans',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});