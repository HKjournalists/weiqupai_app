Ext.define('WeiQuPai.store.UserAuctionComment', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'UserAuctionComment',
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