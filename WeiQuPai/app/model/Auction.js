Ext.define("WeiQuPai.model.Auction", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'item_id', 'curr_price', 'status', 'status_text', 'start_price', 'start_time',
            'round_start_time', 'time_interval', 'curr_round', 'total_round', 'left_time', 'item', 'item_stat',
            'discount'
        ],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/auction',
            reader: 'json'
        }
    }
});