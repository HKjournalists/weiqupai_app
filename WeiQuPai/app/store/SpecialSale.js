Ext.define('WeiQuPai.store.SpecialSale', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.Auction'],
    config: {
        fields: ['id', 'pic_url', 'start_price', 'reserve_price', 'duration', 'left_num', 'selfId', 'item', 'auctions'],
        storeId: 'SpecialSale', 
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
            limitParam: false
        }
    }
});