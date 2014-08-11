Ext.define('WeiQuPai.store.Discount', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'title', 'pic_url', 'description', 'url', 'only_once', 'expire_time'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/discount',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});