Ext.define('WeiQuPai.store.MyDiscount', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'discount_id', 'discount', 'ctime', 'used'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/myDiscount',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        },
        pageSize: 10
    }
});