Ext.define('WeiQuPai.store.UserAuction', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'UserAuction',
        autoLoad: false,
        model: 'WeiQuPai.model.UserAuction',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/auctionPool',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
        }
    }
});