Ext.define('WeiQuPai.store.SearchUser', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'SearchUser',
        autoLoad: false,
        fields: ['id', 'nick', 'avatar', 'sign', 'followed'],
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/searchUser',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});