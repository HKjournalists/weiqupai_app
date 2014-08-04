Ext.define('WeiQuPai.store.Prop', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        fields: ['id', 'name', 'description', 'action', 'score'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=appv2/prop',
            reader: {
                type: 'json'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    }
});