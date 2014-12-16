Ext.define('WeiQuPai.store.KillEndToday', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'KillEndToday',
        autoLoad: false,
        fields: ['id', 'pic_url', 'start_price', 'reserve_price', 'duration', 'left_num', 'selfId', 'item', 'auctions'],
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/todayV2/kill',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});