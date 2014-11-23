Ext.define('WeiQuPai.store.AuctionList', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'AuctionList',
        autoLoad: false,
        model: 'WeiQuPai.model.Auction',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/auction/list',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
        },
        pageSize: 10
    }
});