Ext.define('WeiQuPai.store.NoticeToday', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'noticetoday',
        autoLoad: false,
        fields: ['id', 'item', 'item_id', 'item_stat', 'start_time'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?=appv2/auctionNotice&day=' + 1,
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});