Ext.define('WeiQuPai.store.MyConsignee', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        storeId: 'MyConsignee',
        model: 'WeiQuPai.model.Consignee',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/myConsignee',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});