Ext.define('WeiQuPai.store.CircleKillEnd', {
    extend: 'Ext.data.Store',
    config: {
        storeId: 'CircleKillEnd',
        autoLoad: false,
        model: 'WeiQuPai.model.Feed',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/circle/killend',
            reader: 'json',
            startParam: false,
            limitParam: false
        }
    }
});