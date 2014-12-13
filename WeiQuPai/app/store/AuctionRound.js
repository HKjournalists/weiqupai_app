Ext.define('WeiQuPai.store.AuctionRound', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['id', 'round', 'price', 'ctime'],
        storeId: 'AuctionRound',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/auctionRound',
            reader: 'json',
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});