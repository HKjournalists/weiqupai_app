Ext.define('WeiQuPai.store.SpecialSale', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.Auction'],
    config: {
        storeId: 'SpecialSale',
        autoLoad: false,
        model: 'WeiQuPai.model.Auction',
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/SpecialSale',
            reader: {
                type: 'json',
                rootProperty: 'auctions'
            },
            startParam: false,
            limitParam: false,
            pageParam: false
        }
    }
});