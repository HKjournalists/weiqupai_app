Ext.define('WeiQuPai.store.HisFans', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'HisFans',
        autoLoad: false,
        fields: ['id', 'nick', 'avatar', 'sign'],
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