Ext.define('WeiQuPai.store.MyCoupon', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'coupon_info', 'coupon_id', 'num'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/myCoupon',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});