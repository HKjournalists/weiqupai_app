Ext.define('WeiQuPai.store.CircleFollow', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'CircleFollow',
        autoLoad: false,
        model: 'WeiQuPai.model.Feed',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/circle/follow',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});