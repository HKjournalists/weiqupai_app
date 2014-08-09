Ext.define('WeiQuPai.store.PrivateMessage', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        storeId: 'PrivateMessage',
        model: 'WeiQuPai.model.Message',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/message/pm',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});