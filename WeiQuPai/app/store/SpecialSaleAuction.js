Ext.define('WeiQuPai.store.SpecialSaleAuction', {
    extend: 'Ext.data.Store',
    config: {
        model: 'WeiQuPai.model.Auction',
        storeId: 'SpecialSaleAuction', 
        autoLoad: false,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/SpecialSale',
            reader: {
                type: 'json',
                rootProperty: 'auctions'
            },
            startParam: false,
            limitParam: false,
        }
    }
});