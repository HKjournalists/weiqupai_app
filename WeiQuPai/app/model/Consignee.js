Ext.define("WeiQuPai.model.Consignee", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'province', 'city', 'address', 'name', 'mobile', 'email', 'zip', 'is_default'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/myConsignee',
            reader: {
                type: 'json'
            }
        }
    }
});