Ext.define('WeiQuPai.store.CategoryItem', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['id', 'title', 'pic_cover'],
        storeId: 'CategoryItem',
        autoLoad: false,
        pageSize: 16,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/category/item',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});