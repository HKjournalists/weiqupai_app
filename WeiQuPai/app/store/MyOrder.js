Ext.define('WeiQuPai.store.MyOrder', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'MyOrder',
        autoLoad: false,
        model: 'WeiQuPai.model.Order',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/MyOrder',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});