Ext.define('WeiQuPai.store.Discount', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        model: 'WeiQuPai.model.Discount',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/discount',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});