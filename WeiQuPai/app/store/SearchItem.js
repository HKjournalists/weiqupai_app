Ext.define('WeiQuPai.store.SearchItem', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['id', 'title', 'pic_cover', 'pool_id'],
        storeId: 'SearchItem',
        autoLoad: false,
        pageSize: 16,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/category/search',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});