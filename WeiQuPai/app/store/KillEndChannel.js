Ext.define('WeiQuPai.store.KillEndChannel', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'KillEndChannel',
        autoLoad: false,
        fields: ['id', 'pic_url', 'start_price', 'reserve_price', 'duration', 'left_num', 'selfId', 'item', 'auctions'],
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/auctionPool',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});