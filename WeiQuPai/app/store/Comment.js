Ext.define('WeiQuPai.store.Comment', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.Comment'],
    config: {
        storeId: 'Comment',
        autoLoad: false,
        model: 'WeiQuPai.model.Comment',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/comment',
            reader: {
                type: 'json',
                rootProperty: 'records'
            },
            startParam: false,
            limitParam: false
        }
    }
});