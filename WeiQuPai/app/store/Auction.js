Ext.define('WeiQuPai.store.Auction', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'Auction',
        autoLoad: false,
        model: 'WeiQuPai.model.Auction',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/today',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
            pageParam: false
        }
    }
});