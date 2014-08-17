Ext.define('WeiQuPai.store.Category', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['id', 'title', 'parent_id', 'childs'],
        storeId: 'Category',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/category',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
            pageParam: false
        }
    }
});