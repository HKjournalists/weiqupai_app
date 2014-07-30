Ext.define("WeiQuPai.model.UserAuction", {
    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'item_id', 'title', 'item', 'curr_price', 'oprice', 'pic_cover', 'pic_url', 'description', 'status',
            'status_text', 'start_time', 'round_start_time', 'time_interval', 'curr_round', 'total_round', 'left_time', 'item_stat'
        ],
        proxy: {
            type: 'ajax',
            url: WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction',
            reader: 'json'
        }
    }
});