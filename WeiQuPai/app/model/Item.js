Ext.define("WeiQuPai.model.Item", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'title', 'model', 'oprice', 'pic_cover', 'pic_url', 'description', 'item_stat', 'shop', 'brand', 'auction'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/item',
            reader: 'json'
        }
    }
});