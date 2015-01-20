Ext.define("WeiQuPai.model.Item", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'title', 'model', 'specification', 'oprice', 'pic_cover', 'pic_url', 'pic_top', 'description', 'content', 'type', 'item_stat', 'shop', 'brand', 'auction', 'user_auction'],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/item',
            reader: 'json'
        }
    }
});