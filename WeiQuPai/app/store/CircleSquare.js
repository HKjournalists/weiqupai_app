Ext.define('WeiQuPai.store.CircleSquare', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'CircleSquare',
        autoLoad: false,
        model: 'WeiQuPai.model.Feed',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/circle',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});