Ext.define('WeiQuPai.store.Coupon', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'name', 'value', 'expire_time', 'score'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/coupon',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});