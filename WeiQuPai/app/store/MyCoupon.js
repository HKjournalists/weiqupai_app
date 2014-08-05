Ext.define('WeiQuPai.store.MyCoupon', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'coupon', 'coupon_id', 'num', 'expire_time', 'expired'],
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