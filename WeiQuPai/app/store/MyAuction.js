Ext.define('WeiQuPai.store.MyAuction', {
    extend: 'Ext.data.Store',
    requires: ['WeiQuPai.model.UserAuction'],
    config: {
        storeId: 'MyAuction',
        autoLoad: false,
        model: 'WeiQuPai.model.UserAuction',
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.host + '/?r=app/userAuction',
            reader: {
                type: 'json'
            },
            startParam: false,
            limitParam: false
        }
    }
});