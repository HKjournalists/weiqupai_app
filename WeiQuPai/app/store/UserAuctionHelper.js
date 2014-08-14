Ext.define('WeiQuPai.store.UserAuctionHelper', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'UserAuctionHelper',
        autoLoad: false,
        fields: ['id', 'discount', 'ctime', 'source', 'user'],
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/listHelper',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
        }
    }
});