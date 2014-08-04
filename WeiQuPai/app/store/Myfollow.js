Ext.define('WeiQuPai.store.Myfollow', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'Myfollow',
        autoLoad: false,
        fields: ['id', 'nick', 'avatar'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/follow',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});