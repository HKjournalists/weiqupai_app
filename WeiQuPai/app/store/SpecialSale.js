Ext.define('WeiQuPai.store.SpecialSale', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.Auction'],
    config: {
        fields: ['id', 'pic_url', 'start_price', 'reserve_price', 'duration', 'left_num', 'selfId', 'item', 'auctions'],
        storeId: 'SpecialSale', 
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/SpecialSale/killEnd',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false,
            pageParam: false
        }
    }
});