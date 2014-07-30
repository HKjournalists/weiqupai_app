Ext.define('WeiQuPai.store.Banner', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['pic_url', 'link', 'type', 'title', 'auction'],
        storeId: 'Banner',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/banner',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
            pageParam: false
        }
    }
});