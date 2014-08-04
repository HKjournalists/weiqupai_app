Ext.define('WeiQuPai.store.MyProp', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'prop_id', 'num', 'name', 'description', 'action'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/myProp',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});