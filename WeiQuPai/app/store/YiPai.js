Ext.define('WeiQuPai.store.YiPai', {
    extend: 'Ext.data.Store',
    xtype: 'YiPai',
    config: {
        autoLoad: false,
        fields: ['id', 'item', 'auctions'],
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