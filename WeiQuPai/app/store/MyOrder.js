Ext.define('WeiQuPai.store.MyOrder', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.Order'],
    config: {
        storeId: 'MyOrder',
        autoLoad: false,
        model: 'WeiQuPai.model.Order',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=app/MyOrder',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});