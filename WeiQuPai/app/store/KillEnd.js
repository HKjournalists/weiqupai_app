Ext.define('WeiQuPai.store.KillEnd', {
    extend: 'Ext.data.Store',
    xtype: 'KillEnd',
    config: {
        autoLoad: false,
        fields: ['id', 'pic_url', 'start_price', 'reserve_price', 'duration', 'left_num', 'item', 'auctions'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/auctionPool',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});