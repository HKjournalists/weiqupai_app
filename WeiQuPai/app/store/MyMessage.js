Ext.define('WeiQuPai.store.MyMessage', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        storeId: 'MyMessage',
        model: 'WeiQuPai.model.Message',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/message',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});