Ext.define("WeiQuPai.model.Auction", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'item_id', 'title', 'model', 'curr_price', 'oprice', 'pic_cover', 'pic_url', 'description', 'status',
            'status_text', 'start_time', 'round_start_time', 'time_interval', 'shop', 'brand', 'curr_round', 'total_round', 'left_time', 'item_stat'
        ],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/auction',
            reader: 'json'
        }
    }
});